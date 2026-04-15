<#
.SYNOPSIS
  Syntax-check all PHP files under wordpress/plugins (requires PHP CLI on PATH or -PhpPath).

.EXAMPLE
  pwsh -File wordpress/tools/verify-php-plugins.ps1
  pwsh -File wordpress/tools/verify-php-plugins.ps1 -PhpPath "C:\path\to\php.exe"
#>
[CmdletBinding()]
param(
    [string]$PhpPath = "",
    [string]$Root = ""
)

$ErrorActionPreference = "Stop"

function Resolve-PhpExecutable {
    param([string]$Explicit)
    if ($Explicit -ne "" -and (Test-Path -LiteralPath $Explicit)) {
        return (Resolve-Path -LiteralPath $Explicit).Path
    }
    $cmd = Get-Command php -ErrorAction SilentlyContinue
    if ($cmd) {
        return $cmd.Source
    }
    $candidates = @(
        "$env:LOCALAPPDATA\Programs\Local\resources\extraResources\lightning-services\php-8.2.27+1\bin\win32\php.exe",
        "$env:LOCALAPPDATA\Programs\Local\resources\extraResources\lightning-services\php-8.1.29+1\bin\win32\php.exe",
        "C:\laragon\bin\php\php-8.2.12-Win32-vs16-x64\php.exe",
        "C:\xampp\php\php.exe"
    )
    foreach ($c in $candidates) {
        if (Test-Path -LiteralPath $c) {
            return $c
        }
    }
    return $null
}

if ($Root -eq "") {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $Root = (Resolve-Path (Join-Path $scriptDir "..\plugins")).Path
} else {
    $Root = (Resolve-Path $Root).Path
}

$php = Resolve-PhpExecutable -Explicit $PhpPath
if (-not $php) {
    Write-Error @"
PHP CLI not found.

Fix (pick one):
  1) Install PHP and add it to PATH: https://windows.php.net/download/
  2) Windows Package Manager: winget install --id PHP.PHP.8.3 -e
  3) LocalWP: use the PHP binary under your Local site folder, then run:
     pwsh -File wordpress/tools/verify-php-plugins.ps1 -PhpPath 'C:\path\to\php.exe'

Then re-run this script.
"@
}

Write-Host "Using PHP: $php"
& $php -v

$files = Get-ChildItem -Path $Root -Recurse -Filter "*.php" -File
$failed = $false
foreach ($f in $files) {
    & $php -l $f.FullName 2>&1 | ForEach-Object { $_ }
    if ($LASTEXITCODE -ne 0) {
        $failed = $true
    }
}

if ($failed) {
    exit 1
}
Write-Host "OK: All $($files.Count) PHP file(s) passed syntax check."
exit 0
