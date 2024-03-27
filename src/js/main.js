import * as time from './time';
import * as util from './util';
import * as nav from './nav';
import * as data from './data';
import * as access from './access';
import * as hero from './hero';
import * as svg from './svg';
import eventJson from 'url:../data/calendar.json';
import hashCache from 'url:../data/hashcache.json';

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
        const navLeft = document.getElementById("calendar-nav-back")
        const navRight = document.getElementById("calendar-nav-next")
        if (navLeft.contains(e.target) && !disableLeft) {
            data.programCalendar(res, lastDate);
            curMonth = lastDate.getMonth();
            curYear = lastDate.getFullYear();
            if (lastDate.getTime() === lastLimit.getTime()) {
                navLeft.classList.add("calendar-action-grey");
                disableLeft = true;
            }
            navRight.classList.remove("calendar-action-grey");
            disableRight = false;
            lastDate = new Date(curYear, curMonth-1, 1);
            nextDate = new Date(curYear, curMonth+1, 1);
        } else if (navRight.contains(e.target) && !disableRight) {
            data.programCalendar(res, nextDate);
            curMonth = nextDate.getMonth();
            curYear = nextDate.getFullYear();
            if (nextDate.getTime() === nextLimit.getTime()) {
                navRight.classList.add("calendar-action-grey");
                disableRight = true;
            }
            navLeft.classList.remove("calendar-action-grey");
            disableLeft = false;
            lastDate = new Date(curYear, curMonth-1, 1);
            nextDate = new Date(curYear, curMonth+1, 1);
        }
    })
    autoScroll();
}

// Search bar
const search = () => {
    const searchForm = document.getElementById('search');
    searchForm.addEventListener("submit", e => {
        let keyword = document.getElementById('query').value;
        e.preventDefault();
        if (keyword !== '') {
            keyword.replace(' ', '+');
            window.location.replace(`https://raritan.aspendiscovery.org/Union/Search?view=list&lookfor=${keyword}&searchIndex=Keyword&searchSource=local`);
            return false;
        }
    });
}

const pageInjector = p => {
    if (p === '') { hero.hero() }
    if (p.includes('board')) { autoScroll() }
}

nav.dropdown();
nav.sticky();
//access.preload();

// Functions to load for the request
const eventResFunc = async res => {
    res = res.events;
    const cache = await fetch(hashCache).then(x => x.json());
    data.eventInjector(res, cache);
    if (page.includes('events')) { 
        contentEvents(res);
    }
};

// Load event/hashcache data
util.req(eventJson, eventResFunc);

window.onload = () => {
    time.injector();
    pageInjector(page);
    //access.hicontrast();
    data.devInfo();
    search();
};
