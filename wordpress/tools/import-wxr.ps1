param(
    [Parameter(Mandatory = $true)]
    [string]$WpPath,

    [Parameter(Mandatory = $true)]
    [string]$WxrPath,

    [switch]$ResetStaging,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

function Invoke-Wp {
    param([string[]]$Args)
    Write-Host ("wp --path=`"{0}`" {1}" -f $WpPath, ($Args -join " "))
    & wp "--path=$WpPath" @Args
    if ($LASTEXITCODE -ne 0) {
        throw ("WP-CLI command failed with exit code {0}: wp --path=`"{1}`" {2}" -f $LASTEXITCODE, $WpPath, ($Args -join " "))
    }
}

if (-not (Test-Path $WxrPath)) {
    throw "WXR file not found: $WxrPath"
}

Invoke-Wp @("core", "is-installed")

& wp "--path=$WpPath" "plugin" "is-installed" "wordpress-importer" | Out-Null
$importerInstalled = $LASTEXITCODE
if ($importerInstalled -ne 0) {
    Invoke-Wp @("plugin", "install", "wordpress-importer", "--activate")
}
else {
    Invoke-Wp @("plugin", "activate", "wordpress-importer")
}

if ($ResetStaging) {
    Invoke-Wp @("db", "reset", "--yes")
    Write-Warning "Database reset completed. Re-run with a fresh install before import."
    exit 0
}

# Pass 1: WXR import (authors created/mapped via --authors=create).
if (-not $Force) {
    $existingCount = (& wp "--path=$WpPath" "post" "list" "--post_type=any" "--format=count")
    if ($LASTEXITCODE -ne 0) {
        throw "Failed checking existing post count. Re-run with a valid WP path."
    }
    if ([int]$existingCount -gt 0) {
        throw "Target already contains content ($existingCount posts). Use -Force to proceed anyway."
    }
}

# Single WXR import (no second full import; avoids duplicate posts).
Invoke-Wp @("import", $WxrPath, "--authors=create")

# Pass 2: media metadata and image derivatives (attachment association repair).
Invoke-Wp @("media", "regenerate", "--yes")

# Normalize rewrites and cache.
Invoke-Wp @("rewrite", "structure", "/%postname%/", "--hard")
Invoke-Wp @("rewrite", "flush", "--hard")
Invoke-Wp @("cache", "flush")

Write-Host "Import complete."
