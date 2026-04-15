param(
    [Parameter(Mandatory = $true)]
    [string]$WpPath
)

$ErrorActionPreference = "Stop"

function Invoke-WpCapture {
    param([string[]]$Args)
    $output = & wp "--path=$WpPath" @Args
    if ($LASTEXITCODE -ne 0) {
        throw ("WP-CLI command failed with exit code {0}: wp --path=`"{1}`" {2}" -f $LASTEXITCODE, $WpPath, ($Args -join " "))
    }
    return $output
}

Write-Host "=== Import Validation Snapshot ==="
Write-Host ""

$postCount = Invoke-WpCapture @("post", "list", "--post_type=post", "--format=count")
$pageCount = Invoke-WpCapture @("post", "list", "--post_type=page", "--format=count")
$issueCount = Invoke-WpCapture @("post", "list", "--post_type=issue", "--format=count")
$eventCount = Invoke-WpCapture @("post", "list", "--post_type=event", "--format=count")
$attachmentCount = Invoke-WpCapture @("post", "list", "--post_type=attachment", "--format=count")
$catCount = Invoke-WpCapture @("term", "list", "category", "--format=count")
$tagCount = Invoke-WpCapture @("term", "list", "post_tag", "--format=count")

Write-Host "Posts:       $postCount"
Write-Host "Pages:       $pageCount"
Write-Host "Issues:      $issueCount"
Write-Host "Events:      $eventCount"
Write-Host "Attachments: $attachmentCount"
Write-Host "Categories:  $catCount"
Write-Host "Tags:        $tagCount"
Write-Host ""

Write-Host "Menus:"
Invoke-WpCapture @("menu", "list")
Write-Host ""

Write-Host "Recent published posts:"
Invoke-WpCapture @("post", "list", "--post_type=post", "--post_status=publish", "--orderby=date", "--order=DESC", "--fields=ID,post_title,post_name,post_date", "--format=table")
Write-Host ""

Write-Host "Validation snapshot complete."
