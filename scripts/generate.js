const { execSync } = require("child_process");
const fs = require('fs');
const fse = require('fs-extra');

console.log('Running generate.js...');

// Generate git data
const md5 = execSync(`git rev-parse --verify HEAD`).toString().slice(0,2);
const lt = execSync(`git show -s --format=%ci`).toString();
const ltParsed = new Date(lt);
const ltY = (ltParsed.getFullYear() - 2020).toString(36) ;
const ltM = (ltParsed.getMonth()+1).toString(36);
const ltD = (ltParsed.getDate()).toString(36);
fs.writeFile('src/data/_REV', `${ltY}${ltM}${ltD}${md5}`.toUpperCase(), function(e){});

// Generate static stuff
const statics = [
    "docs",
    "img/events",
    "img/news",
    "robots.txt",
    "winnoc.php",
    ".htaccess"
]

statics.forEach(static => {
    let src = `src/${static}`
    let dist = `dist/${static}`
    fse.copySync(src, dist);
});

console.log('Finished generation. Closing...');