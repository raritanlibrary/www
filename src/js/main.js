import * as Time from '../functions/time';
import * as fx from '../functions/fx';
import * as Nav from '../functions/nav';
import * as Data from '../functions/data';

// Favicon mode
if (window.matchMedia('(prefers-color-scheme:light)').matches) {
    document.getElementById('fav-dark').remove();
} else {
    document.getElementById('fav-light').remove();
}

const url = window.location.href
let page;
try {
    page = url.split("/")[3];
    page = page.split(".")[0];
} catch(e) {
    page = '';
}

const pageInjector = (p) => {
    if (p.includes('index') || p === '') {
        if (fx.checkClass(`news`)) {
            let displayed = 0;
            let newsList = ``;
            for (const post of Data.news) {
                let newsLinks = ``;
                let newsImg = ``;
                if (displayed === 3 ) { break };
                if (post[3] && post[4]) {
                    newsImg = `<img class="snippet-img" src="img/news/${post[3]}" alt="${post[4]}">`
                }
                if (post[5]) {
                    for (const postLink of post[5]) {
                        postLink[2] = postLink[2] ? `target ="_blank" rel="noopener"` : '';
                        newsLinks += `
                        <a class="snippet-link" href="${postLink[1]}" ${postLink[2]}">
                            <div class="snippet-link-inner">${postLink[0]}</div>
                        </a>
                        `
                    }
                }
                post[1] = Time.addHours(post[1], 5);
                newsList += `
                <div class="snippet">
                ${newsImg}
                    <div class="snippet-body">
                        <a class="h4-link" href="news#${Data.news.length-displayed}">${post[0]}</a>
                        <p class="comment-date">${Time.weekday[post[1].getDay()]}, ${Time.month[post[1].getMonth()]} ${Time.formatDate(post[1].getDate())}, ${post[1].getYear()+1900}</p>
                        <br>
                        <p class="text">${post[2]}</p>
                        ${newsLinks}
                    </div>
                </div>
                `
                displayed++;
            }
            fx.setClass(`news`, newsList)
        }
    } else if (p.includes('news')) {
        if (fx.checkClass(`news`)) {
            let curYear, nextYear;
            let newsIndex = 0;
            let newsList = [];
            newsList[newsIndex] = ``;
            for (const post of Data.news) {
                curYear = post[1].getYear() + 1900;
                try {
                    nextYear = Data.news[Data.news.indexOf(post) + 1][1].getYear() + 1900;
                } catch(e) {
                    //
                }
                let newsLinks = ``;
                let newsImg = ``;
                if (post[3] && post[4]) {
                    newsImg = `<img class="snippet-img" src="img/news/${post[3]}" alt="${post[4]}">`
                }
                if (post[5]) {
                    for (const postLink of post[5]) {
                        postLink[2] = postLink[2] ? `target ="_blank" rel="noopener"` : '';
                        newsLinks += `
                        <a class="snippet-link" href="${postLink[1]}" ${postLink[2]}">
                            <div class="snippet-link-inner">${postLink[0]}</div>
                        </a>
                        `
                    }
                }
                post[1] = Time.addHours(post[1], 5);
                newsList[newsIndex] += `
                <div class="snippet">
                ${newsImg}
                    <div class="snippet-body" id="${Data.news.length-Data.news.indexOf(post)}">
                        <p class="h4-link" >${post[0]}</p>
                        <p class="comment-date">${Time.weekday[post[1].getDay()]}, ${Time.month[post[1].getMonth()]} ${Time.formatDate(post[1].getDate())}, ${curYear}</p>
                        <br>
                        <p class="text">${post[2]}</p>
                        ${newsLinks}
                    </div>
                </div>
                `
                if (curYear !== nextYear) {
                    newsIndex++;
                    newsList[newsIndex] = ``;
                }
            }
            curYear = curYear + newsIndex;
            let newsOutput = ``;
            for (const year of newsList) {
                let collapser = ""
                let collapserArrow = ""
                if (newsList.indexOf(year) !== 0) {
                    collapser = " newsyear-collapsed"
                    collapserArrow = " newsarrow-collapsed"
                }
                newsOutput += `
                <div class="news-wrapper">
                    <h3 class="news-h3" id="newsheader-${curYear}">${curYear}</h3>
                    <svg class="newsarrow${collapserArrow}" id="newsarrow-${curYear}" xmlns="http://www.w3.org/2000/svg" viewBox="0 -1.5 16 16">
                        <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                    <div class="newsyear${collapser}" id="newsyear-${curYear}">
                        ${year}
                    </div>
                </div>
                `
                fx.setClass(`news`, newsOutput)
                curYear--;
            }
        }
        // Autoscroll if linked
        const urlClean = url.split("#")[1];
        if (urlClean) {
            const scrollId = document.getElementById(urlClean);
            const yearById = scrollId.parentElement.parentElement;
            const arrowById = yearById.parentElement.children[1];
            yearById.classList.remove("newsyear-collapsed");
            arrowById.classList.remove("newsarrow-collapsed");
            scrollId.scrollIntoView();
        }
    }
}

if (page.includes('index')) {
    //
} else if (page.includes('news')) {
    const lastYear = Data.news[0][1].getYear() + 1900;
    const firstYear = Data.news[Data.news.length-1][1].getYear() + 1900;
    for (let i = firstYear; i <= lastYear; i++) {
        window.addEventListener('click', function(e) {   
            const header = document.getElementById(`newsheader-${i}`);
            const arrow = document.getElementById(`newsarrow-${i}`);
            const content = document.getElementById(`newsyear-${i}`);
            if ((header.contains(e.target) || arrow.contains(e.target)) && !content.classList.contains("newsyear-collapsed")) {
                content.classList.add("newsyear-collapsed");
                arrow.classList.add("newsarrow-collapsed");
            } else if ((header.contains(e.target) || arrow.contains(e.target)) && content.classList.contains("newsyear-collapsed")) {
                content.classList.remove("newsyear-collapsed");
                arrow.classList.remove("newsarrow-collapsed");
            }
        });
    }
}

Nav.dropdown();
Nav.sticky();

window.onload = function() {
    Time.injector();
    Data.eventInjector();
    pageInjector(page);
};