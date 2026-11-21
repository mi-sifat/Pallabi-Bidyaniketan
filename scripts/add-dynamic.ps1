$pages = Get-ChildItem "e:\mis project\Pallabi Bidyaniketan\pallabi-school\src\app\[locale]" -Recurse -Filter "page.tsx"
foreach ($p in $pages) {
    $content = [System.IO.File]::ReadAllText($p.FullName)
    $hasPrisma = $content -match "lib/prisma"
    $hasDynamic = $content -match "force-dynamic"
    Write-Host "PRISMA=$hasPrisma | DYN=$hasDynamic | $($p.FullName)"
    if ($hasPrisma -and -not $hasDynamic) {
        Write-Host "  -> Adding force-dynamic to $($p.Name)"
        $newContent = 'export const dynamic = "force-dynamic";' + "`n" + $content
        [System.IO.File]::WriteAllText($p.FullName, $newContent)
    }
}
Write-Host "Done!"
