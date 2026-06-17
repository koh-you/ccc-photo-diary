$ErrorActionPreference = "Stop"

$appDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$secretPath = Join-Path $appDir ".openai-api-key.dpapi"
$nodePath = "C:\Program Files\nodejs\node.exe"
$serverPath = Join-Path $appDir "server.js"
$port = if ($env:CCC_PORT) { $env:CCC_PORT } else { "8080" }
$pcUrl = "http://127.0.0.1:$port/?v=6"

if (-not (Test-Path -LiteralPath $nodePath)) {
  Write-Host "Node.js not found: $nodePath"
  Write-Host "Install Node.js or update nodePath in start-ccc-server.ps1."
  Read-Host "Press Enter to close"
  exit 1
}

if (-not (Test-Path -LiteralPath $serverPath)) {
  Write-Host "server.js not found: $serverPath"
  Read-Host "Press Enter to close"
  exit 1
}

if (Test-Path -LiteralPath $secretPath) {
  try {
    $encrypted = Get-Content -LiteralPath $secretPath -Raw
    $secure = ConvertTo-SecureString $encrypted
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)

    try {
      $env:OPENAI_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
      Write-Host "Saved OpenAI API key loaded."
    } finally {
      if ($ptr -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
      }
    }
  } catch {
    Write-Host "Saved API key could not be loaded. The server will still start."
    Write-Host "You can enter the API key inside the CCC app screen."
  }
} else {
  Write-Host "No saved OpenAI API key. The server will still start."
  Write-Host "You can enter the API key inside the CCC app screen."
}

$wifiIp = ""
try {
  $ipconfig = ipconfig
  $match = $ipconfig | Select-String -Pattern "IPv4.*?:\s*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)" | Select-Object -First 1
  if ($match -and $match.Matches.Count -gt 0) {
    $wifiIp = $match.Matches[0].Groups[1].Value
  }
} catch {
  $wifiIp = ""
}

Write-Host ""
Write-Host "Starting CCC server..."
Write-Host "PC:      $pcUrl"
if ($wifiIp) {
  Write-Host "iPhone:  http://$wifiIp`:$port/?v=6"
} else {
  Write-Host "iPhone:  Use this PC's Wi-Fi IP address with port $port."
}
Write-Host ""
Write-Host "Keep this window open while using CCC."
Write-Host "If the browser opens too early, press refresh after a second."
Write-Host ""

# Open the browser after the server has had a moment to bind the port.
$browserCommand = "Start-Sleep -Seconds 2; Start-Process '$pcUrl'"
Start-Process -WindowStyle Hidden -FilePath "powershell.exe" -ArgumentList @("-NoProfile", "-Command", $browserCommand)

Set-Location -LiteralPath $appDir
try {
  & $nodePath $serverPath $port
} catch {
  Write-Host ""
  Write-Host "Server failed to start:"
  Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "CCC server stopped."
Read-Host "Press Enter to close"
