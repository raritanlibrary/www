const fs = require('fs');

const htmlhack = `\n\nif (!url.includes('.html') && !url.includes('#') && url !== 'http://localhost:1234/') {
    window.location.href = url + '.html'
} else if (!url.includes('.html') && url.includes('#')) {
    window.location.href = url.split("#")[0] + '.html#' + url.split("#")[1]
}`

fs.readFile('src/js/main.js', 'utf8' , (e, data) => {
    if (!data.includes(htmlhack)) {
        fs.writeFile('src/js/main.js', data+htmlhack, e => {});
    }
})