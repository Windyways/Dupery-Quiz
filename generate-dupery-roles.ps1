Write-Host "Generator started!"

$roleFolder = "$PSScriptRoot\images\dupery\roles"
$outputFile = "$PSScriptRoot\data\duperyRoles.js"

$roles = Get-ChildItem $roleFolder -Filter "*.png" | Sort-Object Name

$lines = @()
$lines += "const duperyRoles = ["

foreach ($role in $roles) {
    $fileName = $role.Name
    $name = [System.IO.Path]::GetFileNameWithoutExtension($fileName)

    $displayName = ($name -creplace '([a-z])([A-Z])', '$1 $2') -replace '_', ' '

    $lines += "    { name: `"$displayName`", image: `"$fileName`" },"
}

$lines += "];"

$lines | Set-Content $outputFile

Write-Host "Dupery role data generated!"
Write-Host "Found $($roles.Count) roles."