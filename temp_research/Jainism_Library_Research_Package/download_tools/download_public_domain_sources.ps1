$ErrorActionPreference = 'Stop'
$OutDir = Join-Path $PSScriptRoot '..\full_texts'
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

Write-Host 'Downloading Jaina Sutras, Part I...'
Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/c/c8/The_sacred_books_of_the_East_%28IA_1922707.0022.001.umich.edu%29.pdf' -OutFile (Join-Path $OutDir 'Jaina_Sutras_Part_I_SBE_22.pdf')

Write-Host 'Downloading Jaina Sutras, Part II...'
Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/d/d4/The_sacred_books_of_the_East_%28IA_1922707.0045.002.umich.edu%29.pdf' -OutFile (Join-Path $OutDir 'Jaina_Sutras_Part_II_SBE_45.pdf')

Write-Host 'Downloading Gommatasara Jiva-kanda...'
Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/8/87/Gommatsara_Jiva-Kand.pdf' -OutFile (Join-Path $OutDir 'Gommatasara_Jiva_Kanda_1927.pdf')

Write-Host 'Downloading Gommatasara Karma-kanda...'
Invoke-WebRequest -Uri 'https://archive.org/download/gommatsarakarmak0000deve/gommatsarakarmak0000deve.pdf' -OutFile (Join-Path $OutDir 'Gommatasara_Karma_Kanda_1927.pdf')

Write-Host 'Downloads complete. Review source and rights metadata before redistribution.'