import * as time from './time';
import * as util from './util';
import * as nav from './nav';
import * as data from './data';
import * as access from './access';
import * as svg from './svg';

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
        if (displayed === 3 ) { break };
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
                <p class="comment-date">${time.fullDate(post.date)}, ${post.date.getFullYear()}</p>
                <br>
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
                <p class="comment-date">${time.fullDate(post.date)}, ${post.date.getFullYear()}</p>
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
            ${svg.arrow(newsList.indexOf(year) >= 2  ? " news-arrow-collapsed" : "", curYear)}
            <div class="news-year${newsList.indexOf(year) >= 2  ? " news-year-collapsed" : ""}" id="news-year-${curYear}">
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

// Content to inject for programs page
const contentPrograms = () => {
    let eventList = ``;
    let endTime;
    for (const event of data.events) {
        let eventDate, eventImg, zoomLink, eventTag;
        eventTag = zoomLink = eventImg = ``;
        endTime = event.noendtime || event.appointment ? `` : ` - ${time.formatTime(time.addHours(event.dateName, event.length))}`;
        if (event.date === 'tbd') {
            eventDate = `Date:&nbsp;TBD`;
        } else if (event.range) {
            eventDate = `${time.fullDate(event.date[0])} - ${time.fullDate(event.date[1])}`;
        } else if (Array.isArray(event.date) && event.date.length > 1) {
            if (event.date[0].getDate() === event.date[1].getDate()) {
                eventDate = `${time.fullDate(event.date[0])}, ${time.formatTime(event.date[0])} and ${time.formatTime(event.date[1])}`;
            } else {
                let eventDotW = event.dotws ? event.dotws : `${time.weekday(event.date[0])}s`;
                eventDate = `${eventDotW} at ${time.formatTime(event.date[0])}${endTime} <br>`;
                event.date.forEach((day, i) =>  eventDate += i < event.date.length - 1 ? `${time.monthDay(day)},&nbsp;` : time.monthDay(day));
            }
        } else if (Array.isArray(event.date) && event.date.length === 1) {
            eventDate = `${time.fullDayTime(event.date[0])}${endTime}`;
        } else if (event.appointment) {
            eventDate = "By Appointment Only"
        } else {
            eventDate = `${time.fullDayTime(event.date)}${endTime}`;
        }
        if (event.tag === 'zoom') {
            eventTag = `<div class="snippet-tag snippet-tag-virtual">Virtual</div>`;
        }
        if (event.form && ((event.dateName.getTime() - time.msd >= time.now) || event.range || (event.date === 'tbd'))) {
            zoomLink = `
            <a class="snippet-link" href="${event.form}" target="_blank" ${util.extchk(event.form)}>
                <div class="snippet-link-inner">Sign-up form</div>
            </a>
            `
        }
        if (event.formalt) {
            let formalt = event.formalt;
            zoomLink += `
            <a class="snippet-link" href="${formalt.link}" ${formalt.link !== 'makersday' ? `target="_blank"` : ``} ${util.extchk(formalt.link)}>
                <div class="snippet-link-inner">${formalt.name}</div>
            </a>
            `
        }
        if (event.zoom && (event.dateName.getTime() - time.msd <= time.now) && (time.addHours(event.dateName, event.length) >= time.now)) {
            zoomLink = `
            <a class="snippet-zoom" href="${event.zoom}" target="_blank" rel="noopener">
                <div class="snippet-zoom-inner"> Join now on ${svg.zoom}</div>
            </a>
            `
        }
        if (event.img && event.imgalt) {
            eventImg = `
            <picture>
                <source srcset="img/events/${event.img}.webp" type="image/webp"/>
                <img class="snippet-img" src="img/events/${event.img}.jpg" alt="${event.imgalt}" ${event.img === 'yoga' ? `style = "object-position: top;"` : ``} type="image/jpeg"/>
            </picture>
            `
        }
        if (event.appointment || time.addHours(event.dateName, event.length) >= time.now) {
            eventList += `
            <div class="snippet">
                ${eventImg}
                <div class="snippet-body" id="${util.eventid(event.name)}">
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
    document.getElementById("programs").innerHTML = eventList;
    autoScroll();
}

// Content to inject for kids page
const contentKids = () => {
    let kidList = ``;
    let endTime;
    for (const kid of data.kids) {
        let kidDate, kidImg, zoomLink, kidTag;
        kidTag = zoomLink = kidImg = ``;
        //kid.form = "https://docs.google.com/forms/d/e/1FAIpQLSexzMC0KhtjIMRZT1yVBla-fFVZe69UB3f0g0KgkFFQaj5K_g/viewform"
        endTime = kid.noendtime ? `` : ` - ${time.formatTime(time.addHours(kid.dateName, kid.length))}`;
        if (kid.date === 'tbd') {
            kidDate = `Date:&nbsp;TBD`;
        } else if (kid.range) {
            kidDate = `${time.fullDate(kid.date[0])} - ${time.fullDate(kid.date[1])}`;
        } else if (Array.isArray(kid.date) && kid.date.length > 1) {
            if (kid.date[0].getDate() === kid.date[1].getDate()) {
                kidDate = `${time.fullDate(kid.date[0])}, ${time.formatTime(kid.date[0])} and ${time.formatTime(kid.date[1])}`;
            } else {
                let kidDotW = kid.dotws ? kid.dotws : `${time.weekday(kid.date[0])}s`;
                kidDate = `${kidDotW} at ${time.formatTime(kid.date[0])}${endTime} <br>`;
                kid.date.forEach((day, i) => {
                    let kidTemp = time.monthDay(day) === "April 14th" ? "April 14th (craft only)" : time.monthDay(day);
                    kidDate += i < kid.date.length - 1 ? `${kidTemp},&nbsp;` : kidTemp;
                });
            }
        } else if (Array.isArray(kid.date) && kid.date.length === 1) {
            kidDate = `${time.fullDayTime(kid.date[0])}${endTime}`;
        } else {
            kidDate = `${time.fullDayTime(kid.date)}${endTime}`;
        }
        kidTag = kid.tag === 'zoom' ? `<div class="snippet-tag snippet-tag-virtual">Virtual</div>` : ``;
        if (kid.form && ((kid.dateName.getTime() - time.msd >= time.now) || kid.range || (kid.date === 'tbd'))) {
            zoomLink = `
            <a class="snippet-link" href="${kid.form}" target="_blank" ${util.extchk(kid.form)}>
                <div class="snippet-link-inner">Sign-up form</div>
            </a>
            `
        }
        if (kid.formalt) {
            let formalt = kid.formalt;
            zoomLink += `
            <a class="snippet-link" href="${formalt.link}" target="_blank" ${util.extchk(formalt.link)}>
                <div class="snippet-link-inner">${formalt.name}</div>
            </a>
            `
        }
        if (kid.zoom && (kid.dateName.getTime() - time.msd <= time.now) && (time.addHours(kid.dateName, kid.length) >= time.now)) {
            zoomLink = `
            <a class="snippet-zoom" href="${kid.zoom}" target="_blank" rel="noopener">
                <div class="snippet-zoom-inner"> Join now on ${svg.zoom}</div>
            </a>
            `
        }
        if (kid.img && kid.imgalt) {
            kidImg = `
            <picture>
                <source srcset="img/kids/${kid.img}.webp" type="image/webp"/>
                <img class="snippet-img" src="img/kids/${kid.img}.jpg" alt="${kid.imgalt}" type="image/jpeg"/>
            </picture>
            `
        }
        if (time.addHours(kid.dateName, kid.length) >= time.now) {
            kidList += `
            <div class="snippet">
                ${kidImg}
                <div class="snippet-body" id="${util.eventid(kid.name)}">
                    <p class="h4-link inline" >${kid.name}</p>${kidTag}
                    <p class="comment-date">${kidDate}</p>
                    <p class="comment-date">${svg.people}${(kid.age).match("-|\\+") ? "Ages ": "" }${kid.age}</p>
                    <br>
                    <p class="text">${kid.desc}</p>
                    ${zoomLink}
                </div>
            </div>
            `
        }
    }
    document.getElementById("kids").innerHTML = kidList;
    autoScroll();
}

const pageInjector = p => {
    if (p.includes('index') || p === '') { contentIndex() }
    else if (p.includes('news')) { contentNews() }
    else if (p.includes('programs')) { contentPrograms() }
    else if (p.includes('kids')) { contentKids() }
    else if (p.includes('board')) { autoScroll() }
}

if (page.includes('index')) {
    //
} else if (page.includes('news')) {
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

window.onload = () => {
    time.injector();
    if (!page.includes('programs')) {
        data.eventInjector();
    };
    data.adInjector();
    pageInjector(page);
    access.hicontrast();
    data.rev();
};
