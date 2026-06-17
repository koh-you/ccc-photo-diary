$ErrorActionPreference = "Stop"

$appDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$secretPath = Join-Path $appDir ".openai-api-key.dpapi"

Write-Host "CCC OpenAI API key setup"
Write-Host "1. OpenAI API key 전체를 먼저 클립보드에 복사하세요."
Write-Host "2. 키는 sk- 로 시작해야 합니다."
Write-Host ""

$key = (Get-Clipboard -Raw).Trim()

if (-not $key.StartsWith("sk-")) {
  Write-Host "클립보드의 값이 sk- 로 시작하지 않습니다."
  Write-Host "OpenAI API key 전체를 다시 복사한 뒤 이 파일을 다시 실행하세요."
  Read-Host "Enter를 누르면 닫힙니다"
  exit 1
}

$secure = ConvertTo-SecureString $key -AsPlainText -Force
$encrypted = ConvertFrom-SecureString $secure
Set-Content -LiteralPath $secretPath -Value $encrypted -Encoding ASCII

Write-Host "저장 완료: $secretPath"
Write-Host "키 원문은 저장하지 않고 Windows DPAPI로 암호화했습니다."
Read-Host "Enter를 누르면 닫힙니다"
