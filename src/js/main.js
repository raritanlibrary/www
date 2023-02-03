import * as time from './time';
import * as util from './util';
import * as nav from './nav';
import * as data from './data';
import * as access from './access';
import * as svg from './svg';
import eventJson from 'url:../data/calendar.json';

// Favicon mode
if (window.matchMedia('(prefers-color-scheme:light)').matches) {
    document.getElementById('fav-dark').remove();
} else {
    document.getElementById('fav-light').remove();
}

// Get page details
const url = window.location.href
let page;
try {
    page = url.split("/")[3];
    page = page.split(".")[0];
} catch(e) {
    page = '';
}

// Autoscroll if linked (default)
const autoScroll = () => {
    const urlClean = url.split("#")[1];
    if (urlClean) {
        const scrollId = document.getElementById(urlClean);
        scrollId.scrollIntoView();
    }
}

// Content to inject for home page
const contentIndex = () => {
    let displayed = 0;
    let newsList = ``;
    for (const post of data.news) {
        let newsLinks, newsImg;
        newsImg = newsLinks = ``;
        if (post.hidden) { continue };
        if (displayed === 1 ) { break };
        if (post.img && post.imgalt) {
            newsImg = `
            <picture>
                <source srcset="img/news/${post.img}.webp" type="image/webp"/>
                <img class="snippet-img" src="img/news/${post.img}.jpg" alt="${post.imgalt}" type="image/jpeg"/>
            </picture>
            `
            newsImg = post.imglink ? `<a href="${post.imglink}" target="_blank" ${util.extchk(post.imglink)}>${newsImg}</a>` : newsImg;
        }
        if (post.buttons) {
            for (const button of post.buttons) {
                newsLinks += `
                <a class="snippet-link" href="${button.link}" target="_blank" ${util.extchk(button.link)}">
                    <div class="snippet-link-inner">${button.name}</div>
                </a>
                `
            }
        }
        post.date = time.addHours(post.date, 5);
        newsList += `
        <div class="snippet">
        ${newsImg}
            <div class="snippet-body">
                <a class="h4-link" href="news#${data.news.length-displayed}">${post.name}</a>
                <br><br>
                <p class="text">${post.desc}</p>
                ${newsLinks}
            </div>
        </div>
        `
        displayed++;
    }
    document.getElementById("news-home").innerHTML = newsList;
}

