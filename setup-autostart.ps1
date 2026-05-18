# ============================================================
# setup-autostart.ps1
# شغّل هذا السكريبت مرة واحدة فقط كـ Administrator
# بعدها السيرفر يشتغل تلقائياً مع كل تشغيل للجهاز
# ============================================================

$serverScript = "C:\Users\SaudKhalidAlghamdi\leaders-hub\server.ps1"
$taskName     = "CollectionBarq"
$port         = 3030

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  Write-Error "Run this script as Administrator (right-click -> Run as Administrator)"
  pause
  exit 1
}

Write-Output "[1/4] Registering URL ACL so server can bind to network without admin..."
netsh http delete urlacl url="http://+:${port}/" 2>$null | Out-Null
netsh http add    urlacl url="http://+:${port}/" user="$env:USERDOMAIN\$env:USERNAME" | Out-Null

Write-Output "[2/4] Opening firewall port $port..."
netsh advfirewall firewall delete rule name=$taskName 2>$null | Out-Null
netsh advfirewall firewall add rule name=$taskName dir=in action=allow protocol=TCP localport=$port | Out-Null

Write-Output "[3/4] Creating scheduled task (auto-start at boot)..."
$action   = New-ScheduledTaskAction `
              -Execute  "powershell.exe" `
              -Argument "-NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$serverScript`""
$trigger  = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit 0 -RestartCount 5 -RestartInterval (New-TimeSpan -Minutes 2)
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType S4U -RunLevel Highest

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger `
  -Settings $settings -Principal $principal -Force | Out-Null

Write-Output "[4/4] Starting server now..."
Start-ScheduledTask -TaskName $taskName
Start-Sleep -Seconds 2

$localIP = (Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -ne '127.0.0.1' -and $_.PrefixOrigin -ne 'WellKnown' } |
  Select-Object -First 1).IPAddress

Write-Output ""
Write-Output "=============================================="
Write-Output "  DONE - Server is running and will auto-start"
Write-Output "----------------------------------------------"
Write-Output "  Local   : http://localhost:${port}"
if ($localIP) {
Write-Output "  Network : http://${localIP}:${port}"
Write-Output "  >> Share the Network link with your team <<"
}
Write-Output "=============================================="
Write-Output ""
Write-Output "To STOP auto-start: Disable-ScheduledTask -TaskName '$taskName'"
Write-Output "To CHANGE password: edit js/auth.js -> change PASS value"
pause
