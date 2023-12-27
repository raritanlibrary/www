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
    if (p.includes('board')) { autoScroll() }
}

nav.dropdown();
nav.sticky();
nav.modalOpen();
access.preload();

// Functions to load for the request
const eventResFunc = async res => {
    res = res.events;
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
