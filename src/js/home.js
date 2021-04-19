import * as main from './main';
const fs = require('fs');
const yaml = require('js-yaml');

// News data
let newsData = fs.readFileSync('src/data/news.yaml', 'utf8');
let news = yaml.load(newsData);
news = news.sort((a, b) => b[1] - a[1]);

window.onload = function() {
    // sidebar defaults
    main.loader()
    // news
    if (main.checkClass(`news`)) {
        let displayed = 0;
        let newsList = ``;
        for (const post of news) {
            let newsLinks = ``;
            let newsImg = ``;
            if (displayed === 3 ) { break };
            if (post[3] && post[4]) {
                newsImg = `<img class="snippet-img" src="img/news/${post[3]}" alt="${post[4]}">`
            }
            if (post[5]) {
                for (const postLink of post[5]) {
                    postLink[2] = postLink[2] ? "target =\"_blank\"" : '';
                    newsLinks += `
                    <a class="snippet-link" href="${postLink[1]}" ${postLink[2]}">
                        <div class="snippet-link-inner">${postLink[0]}</div>
                    </a>
                    `
                }
            }
            post[1] = main.addHours(post[1], 5);
            newsList += `
            <div class="snippet">
            ${newsImg}
                <div class="snippet-body">
                    <a class="h4-link" href="news#${news.length-displayed}">${post[0]}</a>
                    <p class="comment-date">${main.weekday[post[1].getDay()]}, ${main.month[post[1].getMonth()]} ${main.formatDate(post[1].getDate())}, ${post[1].getYear()+1900}</p>
                    <br>
                    <p class="text">${post[2]}</p>
                    ${newsLinks}
                </div>
            </div>
            `
            displayed++;
        }
        main.setClass(`news`, newsList)
    }
};