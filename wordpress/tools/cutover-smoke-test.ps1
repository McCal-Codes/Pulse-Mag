param(
    [Parameter(Mandatory = $true)]
    [string]$BaseUrl,

    [int]$MinStatus = 200,
    [int]$MaxStatus = 399,
    [string[]]$Paths = @("/", "/issues/", "/events/", "/blog/", "/about/")
)

$ErrorActionPreference = "Stop"

Write-Host "Running smoke test for $BaseUrl"
foreach ($path in $Paths) {
    $url = "$BaseUrl$path"
    try {
        $response = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing
        $status = [int]$response.StatusCode
        if ($status -lt $MinStatus -or $status -gt $MaxStatus) {
            throw "Status $status outside allowed range [$MinStatus, $MaxStatus] for $url"
        }
        Write-Host "PASS $status $url"
    } catch {
        Write-Host "FAIL $url"
        throw
    }
}

Write-Host "Smoke test completed."
