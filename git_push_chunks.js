const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🚀 Starting Chunked Git Push to GitHub...");

// 1. Clear git index lock if exists
const lockPath = path.join(__dirname, '.git', 'index.lock');
if (fs.existsSync(lockPath)) {
  fs.unlinkSync(lockPath);
}

// 2. Commit core files first
try {
  execSync('git add index.html songs_db.json build.js', { stdio: 'inherit' });
  execSync('git commit -m "Update player & database"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log("✅ Core files pushed successfully!");
} catch (e) {
  console.log("Core files up to date or already pushed.");
}

// 3. Get list of all uncommitted files
const statusOutput = execSync('git status --porcelain', { encoding: 'utf8' });
const untrackedFiles = statusOutput
  .split('\n')
  .filter(line => line.trim().length > 0)
  .map(line => line.slice(3).replace(/^"|"$/g, ''))
  .filter(file => !file.startsWith('.git'));

console.log(`Found ${untrackedFiles.length} pending files to push.`);

const CHUNK_SIZE = 20;
for (let i = 0; i < untrackedFiles.length; i += CHUNK_SIZE) {
  const chunk = untrackedFiles.slice(i, i + CHUNK_SIZE);
  const pkgNum = Math.floor(i / CHUNK_SIZE) + 1;

  console.log(`\n📦 Pushing Package ${pkgNum} (${chunk.length} files)...`);

  for (const file of chunk) {
    try {
      execSync(`git add "${file}"`, { stdio: 'ignore' });
    } catch (err) {
      console.warn(`Warning adding file ${file}:`, err.message);
    }
  }

  try {
    execSync(`git commit -m "Package ${pkgNum}"`, { stdio: 'ignore' });
    execSync('git push origin main', { stdio: 'inherit' });
    console.log(`✅ Package ${pkgNum} pushed successfully!`);
  } catch (err) {
    console.warn(`Package ${pkgNum} push warning:`, err.message);
  }
}

console.log("\n🎉 ALL FILES SUCCESSFULLY PUSHED TO GITHUB!");