// Content to inject for news page
const contentNews = () => {
    let curYear, nextYear;
    let newsIndex = 0;
    let newsList = [];
    newsList[newsIndex] = ``;
    for (const post of data.news) {
        if (post.hidden) { continue };
        curYear = post.date.getFullYear();
        try {
            nextYear = data.news[data.news.indexOf(post) + 1].date.getFullYear();
        } catch(e) {}
        let newsLinks, newsImg;
        newsImg = newsLinks = ``;
        if (post.img && post.imgalt) {
            newsImg = `
            <picture>
                <source srcset="img/news/${post.img}.webp" type="image/webp"/>
                <img class="snippet-img" src="img/news/${post.img}.jpg" alt="${post.imgalt}" type="image/jpeg"/>
            </picture>
            `
            newsImg = post.imglink ? `<a href="${post.imglink}" target="_blank" ${util.extchk(post.imglink)}>${newsImg}</a>` : newsImg;
        }
        if (post.buttons) {
            for (const button of post.buttons) {
                newsLinks += `
                <a class="snippet-link" href="${button.link}" target="_blank" ${util.extchk(button.link)}">
                    <div class="snippet-link-inner">${button.name}</div>
                </a>
                `
            }
        }
        post.date = time.addHours(post.date, 5);
        newsList[newsIndex] += `
        <div class="snippet">
        ${newsImg}
            <div class="snippet-body" id="${data.news.length-data.news.indexOf(post)}">
                <p class="h4-link" >${post.name}</p>
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
        newsOutput += `
        <div class="news-wrapper">
            <h2 class="news-h2" id="news-header-${curYear}">${curYear}</h2>
            ${svg.arrow(newsList.indexOf(year) >= 1  ? " news-arrow-collapsed" : "", curYear)}
            <div class="news-year${newsList.indexOf(year) >= 1  ? " news-year-collapsed" : ""}" id="news-year-${curYear}">
                ${year}
            </div>
        </div>
        `
        curYear--;
    }
    document.getElementById("news").innerHTML = newsOutput;
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
}

// Content to inject for events page
const contentEvents = res => {
    data.programCalendar(res, time.now);
    let curDay          = time.now.getDate();
    let curMonth        = time.now.getMonth();
    let curYear         = time.now.getFullYear();
    let lastDate        = new Date(curYear, curMonth-1, 1);
    let nextDate        = new Date(curYear, curMonth+1, 1);
    let lastLimitRaw    = new Date(curYear, curMonth, curDay-45);
    let lastLimit       = new Date(lastLimitRaw.getFullYear(), lastLimitRaw.getMonth(), 1);
    let nextLimit       = new Date(curYear, curMonth+3, 1);
    let disableLeft     = false;
    let disableRight    = false;
    util.addClickListener(e => {
        const navLeft = document.getElementById("month-nav-left")
        const navRight = document.getElementById("month-nav-right")
        if (navLeft.contains(e.target) && !disableLeft) {
            data.programCalendar(res, lastDate);
            curMonth = lastDate.getMonth();
            curYear = lastDate.getFullYear();
            if (lastDate.getTime() === lastLimit.getTime()) {
                navLeft.classList.add("calendar-nav-grey");
                disableLeft = true;
            }
            navRight.classList.remove("calendar-nav-grey");
            disableRight = false;
            lastDate = new Date(curYear, curMonth-1, 1);
            nextDate = new Date(curYear, curMonth+1, 1);
        } else if (navRight.contains(e.target) && !disableRight) {
            data.programCalendar(res, nextDate);
            curMonth = nextDate.getMonth();
            curYear = nextDate.getFullYear();
            if (nextDate.getTime() === nextLimit.getTime()) {
                navRight.classList.add("calendar-nav-grey");
                disableRight = true;
            }
            navLeft.classList.remove("calendar-nav-grey");
            disableLeft = false;
            lastDate = new Date(curYear, curMonth-1, 1);
            nextDate = new Date(curYear, curMonth+1, 1);
        }
    })
    autoScroll();
}

const pageInjector = p => {
    if (p.includes('index') || p === '') { contentIndex() }
    else if (p.includes('news')) { contentNews() }
    else if (p.includes('board')) { autoScroll() }
}

if (page.includes('news')) {
    const lastYear = data.news[0].date.getFullYear();
    const firstYear = data.news[data.news.length-1].date.getFullYear();
    for (let i = firstYear; i <= lastYear; i++) {
        util.addClickListener(e => {
            const header = document.getElementById(`news-header-${i}`);
            const arrow = document.getElementById(`news-arrow-${i}`);
            const content = document.getElementById(`news-year-${i}`);
            util.toggleClasses(
                (header.contains(e.target) || arrow.contains(e.target)) && !content.classList.contains("news-year-collapsed"),
                (header.contains(e.target) || arrow.contains(e.target)) && content.classList.contains("news-year-collapsed"),
                [content, "news-year-collapsed"],
                [arrow, "news-arrow-collapsed"]
            )
        });
    }
}

nav.dropdown();
nav.sticky();
access.preload();

// Functions to load for the request
const eventResFunc = async res => {
    res = JSON.parse(res).events;
    data.eventInjector(res);
    if (page.includes('events')) { 
        contentEvents(res);
    }
};

// Load event data
util.req(eventJson, eventResFunc);

window.onload = () => {
    time.injector();
    pageInjector(page);
    access.hicontrast();
    data.rev();
};
