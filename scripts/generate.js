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
let redata = `/                                     /index.html                                       200`;
const source = fs.readdirSync('src');
source.forEach(item => {
    if (item.includes('.pug') && !item.includes('index')) {
        let name = item.slice(0, -4);
        let len = name.length;
        let ws = Array(32-len).fill(' ').join('');
        let ws2 = Array(49-len).fill(' ').join('');
        redata += `\n/${name}.html${ws}/${name}${ws2}200`;
    }
});
redata += `\n/2016LibraryBoardMinutes.html         /board                                            301
/2017BoardMinutes.html                /board                                            301
/2018BoardMeetingMinutes.html         /board                                            301
/2019BoardofTrusteesMinutes.html      /board                                            301
/CurbsidePickUpInstructions.html      /porchside-pickup                                 301
/databases.html                       /passes                                           301
/inside.html                          /gallery                                          301
/links                                /site-map                                         301
/links.html                           /site-map                                         301
/tree.html                            /site-map                                         301
/tree                                 /site-map                                         301
/NewE-BooksApp.html                   /resources#ebooks                                 301
/NoteworthyReads.htm                  http://raritanpubliclibrarybooks.blogspot.com/    301
/Pronunciator.html                    /resources#language                               301
/StarLedgerLoginInstructions.html     /resources#newspapers                             301
/ebooks                               /resources#ebooks                                 301
/education                            /resources#education                              301
/databases                            /resources#databases                              301
/newspapers                           /resources#newspapers                             301
/language                             /resources#language                               301
/timeline                             /history#timeline                                 301
/map                                  /contact#map                                      301
/directions                           /contact#map                                      301
/standards                            /policies#standards                               301
/computers                            /policies#computers                               301
/dvds                                 /policies#dvds                                    301
/printing                             /policies#printing                                301
/ill                                  /policies#ill                                     301
/renewals                             /policies#renewals                                301
/holds                                /policies#holds                                   301
/*                                    /404                                              404
`


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