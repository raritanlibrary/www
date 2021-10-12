import * as Time from '../functions/time';
import * as fx from '../functions/fx';
import * as Nav from '../functions/nav';
import * as Data from '../functions/data';
import * as Access from '../functions/access';

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
                if (post.hidden) { continue };
                if (displayed === 3 ) { break };
                if (post.img && post.imgalt && post.imglink) {
                    newsImg = `<a href="${post.imglink}" target="_blank" ${fx.extchk(post.imglink)}><img class="snippet-img" src="img/news/${post.img}.png" alt="${post.imgalt}"}></a>`
                } else if (post.img && post.imgalt) {
                    newsImg = `<img class="snippet-img" src="img/news/${post.img}.png" alt="${post.imgalt}"}>`
                }
                if (post.buttons) {
                    for (const button of post.buttons) {
                        newsLinks += `
                        <a class="snippet-link" href="${button.link}" target="_blank" ${fx.extchk(button.link)}">
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
                        <p class="comment-date">${Time.weekday[post.date.getDay()]}, ${Time.month[post.date.getMonth()]} ${Time.formatDate(post.date.getDate())}, ${post.date.getFullYear()}</p>
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
                if (post.hidden) { continue };
                curYear = post.date.getFullYear();
                try {
                    nextYear = Data.news[Data.news.indexOf(post) + 1].date.getFullYear();
                } catch(e) {}
                let newsLinks = ``;
                let newsImg = ``;
                if (post.img && post.imgalt && post.imglink) {
                    newsImg = `<a href="${post.imglink}" target="_blank" ${fx.extchk(post.imglink)}><img class="snippet-img" src="img/news/${post.img}.png" alt="${post.imgalt}"}></a>`
                } else if (post.img && post.imgalt) {
                    newsImg = `<img class="snippet-img" src="img/news/${post.img}.png" alt="${post.imgalt}"}>`
                }
                if (post.buttons) {
                    for (const button of post.buttons) {
                        newsLinks += `
                        <a class="snippet-link" href="${button.link}" target ="_blank" ${fx.extchk(button.link)}">
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
                    collapser = " news-year-collapsed"
                    collapserArrow = " news-arrow-collapsed"
                }
                newsOutput += `
                <div class="news-wrapper">
                    <h2 class="news-h2" id="news-header-${curYear}">${curYear}</h2>
                    <svg class="news-arrow${collapserArrow}" id="news-arrow-${curYear}" xmlns="http://www.w3.org/2000/svg" viewBox="0 -1.5 16 16">
                        <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                    <div class="news-year${collapser}" id="news-year-${curYear}">
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
            yearById.classList.remove("news-year-collapsed");
            arrowById.classList.remove("news-arrow-collapsed");
            scrollId.scrollIntoView();
        }
    } else if (p.includes('programs')) {
        if (fx.checkClass(`programs`)) {
            let eventList = ``;
            let endTime;
            for (const event of Data.events) {
                let eventDate;
                let eventImg = ``;
                let zoomLink = ``;
                let eventTag = ``;
                if (!event.noendtime) {
                    endTime = ` - ${Time.formatTime(Time.addHours(event.datenominal, event.length))}`;
                } else {
                    endTime = ``
                }
                if (event.date === 'tbd') {
                    eventDate = `Date:&nbsp;TBD`
                } else if (event.daterange) {
                    eventDate = `${Time.weekday[event.date[0].getDay()]}, ${Time.month[event.date[0].getMonth()]} ${Time.formatDate(event.date[0].getDate())} - ${Time.weekday[event.date[1].getDay()]}, ${Time.month[event.date[1].getMonth()]} ${Time.formatDate(event.date[1].getDate())}`;
                } else if (Array.isArray(event.date) && event.date.length > 1) {
                    if (event.date[0].getDate() === event.date[1].getDate()) {
                        eventDate = `${Time.weekday[event.date[0].getDay()]}, ${Time.month[event.date[0].getMonth()]} ${Time.formatDate(event.date[0].getDate())}, ${Time.formatTime(event.date[0])} and ${Time.formatTime(event.date[1])}`;
                    } else {
                        eventDate = `${Time.weekday[event.date[0].getDay()]}s at ${Time.formatTime(event.date[0])}${endTime} <br>`
                        event.date.forEach((day, i) => {
                            eventDate += `${Time.month[day.getMonth()]} ${Time.formatDate(day.getDate())}`
                            if (i < event.date.length-1) { eventDate += `,&nbsp;` }
                        });
                    }
                } else if (Array.isArray(event.date) && event.date.length === 1) {
                    eventDate = `${Time.weekday[event.date[0].getDay()]}, ${Time.month[event.date[0].getMonth()]} ${Time.formatDate(event.date[0].getDate())}, ${Time.formatTime(event.date[0])}${endTime}`
                } else {
                    eventDate = `${Time.weekday[event.date.getDay()]}, ${Time.month[event.date.getMonth()]} ${Time.formatDate(event.date.getDate())}, ${Time.formatTime(event.date)}${endTime}`
                }
                if (event.tag === 'zoom') {
                    eventTag = `<div class="snippet-tag snippet-tag-virtual">Virtual</div>`;
                }
                if (event.form && ((event.datenominal.getTime() - 86400000 >= Time.now) || event.daterange || (event.date === 'tbd'))) {
                    zoomLink = `
                    <a class="snippet-link" href="${event.form}" target="_blank" ${fx.extchk(event.form)}>
                        <div class="snippet-link-inner">Sign-up form</div>
                    </a>
                    `
                }
                if (event.formalt) {
                    let formalt = event.formalt;
                    zoomLink += `
                    <a class="snippet-link" href="${formalt.link}" target="_blank" ${fx.extchk(formalt.link)}>
                        <div class="snippet-link-inner">${formalt.name}</div>
                    </a>
                    `
                }
                if (event.zoom && (event.datenominal.getTime() - 86400000 <= Time.now) && (Time.addHours(event.datenominal, event.length) >= Time.now)) {
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
                    eventImg = `<a href="img/events/${event.img}.png" target="_blank"><img class="snippet-img" src="img/events/_${event.img}.png" alt="${event.imgalt}" ${event.img === 'yoga' ? `style = "object-position: top;"` : ``}></a>`
                }
                if (Time.addHours(event.datenominal, event.length) >= Time.now) {
                    eventList += `
                    <div class="snippet">
                        ${eventImg}
                        <div class="snippet-body" id="${fx.eventid(event.name, event.datenominal)}">
                            <p class="h4-link inline" >${event.name}</p>${eventTag}
                            <p class="comment-date">${eventDate}</p>
                            <br>
                            <p class="text">${event.desc}</p>
                            ${zoomLink}
                        </div>
                    </div>
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
    } else if (p.includes('kids')) {
        if (fx.checkClass(`kids`)) {
            let kidList = ``;
            let endTime;
            for (const kid of Data.kids) {
                let kidDate;
                let kidImg = ``;
                let zoomLink = ``;
                let kidTag = ``;
                kid.form = "https://docs.google.com/forms/d/e/1FAIpQLSexzMC0KhtjIMRZT1yVBla-fFVZe69UB3f0g0KgkFFQaj5K_g/viewform"
                if (!kid.noendtime) {
                    endTime = ` - ${Time.formatTime(Time.addHours(kid.datenominal, kid.length))}`;
                } else {
                    endTime = ``
                }
                if (kid.date === 'tbd') {
                    kidDate = `Date:&nbsp;TBD`
                } else if (kid.daterange) {
                    kidDate = `${Time.weekday[kid.date[0].getDay()]}, ${Time.month[kid.date[0].getMonth()]} ${Time.formatDate(kid.date[0].getDate())} - ${Time.weekday[kid.date[1].getDay()]}, ${Time.month[kid.date[1].getMonth()]} ${Time.formatDate(kid.date[1].getDate())}`;
                } else if (Array.isArray(kid.date) && kid.date.length > 1) {
                    if (kid.date[0].getDate() === kid.date[1].getDate()) {
                        kidDate = `${Time.weekday[kid.date[0].getDay()]}, ${Time.month[kid.date[0].getMonth()]} ${Time.formatDate(kid.date[0].getDate())}, ${Time.formatTime(kid.date[0])} and ${Time.formatTime(kid.date[1])}`;
                    } else {
                        kidDate = `${Time.weekday[kid.date[0].getDay()]}s at ${Time.formatTime(kid.date[0])}${endTime} <br>`
                        kid.date.forEach((day, i) => {
                            kidDate += `${Time.month[day.getMonth()]} ${Time.formatDate(day.getDate())}`
                            if (i < kid.date.length-1) { kidDate += `,&nbsp;` }
                        });
                    }
                } else if (Array.isArray(kid.date) && kid.date.length === 1) {
                    kidDate = `${Time.weekday[kid.date[0].getDay()]}, ${Time.month[kid.date[0].getMonth()]} ${Time.formatDate(kid.date[0].getDate())}, ${Time.formatTime(kid.date[0])}${endTime}`
                } else {
                    kidDate = `${Time.weekday[kid.date.getDay()]}, ${Time.month[kid.date.getMonth()]} ${Time.formatDate(kid.date.getDate())}, ${Time.formatTime(kid.date)}${endTime}`
                }
                kidTag = `<div class="snippet-tag snippet-tag-kids">Ages ${kid.age}</div>`
                if (kid.tag === 'zoom') {
                    kidTag += `<div class="snippet-tag snippet-tag-virtual">Virtual</div>`;
                }
                if (kid.form && ((kid.datenominal.getTime() - 86400000 >= Time.now) || kid.daterange || (kid.date === 'tbd'))) {
                    zoomLink = `
                    <a class="snippet-link" href="${kid.form}" target="_blank" ${fx.extchk(kid.form)}>
                        <div class="snippet-link-inner">Sign-up form</div>
                    </a>
                    `
                }
                if (kid.formalt) {
                    let formalt = kid.formalt;
                    zoomLink += `
                    <a class="snippet-link" href="${formalt.link}" target="_blank" ${fx.extchk(formalt.link)}>
                        <div class="snippet-link-inner">${formalt.name}</div>
                    </a>
                    `
                }
                if (kid.zoom && (kid.datenominal.getTime() - 86400000 <= Time.now) && (Time.addHours(kid.datenominal, kid.length) >= Time.now)) {
                    zoomLink = `
                    <a class="snippet-zoom" href="${kid.zoom}" target="_blank" rel="noopener">
                        <div class="snippet-zoom-inner"> Join now on
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 7 24 8">
                                <path d="M4.585 13.607l-.27-.012H1.886l3.236-3.237-.013-.27a.815.815 0 00-.796-.796l-.27-.013H0l.014.27c.034.438.353.77.794.796l.27.013h2.43L.268 13.595l.014.269c.015.433.362.78.795.796l.27.013h4.046l-.014-.27c-.036-.443-.35-.767-.795-.795zm3.238-4.328h-.004a2.696 2.697 0 10.003 0zm1.141 3.841a1.619 1.619 0 11-2.289-2.288 1.619 1.619 0 012.289 2.288zM21.84 9.28a2.158 2.158 0 00-1.615.73 2.153 2.153 0 00-1.619-.732 2.148 2.148 0 00-1.208.37c-.21-.233-.68-.37-.949-.37v5.395l.27-.013c.45-.03.778-.349.796-.796l.013-.27v-1.889l.014-.27c.01-.202.04-.382.132-.54a1.078 1.079 0 011.473-.393 1.078 1.079 0 01.393.392c.093.16.12.34.132.54l.014.271v1.889l.013.269a.83.83 0 00.795.796l.27.013v-2.967l.012-.27c.01-.2.04-.384.134-.543.3-.514.96-.69 1.473-.39a1.078 1.079 0 01.393.393c.092.16.12.343.13.54l.015.27v1.889l.013.269c.028.443.35.77.796.796l.27.013v-3.237a2.158 2.158 0 00-2.16-2.156zm-10.263.788a2.697 2.698 0 103.811 3.816 2.697 2.698 0 00-3.811-3.816zm3.05 3.052a1.619 1.619 0 11-2.289-2.29 1.619 1.619 0 012.289 2.29z"/>
                            </svg>
                        </div>
                    </a>
                    `
                }
                if (kid.img && kid.imgalt) {
                    kidImg = `<a href="img/kids/${kid.img}.png" target="_blank"><img class="snippet-img" src="img/kids/_${kid.img}.png" alt="${kid.imgalt}" ${kid.img === 'yoga' ? `style = "object-position: top;"` : ``}></a>`
                }
                if (Time.addHours(kid.datenominal, kid.length) >= Time.now) {
                    kidList += `
                    <div class="snippet">
                        ${kidImg}
                        <div class="snippet-body" id="${fx.eventid(kid.name, kid.datenominal)}">
                            <p class="h4-link inline" >${kid.name}</p>${kidTag}
                            <p class="comment-date">${kidDate}</p>
                            <br>
                            <p class="text">${kid.desc}</p>
                            ${zoomLink}
                        </div>
                    </div>
                    `
                }
            }
            fx.setClass(`kids`, kidList)
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
            scrollId.scrollIntoView();
        }
    }
}

if (page.includes('index')) {
    //
} else if (page.includes('news')) {
    const lastYear = Data.news[0].date.getFullYear();
    const firstYear = Data.news[Data.news.length-1].date.getFullYear();
    for (let i = firstYear; i <= lastYear; i++) {
        fx.addClickListener(e => {
            const header = document.getElementById(`news-header-${i}`);
            const arrow = document.getElementById(`news-arrow-${i}`);
            const content = document.getElementById(`news-year-${i}`);
            if ((header.contains(e.target) || arrow.contains(e.target)) && !content.classList.contains("news-year-collapsed")) {
                content.classList.add("news-year-collapsed");
                arrow.classList.add("news-arrow-collapsed");
            } else if ((header.contains(e.target) || arrow.contains(e.target)) && content.classList.contains("news-year-collapsed")) {
                content.classList.remove("news-year-collapsed");
                arrow.classList.remove("news-arrow-collapsed");
            }
        });
    }
}

Nav.dropdown();
Nav.sticky();
Access.preload();

window.onload = () => {
    Time.injector();
    if (!page.includes('programs')) {
        Data.eventInjector();
    };
    pageInjector(page);
    Access.hicontrast();
    Data.rev();
};

