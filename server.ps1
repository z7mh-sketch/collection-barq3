$root = "C:\Users\SaudKhalidAlghamdi\leaders-hub"
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
