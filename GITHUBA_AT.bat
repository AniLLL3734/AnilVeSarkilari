@echo off
color 0A
echo GitHub yukleme islemi basliyor... Lutfen bekleyin...

:: Git Lock Temizleme
if exist .git\index.lock del /F /Q .git\index.lock
git reset --mixed origin/main >nul 2>&1

:: Adim 1: Veritabanini olustur
echo Veritabani (songs_db.json) olusturuluyor...
powershell -NoProfile -Command "$mp3s = Get-ChildItem -File | Where-Object { $_.Extension -eq '.mp3' }; $arr = @(); foreach ($m in $mp3s) { $arr += @{"filename"=$m.Name} }; $arr | ConvertTo-Json -Depth 3 | Set-Content 'songs_db.json' -Encoding UTF8"
git add songs_db.json
git commit -m "Veritabani Eklendi" >nul 2>&1
git push origin main >nul 2>&1
echo Veritabani GitHub'a yuklendi!

:: Adim 2: Paketleri gonder
echo Sarkilar paketler halinde gonderiliyor...
powershell -NoProfile -Command "$files = Get-ChildItem -File -Recurse | Where-Object { $_.Extension -ne '.mp4' -and $_.FullName -notmatch '\\\.git\\' -and $_.Name -ne 'songs_db.json' }; $chunkSize = 25; for ($i = 0; $i -lt $files.Count; $i += $chunkSize) { $chunk = $files | Select-Object -Skip $i -First $chunkSize; foreach ($f in $chunk) { git add $f.Name }; $no = [math]::Floor($i/$chunkSize) + 1; git commit -m "Paket $no" >$null 2>&1; git push origin main >$null 2>&1; Write-Host "Paket $no Gitti!" -ForegroundColor Green }"

echo.
echo Islem Tamamlandi! Cikmak icin bir tusa basin...
pause >nul
