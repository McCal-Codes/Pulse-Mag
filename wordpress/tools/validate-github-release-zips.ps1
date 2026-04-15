<#
.SYNOPSIS
  Validates GitHub release ZIP root folder structure for Pulse packages.

.DESCRIPTION
  Ensures each ZIP has exactly one top-level root folder and that folder name
  matches the expected package slug (no nested duplicate root).

.EXAMPLE
  pwsh -File wordpress/tools/validate-github-release-zips.ps1

.EXAMPLE
  pwsh -File wordpress/tools/validate-github-release-zips.ps1 -ZipMap @{
    "pulse-mag-core" = "C:\releases\pulse-mag-core-v0.1.2.zip"
    "pulse-seo" = "C:\releases\pulse-seo-v0.2.1.zip"
    "pulse-flipbook" = "C:\releases\pulse-flipbook-v0.1.2.zip"
    "pulse-mag" = "C:\releases\pulse-mag-v0.2.1.zip"
  }
#>
[CmdletBinding()]
param(
    [hashtable]$ZipMap = @{}
)

$ErrorActionPreference = "Stop"

function Get-DefaultZipMap {
    param([string]$ScriptDir)

    $wordpressRoot = Resolve-Path (Join-Path $ScriptDir "..")
    $pluginsDir = Join-Path $wordpressRoot "plugins"
    $themeDir = Join-Path $wordpressRoot "theme"

    return @{
        "pulse-mag-core" = (Join-Path $pluginsDir "pulse-mag-core.zip")
        "pulse-seo" = (Join-Path $pluginsDir "pulse-seo.zip")
        "pulse-flipbook" = (Join-Path $pluginsDir "pulse-flipbook.zip")
        "pulse-mag" = (Join-Path $themeDir "pulse-mag.zip")
    }
}

function Get-ZipEntries {
    param([string]$ZipPath)

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $archive = [System.IO.Compression.ZipFile]::OpenRead($ZipPath)
    try {
        return @($archive.Entries | ForEach-Object { $_.FullName })
    } finally {
        $archive.Dispose()
    }
}

function Test-ZipStructure {
    param(
        [string]$PackageName,
        [string]$ZipPath
    )

    if (-not (Test-Path -LiteralPath $ZipPath)) {
        return [pscustomobject]@{
            Package = $PackageName
            ZipPath = $ZipPath
            Status = "missing"
            Message = "ZIP not found."
        }
    }

    $entries = Get-ZipEntries -ZipPath $ZipPath
    if ($entries.Count -eq 0) {
        return [pscustomobject]@{
            Package = $PackageName
            ZipPath = $ZipPath
            Status = "invalid"
            Message = "ZIP is empty."
        }
    }

    $topRoots = @(
        $entries |
            ForEach-Object { ($_ -split "/")[0] } |
            Where-Object { $_ -ne "" } |
            Select-Object -Unique
    )

    if ($topRoots.Count -ne 1) {
        return [pscustomobject]@{
            Package = $PackageName
            ZipPath = $ZipPath
            Status = "invalid"
            Message = "Expected exactly one root folder, found: $($topRoots -join ', ')"
        }
    }

    if ($topRoots[0] -ne $PackageName) {
        return [pscustomobject]@{
            Package = $PackageName
            ZipPath = $ZipPath
            Status = "invalid"
            Message = "Root folder '$($topRoots[0])' does not match expected '$PackageName'."
        }
    }

    $nested = $entries | Where-Object { $_ -match "^$PackageName/$PackageName/" }
    if ($nested.Count -gt 0) {
        return [pscustomobject]@{
            Package = $PackageName
            ZipPath = $ZipPath
            Status = "invalid"
            Message = "Nested duplicate root detected ($PackageName/$PackageName/...)."
        }
    }

    return [pscustomobject]@{
        Package = $PackageName
        ZipPath = $ZipPath
        Status = "ok"
        Message = "ZIP root structure is valid."
    }
}

if ($ZipMap.Count -eq 0) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $ZipMap = Get-DefaultZipMap -ScriptDir $scriptDir
}

$results = @()
foreach ($package in $ZipMap.Keys) {
    $results += Test-ZipStructure -PackageName $package -ZipPath ([string]$ZipMap[$package])
}

$results | Sort-Object Package | ForEach-Object {
    $prefix = switch ($_.Status) {
        "ok" { "[OK]" }
        "missing" { "[MISSING]" }
        default { "[FAIL]" }
    }
    Write-Host "$prefix $($_.Package): $($_.Message)"
}

$hasInvalid = $results | Where-Object { $_.Status -eq "invalid" }
if ($hasInvalid) {
    exit 1
}

Write-Host "Validation complete."
exit 0
