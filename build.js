const fs = require('fs');
const path = require('path');

console.log("Şarkı listesi güncelleniyor...");

const dir = __dirname;
// Mp3 ve resim dosyalarını bul
const files = fs.readdirSync(dir).filter(f => f.match(/\.(mp3|jpg|jpeg|png|webp)$/i));
const fileListJson = JSON.stringify(files.map(f => ({name: f})));

// index.html dosyasını oku
const indexPath = path.join(dir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// LOCAL_FILES dizisini yeni dosyalarla değiştir
const regex = /const LOCAL_FILES = \[.*?\];/s;
html = html.replace(regex, `const LOCAL_FILES = ${fileListJson};`);

// Güncellenmiş index.html'i kaydet
fs.writeFileSync(indexPath, html);

console.log(`Başarılı! Toplam ${files.length} dosya index.html içerisine eklendi.`);
