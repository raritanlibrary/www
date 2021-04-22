const fs = require('fs');
//const fse = require('fs-extra');

// Populate _redirects
let redata = `/*                     /index.html               200`
const source = fs.readdirSync('src');
source.forEach(item => {
    if (item.includes('.pug') && !item.includes('index')) {
        let name = item.slice(0, -4);
        let len = name.length;
        let ws = Array(20-len).fill(' ').join('');
        redata += `\n/${name}/*${ws}/${name}.html${ws}200`;
    }
});

fs.writeFile('dist/_redirects', redata, function(e){});

/*
// Generate static stuff
const statics = [
    "docs",
    "img/events",
    "img/news",
]

statics.forEach(static => {
    let src = `src/${static}`
    let dist = `dist/${static}`
    fse.copySync(src, dist);
});
*/