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
    const curMonth = time.mm[time.now.getMonth()];
    const curYear = time.now.getFullYear();
    document.getElementById("calendar-month").innerHTML = `${curMonth} ${curYear}`;
    // Get day of the week for the first day of the month
    const monthFirst = new Date(time.now.getFullYear(), time.now.getMonth(), 1);
    const monthFirstDay = (monthFirst).getDay();
    // Add all days of the month, starting from Sunday
    // Then count from that first day until the calendar is filled
    // Add events as you go through the calendar
    let calDate = new Date(monthFirst.getTime() - time.msd * monthFirstDay);
    let calIter = 0;
    let dayClass = ``;
    let calContent = ``;
    while (!(calIter > 6 && time.now.getMonth() !== calDate.getMonth() && calDate.getDay() === 0)) {
        dayClass = time.now.getMonth() !== calDate.getMonth() ? "-grey" : (time.now.getDate() === calDate.getDate() ? "-now" : "")
        extraClass = time.flexMonth(calDate.getMonth()).includes(calDate.getDate()) ? " calendar-flex-half" : "";
        calContent += ` 
        <div class="calendar-day${dayClass}${extraClass}">
            <p class="calendar-num${dayClass}">
                ${calDate.getDate()}<span class="calendar-dotw-inner">${time.weekday(calDate)}</span>
            </p>
            `
        for (const event of data.events) {
            if (new Date(event.start).setHours(0,0,0,0) === calDate.setHours(0,0,0,0)) {
                console.log(event);
                let eventTitle = event.title.replace("Bridgewater-Raritan High School", "BRHS");
                let eventTime = event.allday ? "All Day Event" : time.formatTime(new Date(event.start));
                calContent += `
                <a class="calendar-entry-${util.stylizer(event.category)}" href="${event.url.public}" target="_blank" rel="noopener">
                    ${eventTitle}
                    <p class="calendar-entry-${util.stylizer(event.category)}-time">
                        ${eventTime}
                    </p>
                </a>
                `
            }
        }
        calContent += `</div>`
        calDate = new Date(calDate.getTime() + time.msd);
        calIter++;
    }
    document.getElementById("calendar-weeks").innerHTML = calContent;
    autoScroll();
}

const pageInjector = p => {
    if (p.includes('index') || p === '') { contentIndex() }
    else if (p.includes('news')) { contentNews() }
    else if (p.includes('programs')) { contentPrograms() }
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
