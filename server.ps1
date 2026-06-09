$root = $PSScriptRoot
$port = 3030

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.pdf'  = 'application/pdf'
}

$Script:presence = @{}

function Get-UsersJson {
  $now   = [DateTime]::UtcNow
  $items = @()
  foreach ($key in @($Script:presence.Keys)) {
    $age = ($now - $Script:presence[$key]).TotalSeconds
    if ($age -gt 600) { $Script:presence.Remove($key); continue }
    $status   = if ($age -le 90) { 'online' } else { 'idle' }
    $safeName = $key -replace '"', '\"'
    $items   += "{`"name`":`"$safeName`",`"status`":`"$status`"}"
  }
  return '[' + ($items -join ',') + ']'
}

function Send-Response($stream, $statusLine, $contentType, $bodyData) {
  $bodyBytes = if ($bodyData -is [byte[]]) { $bodyData } else {
    [System.Text.Encoding]::UTF8.GetBytes([string]$bodyData)
  }
  $headers  = "HTTP/1.1 $statusLine`r`n"
  $headers += "Content-Type: $contentType`r`n"
  $headers += "Content-Length: $($bodyBytes.Length)`r`n"
  $headers += "Access-Control-Allow-Origin: *`r`n"
  $headers += "Connection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($headers)
  $stream.Write($headerBytes, 0, $headerBytes.Length)
  $stream.Write($bodyBytes,  0, $bodyBytes.Length)
}

$localIP = (Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -ne '127.0.0.1' -and $_.PrefixOrigin -ne 'WellKnown' } |
  Select-Object -First 1).IPAddress

# TcpListener binds to all interfaces without admin rights
$server = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
$server.Start()

Write-Output "============================="
Write-Output "  Local  : http://localhost:$port"
if ($localIP) { Write-Output "  Network: http://${localIP}:${port}   << share this" }
Write-Output "============================="

while ($true) {
  $client = $null
  try {
    $client = $server.AcceptTcpClient()
    $stream = $client.GetStream()
    $stream.ReadTimeout  = 3000
    $stream.WriteTimeout = 10000

    # ── Read HTTP request ──────────────────────────────────
    $buf      = New-Object byte[] 16384
    $bytesRead = 0
    try { $bytesRead = $stream.Read($buf, 0, $buf.Length) } catch {}
    if ($bytesRead -eq 0) { continue }

    $raw      = [System.Text.Encoding]::UTF8.GetString($buf, 0, $bytesRead)
    $lines    = $raw -split "`r`n"
    $reqParts = $lines[0] -split ' '
    if ($reqParts.Count -lt 2) { continue }

    $method   = $reqParts[0]
    $rawUrl   = $reqParts[1]
    $urlParts = $rawUrl -split '\?', 2
    $path     = [System.Uri]::UnescapeDataString($urlParts[0])
    $query    = if ($urlParts.Count -gt 1) { $urlParts[1] } else { '' }

    # Body (for POST)
    $bodyText = ''
    $sep      = $raw.IndexOf("`r`n`r`n")
    if ($sep -ge 0) { $bodyText = $raw.Substring($sep + 4) }

    # ── Routes ────────────────────────────────────────────
    if ($path -eq '/api/ping' -and $method -eq 'POST') {
      try {
        $data = $bodyText | ConvertFrom-Json
        $name = ("$($data.name)").Trim()
        if ($name -ne '') { $Script:presence[$name] = [DateTime]::UtcNow }
      } catch {}
      Send-Response $stream '200 OK' 'application/json; charset=utf-8' "{`"users`":$(Get-UsersJson)}"
    }
    elseif ($path -eq '/api/users' -and $method -eq 'GET') {
      Send-Response $stream '200 OK' 'application/json; charset=utf-8' "{`"users`":$(Get-UsersJson)}"
    }
    elseif ($path -eq '/api/open' -and $method -eq 'GET') {
      $filePath = ''
      foreach ($param in ($query -split '&')) {
        $kv = $param -split '=', 2
        if ($kv.Count -eq 2 -and $kv[0] -eq 'path') {
          $filePath = [System.Uri]::UnescapeDataString($kv[1]); break
        }
      }
      if ($filePath -and (Test-Path $filePath -PathType Leaf)) {
        Start-Process "msedge.exe" -ArgumentList "`"$filePath`""
      }
      Send-Response $stream '200 OK' 'application/json; charset=utf-8' '{"ok":true}'
    }
    elseif ($path -eq '/api/log-download' -and $method -eq 'POST') {
      try {
        $data   = $bodyText | ConvertFrom-Json
        $vName  = ("$($data.name)").Trim()
        $vEmail = ("$($data.email)").Trim()
        $vFile  = ("$($data.file)").Trim()
        try {
          $vTime = [System.TimeZoneInfo]::ConvertTimeFromUtc([DateTime]::UtcNow,[System.TimeZoneInfo]::FindSystemTimeZoneById('Arab Standard Time')).ToString('yyyy-MM-dd HH:mm')
        } catch { $vTime = [DateTime]::Now.ToString('yyyy-MM-dd HH:mm') }

        # ── Save to downloads.json ──
        $logFile = Join-Path $root 'downloads.json'
        $sn = ($vName  -replace '\\','\\' -replace '"','\"')
        $se = ($vEmail -replace '\\','\\' -replace '"','\"')
        $sf = ($vFile  -replace '\\','\\' -replace '"','\"')
        $entry = "{`"name`":`"$sn`",`"email`":`"$se`",`"file`":`"$sf`",`"time`":`"$vTime`"}"
        if (Test-Path $logFile) {
          $cur = ([System.IO.File]::ReadAllText($logFile,[System.Text.Encoding]::UTF8)).Trim()
          if ($cur -eq '[]' -or $cur -eq '') { $json = "[$entry]" }
          else { $json = $cur.TrimEnd(']') + ",$entry]" }
        } else { $json = "[$entry]" }
        [System.IO.File]::WriteAllText($logFile, $json, [System.Text.Encoding]::UTF8)

        # ── Send email via Outlook COM ──
        try {
          throw 'outlook-send-disabled'  # disabled: Outlook COM was blocking the single-threaded server (site hang). JSON logging above still runs.
          $ol   = New-Object -ComObject Outlook.Application
          $mail = $ol.CreateItem(0)
          $mail.To      = 'salghamdi.c@barq.com'
          $mail.Subject = "Collection Barq - PDF Download | $vName"
          $b  = "<div dir='rtl' style='font-family:Tahoma,Arial;font-size:14px;background:#f8fafc;padding:20px'>"
          $b += "<div style='background:#0f172a;border-radius:12px;padding:24px;max-width:460px;margin:0 auto'>"
          $b += "<h2 style='color:#FBBF24;margin:0 0 16px;font-size:18px'>&#128229; &#062; &#062; $vName</h2>"
          $b += "<table style='width:100%;border-collapse:collapse;font-size:14px'>"
          $b += "<tr><td style='padding:7px 0;color:#94a3b8;width:65px'>&#1575;&#1604;&#1575;&#1587;&#1605;</td><td style='color:#f1f5f9;font-weight:700;padding:7px 0'>$vName</td></tr>"
          $b += "<tr><td style='padding:7px 0;color:#94a3b8'>&#1575;&#1604;&#1576;&#1585;&#1610;&#1583;</td><td style='color:#f1f5f9;padding:7px 0'>$vEmail</td></tr>"
          $b += "<tr><td style='padding:7px 0;color:#94a3b8'>&#1575;&#1604;&#1605;&#1604;&#1601;</td><td style='color:#FBBF24;font-weight:700;padding:7px 0'>$vFile</td></tr>"
          $b += "<tr><td style='padding:7px 0;color:#94a3b8'>&#1575;&#1604;&#1608;&#1602;&#1578;</td><td style='color:#f1f5f9;padding:7px 0'>$vTime</td></tr>"
          $b += "</table>"
          $b += "<p style='color:#52525b;font-size:11px;margin-top:16px;border-top:1px solid #1e293b;padding-top:10px'>Collection Barq - Download Tracker</p>"
          $b += "</div></div>"
          $mail.HTMLBody = $b
          $mail.Send()
          [System.Runtime.Interopservices.Marshal]::ReleaseComObject($mail) | Out-Null
          [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ol)   | Out-Null
        } catch {}

        Send-Response $stream '200 OK' 'application/json; charset=utf-8' '{"ok":true}'
      } catch {
        Send-Response $stream '200 OK' 'application/json; charset=utf-8' '{"ok":false}'
      }
    }
    elseif ($path -eq '/api/downloads' -and $method -eq 'GET') {
      $logFile = Join-Path $root 'downloads.json'
      if (Test-Path $logFile) {
        $content = [System.IO.File]::ReadAllText($logFile,[System.Text.Encoding]::UTF8)
        Send-Response $stream '200 OK' 'application/json; charset=utf-8' $content
      } else {
        Send-Response $stream '200 OK' 'application/json; charset=utf-8' '[]'
      }
    }
    elseif ($path -eq '/api/report' -and $method -eq 'POST') {
      try {
        $data   = $bodyText | ConvertFrom-Json
        $rName  = ("$($data.name)").Trim()
        $rEmail = ("$($data.email)").Trim()
        $rPage  = ("$($data.page)").Trim()
        $rMsg   = ("$($data.message)").Trim()
        $rType  = ("$($data.type)").Trim()
        if ($rType -eq '') { $rType = 'problem' }
        try {
          $rTime = [System.TimeZoneInfo]::ConvertTimeFromUtc([DateTime]::UtcNow,[System.TimeZoneInfo]::FindSystemTimeZoneById('Arab Standard Time')).ToString('yyyy-MM-dd HH:mm')
        } catch { $rTime = [DateTime]::Now.ToString('yyyy-MM-dd HH:mm') }
        $logFile = Join-Path $root 'reports.json'
        $sn = ($rName  -replace '\\','\\' -replace '"','\"')
        $se = ($rEmail -replace '\\','\\' -replace '"','\"')
        $sp = ($rPage  -replace '\\','\\' -replace '"','\"')
        $stype = ($rType -replace '\\','\\' -replace '"','\"')
        $sm = ($rMsg   -replace '\\','\\' -replace '"','\"' -replace "`r",' ' -replace "`n",' ')
        $entry = "{`"name`":`"$sn`",`"email`":`"$se`",`"page`":`"$sp`",`"type`":`"$stype`",`"message`":`"$sm`",`"time`":`"$rTime`"}"
        if (Test-Path $logFile) {
          $cur = ([System.IO.File]::ReadAllText($logFile,[System.Text.Encoding]::UTF8)).Trim()
          if ($cur -eq '[]' -or $cur -eq '') { $json = "[$entry]" }
          else { $json = $cur.TrimEnd(']') + ",$entry]" }
        } else { $json = "[$entry]" }
        [System.IO.File]::WriteAllText($logFile, $json, [System.Text.Encoding]::UTF8)
        Send-Response $stream '200 OK' 'application/json; charset=utf-8' '{"ok":true}'
      } catch {
        Send-Response $stream '200 OK' 'application/json; charset=utf-8' '{"ok":false}'
      }
    }
    elseif ($path -eq '/api/reports' -and $method -eq 'GET') {
      $logFile = Join-Path $root 'reports.json'
      if (Test-Path $logFile) {
        $content = [System.IO.File]::ReadAllText($logFile,[System.Text.Encoding]::UTF8)
        Send-Response $stream '200 OK' 'application/json; charset=utf-8' $content
      } else {
        Send-Response $stream '200 OK' 'application/json; charset=utf-8' '[]'
      }
    }
    else {
      if ($path -eq '/') { $path = '/index.html' }
      $file = Join-Path $root ($path.TrimStart('/').Replace('/', '\'))
      if (Test-Path $file -PathType Leaf) {
        $ext      = [IO.Path]::GetExtension($file).ToLower()
        $ct       = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' }
        $fileData = [IO.File]::ReadAllBytes($file)
        Send-Response $stream '200 OK' $ct $fileData
      } else {
        Send-Response $stream '404 Not Found' 'text/plain; charset=utf-8' 'Not Found'
      }
    }
  } catch {
    # silently ignore connection errors
  } finally {
    try { $client.GetStream().Close() } catch {}
    try { $client.Close()            } catch {}
  }
}
