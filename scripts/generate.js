const { execSync } = require("child_process");
const fs = require('fs');
const fse = require('fs-extra');

console.log('Running generate.js...');

// Generate git data
const hex = Number(execSync(`git rev-list --count main`)).toString(16);
const rev = hex.padStart(3, '0')
fs.writeFile('src/data/_REV', rev.toUpperCase(), e => {});

// Generate static stuff
const statics = [
    "docs",
    "img/events",
    "img/kids",
    "img/news",
    "robots.txt",
    ".htaccess"
]

statics.forEach(static => {
    let src = `src/${static}`
    let dist = `dist/${static}`
    fse.copySync(src, dist);
});

console.log('Finished generation. Closing...');