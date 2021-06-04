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
    "assets",
    "docs",
    "img/events",
    "img/news",
    "robots.txt",
    ".htaccess"
]

statics.forEach(static => {
    let src = `src/${static}`
    let dist = `dist/${static}`
    fse.copySync(src, dist);
});

//Clean up main.js
const htmlhack = `\n\nif (!url.includes('.html') && !url.includes('#') && url !== 'http://localhost:1234/') {
    window.location.href = url + '.html'
} else if (!url.includes('.html') && url.includes('#')) {
    window.location.href = url.split("#")[0] + '.html#' + url.split("#")[1]
}`

fs.readFile('src/js/main.js', 'utf8' , (e, data) => { if (e) {}
    if (data.includes(htmlhack)) {
        fs.writeFile('src/js/main.js', data.split(htmlhack)[0], function(e){});
    }
})

console.log('Finished generation. Closing...');