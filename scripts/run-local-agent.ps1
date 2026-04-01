$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$sharedEnvFile = Join-Path $HOME '.claw-dev.env'
$envFile = Join-Path $root '.env'
$defaultClawDevRoot = Join-Path (Split-Path -Parent $root) 'Clawd\claw-dev'
$clawDevRoot = if ($env:CLAW_DEV_ROOT) { $env:CLAW_DEV_ROOT } else { $defaultClawDevRoot }

foreach ($candidate in @($sharedEnvFile, $envFile)) {
  if (Test-Path $candidate) {
    Get-Content $candidate | ForEach-Object {
      $line = $_.Trim()
      if (-not $line -or $line.StartsWith('#')) { return }

      $idx = $line.IndexOf('=')
      if ($idx -lt 1) { return }

      $name = $line.Substring(0, $idx).Trim()
      if (Test-Path "Env:$name") { return }

      $value = $line.Substring($idx + 1).Trim().Trim('"').Trim("'")
      [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
  }
}

# Force local-only provider wiring
$env:CLAW_PROVIDER = 'ollama'
$env:ANTHROPIC_COMPAT_PROVIDER = 'ollama'

# Remove cloud fallback keys in this process
Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:AZURE_OPENAI_API_KEY -ErrorAction SilentlyContinue

if (-not (Test-Path $clawDevRoot)) {
  Write-Error "Could not find Claw Dev workspace at '$clawDevRoot'. Set CLAW_DEV_ROOT to the correct path and retry."
  exit 1
}

$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $npm) {
  $npm = Get-Command npm -ErrorAction SilentlyContinue
}

if (-not $npm) {
  Write-Error 'Could not find npm in PATH.'
  exit 1
}

Write-Host 'Launching local agent through Claw Dev with Ollama-only environment...' -ForegroundColor Green
Write-Host "CLAW_PROVIDER=$env:CLAW_PROVIDER"
Write-Host "OLLAMA_BASE_URL=$env:OLLAMA_BASE_URL"
Write-Host "OLLAMA_MODEL=$env:OLLAMA_MODEL"
$npmArgs = @(
  '--prefix', $clawDevRoot,
  'run', 'dev',
  '--',
  '--provider', 'ollama',
  '--cwd', $root
)

if ($env:OLLAMA_MODEL) {
  $npmArgs += @('--model', $env:OLLAMA_MODEL)
}

$npmArgs += $args

& $npm.Source @npmArgs
exit $LASTEXITCODE
