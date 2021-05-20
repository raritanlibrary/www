const fs = require('fs');
const fse = require('fs-extra');

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

// Populate _redirects
let redata = `/                                                 /index.html                           200`;
redata += `\n/*                                                /404.html                             404`;
const source = fs.readdirSync('src');
source.forEach(item => {
    if (item.includes('.pug') && !item.includes('index')) {
        let name = item.slice(0, -4);
        let len = name.length;
        let ws = Array(47-len).fill(' ').join('');
        let ws2 = Array(32-len).fill(' ').join('');
        redata += `\n/${name}/*${ws}/${name}.html${ws2}200`;
    }
});
redata += `\n/board                                            /2016LibraryBoardMinutes.html         301
/board                                            /2017BoardMinutes.html                301
/board                                            /2018BoardMeetingMinutes.html         301
/board                                            /2019BoardofTrusteesMinutes.html      301
/porchside-pickup                                 /CurbsidePickUpInstructions.html      301
/passes                                           /databases.html                       301
/gallery                                          /inside.html                          301
/site-map                                         /links.html                           301
/site-map                                         /tree.html                            301
/site-map                                         /tree                                 301
/resources#ebooks                                 /NewE-BooksApp.html                   301
http://raritanpubliclibrarybooks.blogspot.com/    /NoteworthyReads.htm                  301
/resources#language                               /Pronunciator.html                    301
/resources#newspapers                             /StarLedgerLoginInstructions.html     301
/resources#ebooks                                 /ebooks                               301
/resources#education                              /education                            301
/resources#databases                              /databases                            301
/resources#newspapers                             /newspapers                           301
/resources#language                               /language                             301
/history#timeline                                 /timeline                             301
/contact#map                                      /map                                  301
/contact#map                                      /directions                           301
/policies#standards                               /standards                            301
/policies#computers                               /computers                            301
/policies#dvds                                    /dvds                                 301
/policies#printing                                /printing                             301
/policies#ill                                     /ill                                  301
/policies#renewals                                /renewals                             301
/policies#holds                                   /holds                                301`


fs.writeFile('dist/_redirects', redata, function(e){});

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