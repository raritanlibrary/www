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
                if (post.img && post.imgalt) {
                    newsImg = `<img class="snippet-img" src="img/news/${post.img}.png" alt="${post.imgalt}">`
                }
                if (post.buttons) {
                    for (const button of post.buttons) {
                        button.external = button.external ? `target ="_blank" rel="noopener"` : '';
                        newsLinks += `
                        <a class="snippet-link" href="${button.link}" ${button.external}">
                            <div class="snippet-link-inner">${button.name}</div>
                        </a>
                        `
                    }
                }
                post.date = Time.addHours(post.date, 5);
                newsList += `
                <div class="snippet">
                ${newsImg}
                    <div class="snippet-body">
                        <a class="h4-link" href="news#${Data.news.length-displayed}">${post.name}</a>
                        <p class="comment-date">${Time.weekday[post.date.getDay()]}, ${Time.month[post.date.getMonth()]} ${Time.formatDate(post.date.getDate())}, ${post.date.getYear()+1900}</p>
                        <br>
                        <p class="text">${post.desc}</p>
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
                curYear = post.date.getYear() + 1900;
                try {
                    nextYear = Data.news[Data.news.indexOf(post) + 1].date.getYear() + 1900;
                } catch(e) {}
                let newsLinks = ``;
                let newsImg = ``;
                if (post.img && post.imgalt) {
                    newsImg = `<img class="snippet-img" src="img/news/${post.img}.png" alt="${post.imgalt}">`
                }
                if (post.buttons) {
                    for (const button of post.buttons) {
                        button.external = button.external ? `target ="_blank" rel="noopener"` : '';
                        newsLinks += `
                        <a class="snippet-link" href="${button.link}" ${button.external}">
                            <div class="snippet-link-inner">${button.name}</div>
                        </a>
                        `
                    }
                }
                post.date = Time.addHours(post.date, 5);
                newsList[newsIndex] += `
                <div class="snippet">
                ${newsImg}
                    <div class="snippet-body" id="${Data.news.length-Data.news.indexOf(post)}">
                        <p class="h4-link" >${post.name}</p>
                        <p class="comment-date">${Time.weekday[post.date.getDay()]}, ${Time.month[post.date.getMonth()]} ${Time.formatDate(post.date.getDate())}, ${curYear}</p>
                        <br>
                        <p class="text">${post.desc}</p>
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
    } else if (p.includes('programs')) {
        if (fx.checkClass(`programs`)) {
            let eventList = ``;
            let endTime;
            for (const event of Data.events) {
                let eventImg = ``;
                let zoomLink = ``;
                if (event.endtime) {
                    endTime = ` - ${Time.formatTime(Time.addHours(event.date, event.length))}`
                } else {
                    endTime = ``
                }
                if ((event.date.getTime() - 24*60*60*1000 <= Time.now) && (Time.addHours(event.date, event.length) >= Time.now)) {
                    zoomLink = `
                    <a class="snippet-zoom" href="${event.zoom}" target="_blank" rel="noopener">
                        <div class="snippet-zoom-inner"> Join now on
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 7 24 8">
                                <path d="M4.585 13.607l-.27-.012H1.886l3.236-3.237-.013-.27a.815.815 0 00-.796-.796l-.27-.013H0l.014.27c.034.438.353.77.794.796l.27.013h2.43L.268 13.595l.014.269c.015.433.362.78.795.796l.27.013h4.046l-.014-.27c-.036-.443-.35-.767-.795-.795zm3.238-4.328h-.004a2.696 2.697 0 10.003 0zm1.141 3.841a1.619 1.619 0 11-2.289-2.288 1.619 1.619 0 012.289 2.288zM21.84 9.28a2.158 2.158 0 00-1.615.73 2.153 2.153 0 00-1.619-.732 2.148 2.148 0 00-1.208.37c-.21-.233-.68-.37-.949-.37v5.395l.27-.013c.45-.03.778-.349.796-.796l.013-.27v-1.889l.014-.27c.01-.202.04-.382.132-.54a1.078 1.079 0 011.473-.393 1.078 1.079 0 01.393.392c.093.16.12.34.132.54l.014.271v1.889l.013.269a.83.83 0 00.795.796l.27.013v-2.967l.012-.27c.01-.2.04-.384.134-.543.3-.514.96-.69 1.473-.39a1.078 1.079 0 01.393.393c.092.16.12.343.13.54l.015.27v1.889l.013.269c.028.443.35.77.796.796l.27.013v-3.237a2.158 2.158 0 00-2.16-2.156zm-10.263.788a2.697 2.698 0 103.811 3.816 2.697 2.698 0 00-3.811-3.816zm3.05 3.052a1.619 1.619 0 11-2.289-2.29 1.619 1.619 0 012.289 2.29z"/>
                            </svg>
                        </div>
                    </a>
                    `
                }
                if (event.img && event.imgalt) {
                    eventImg = `<a href="img/events/${event.img}_.png" target="_blank"><img class="snippet-img" src="img/events/${event.img}.png" alt="${event.imgalt}"></a>`
                }
                if (Time.addHours(event.date, event.length) >= Time.now) {
                    eventList += `
                    <div class="snippet">
                        ${eventImg}
                        <div class="snippet-body" id="${(event.date.getTime()/100000).toString(36).slice(1)}">
                            <p class="h4-link" >${event.name}</p>
                            <p class="comment-date">${Time.weekday[event.date.getDay()]}, ${Time.month[event.date.getMonth()]} ${Time.formatDate(event.date.getDate())}, ${Time.formatTime(event.date)}${endTime}</p>
                            <br>
                            <p class="text">${event.desc}</p>
                        </div>
                    </div>
                    ${zoomLink}
                    `
                }
            }
            fx.setClass(`programs`, eventList)
        }
        // Autoscroll if linked
        const urlClean = url.split("#")[1];
        if (urlClean) {
            const scrollId = document.getElementById(urlClean);
            scrollId.scrollIntoView();
        }
    } else if (p.includes('board')) {
        // Autoscroll if linked
        const urlClean = url.split("#")[1];
        if (urlClean) {
            const scrollId = document.getElementById(urlClean);
            const yearById = scrollId.parentElement.parentElement;
            const arrowById = yearById.parentElement.children[1];
            yearById.classList.remove("board-year-collapsed");
            arrowById.classList.remove("board-arrow-collapsed");
            scrollId.scrollIntoView();
        }
    }
}

if (page.includes('index')) {
    //
} else if (page.includes('news')) {
    const lastYear = Data.news[0].date.getYear() + 1900;
    const firstYear = Data.news[Data.news.length-1].date.getYear() + 1900;
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
} else if (page.includes('board')) {
    const lastYear = Data.news[0].date.getYear() + 1900;
    const firstYear = 2018;
    for (let i = firstYear; i <= lastYear; i++) {
        window.addEventListener('click', function(e) {   
            const header = document.getElementById(`${i}`);
            const arrow = document.getElementById(`meeting-arrow-${i}`);
            const content = document.getElementById(`meeting-year-${i}`);
            if ((header.contains(e.target) || arrow.contains(e.target)) && !content.classList.contains("meeting-year-collapsed")) {
                content.classList.add("meeting-year-collapsed");
                arrow.classList.add("meeting-arrow-collapsed");
            } else if ((header.contains(e.target) || arrow.contains(e.target)) && content.classList.contains("meeting-year-collapsed")) {
                content.classList.remove("meeting-year-collapsed");
                arrow.classList.remove("meeting-arrow-collapsed");
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