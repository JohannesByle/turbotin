$files = Get-ChildItem ".\src\service" -Recurse -File
foreach ($file in $files) {  
    Set-Content $file.FullName ((Get-Content $file.FullName) -replace "\/\* tslint:disable \*\/",       "")
}

npx prettier --write ./src/service