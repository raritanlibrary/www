import * as time from './time';
import * as svg from './svg';
import * as util from './util';
const fs = require('fs');
const yaml = require('js-yaml');

// Event parsing function
const eventParser = yaml => {
    yaml.forEach(event => {
        event.tag = event.zoom && !event.tag ? "zoom" : false;
        if (event.date === "tbd") {
            event.dateName =  event.dateSort = new Date(1e14);
            event.zoom = false;
        } else if (event.length === "range") {
            event.dateSort = event.date[0] < time.now ? time.now : event.date[0];
            event.dateName = event.date[1];
            event.range = true;
            event.length = 1;
        } else if (Array.isArray(event.date)) {
            const numDays = event.date.length;
            for (let i = 0; i < numDays; i++) {
                let day = event.date[i];
                if (time.addHours(day, event.length) < time.now && numDays !== 1) {
                    event.date.shift();
                    if (event.zoom) {
                        event.zoom.shift();
                    }
                    i--;
                } else {
                    event.dateName = event.dateSort = day;
                    if (event.zoom) {
                        event.zoom = event.zoom[0];
                    }
                    break;
                }
            }
        } else {
            event.dateName = event.dateSort = event.date;
        }
    });
    yaml = yaml.sort((a, b) => a.dateSort - b.dateSort);
}

// Events data
let eventData = fs.readFileSync('src/data/events.yaml', 'utf8');
export let events = yaml.load(eventData);

// Add board meeting if 2nd Thursday
if (time.getR(1) < time.now) {
    let boardObj = {
        "name": "RPL Board of Trustees Meeting",
        "title": "Board of Trustees",
        "subtitle": `Meeting for ${time.month(time.now)} ${time.now.getFullYear()}`,
        "date": time.getR(2),
        "length": 1,
        "noendtime": true,
        "blurb": "The regular monthly meeting of the Raritan Public Library Board of Trustees will be held in-person at the Raritan Public Library.",
        "desc": "The regular monthly meeting of the Raritan Public Library Board of Trustees will be held in-person at the Raritan Public Library.",
        "style": "meeting",
        "img": "meeting",
        "imgalt": "Board Meeting",
    };
    events.push(boardObj);
}

// Events data (childrens programming)
let kidsData = fs.readFileSync('src/data/kids.yaml', 'utf8');
export let kids = yaml.load(kidsData);

// Add next 2 Tuesdays/Thursdays for Storytime at the Library
let storytimeDates = [];
for (let i = 0; i < 2; i++) {
    let day = time.getNextDotw(time.now, 2)
    day = time.addDays(day, i*7);
    day = time.addHours(day, 10.5);
    storytimeDates.push(day);
    day = time.addDays(day, 2);
    storytimeDates.push(day);
}
let storytimeObj = {
    "name": "Storytime at the Library",
    "date": storytimeDates,
    "length": 0.75,
    "age": "0 - 18",
    "desc": "Children are invited to join Miss Amber for music, movement, stories, and crafts centered around a theme that changes every week! All children are welcome, we don't require you to be still or silent to join!",
    "img": "storytime",
    "imgalt": "Children gathered around an open book",
};
kids.push(storytimeObj);

// Parse all event data
eventParser(events);
eventParser(kids);

// News data
let newsData = fs.readFileSync('src/data/news.yaml', 'utf8');
export let news = yaml.load(newsData);
news = news.sort((a, b) => b.date - a.date);

// HTML injection for program blurbs (sidebar)
export const eventInjector = () => {
    if (util.checkClass(`calendar-events`)) {
        let displayed = 0;
        let eventList = ``;
        let endTime;
        for (const event of events) {
            let eventDate, eventTime, eventDateMobile;
            let zoomLink = ``;
            if (displayed === 4 ) { break };
            endTime = event.noendtime ? `` : ` - ${time.formatTime(time.addHours(event.dateName, event.length))}`;
            if (event.date === 'tbd') {
                eventDate = `Date:&nbsp;TBD`;
                eventTime = ``;
                eventDateMobile = eventDate;
            } else if (event.range) {
                eventDate = `Starting ${time.monthDay(event.date[0])}`;
                eventTime = `through ${time.monthDay(event.date[1])}`;
                eventDateMobile = `${eventDate.slice(9)} - ${eventTime.slice(8)}`;
            } else if (Array.isArray(event.date) && event.date.length > 1) {
                if (event.date[0].getDate() === event.date[1].getDate()) {
                    eventDate = time.fullDate(event.date[0]);
                    eventTime = `${time.formatTime(event.date[0])} and ${time.formatTime(event.date[1])}`;
                    eventDateMobile = time.monthDayTime(event.date[0]);
                } else {
                    eventDate = `${time.weekday(event.date[0])}s at ${time.formatTime(event.date[0])}`;
                    eventTime = ``;
                    time.datechunk(event.date).forEach((chunk, i) => eventTime += i < event.date.length - 1 ? `${chunk}<br>` : chunk);
                    eventDateMobile = eventDate;
                }
            } else if (Array.isArray(event.date) && event.date.length === 1) {
                eventDate = time.fullDate(event.date[0]);
                eventTime = `${time.formatTime(event.date[0])}${endTime}`;
                eventDateMobile = time.monthDayTime(event.date[0]);
            } else {
                eventDate = time.fullDate(event.date);
                eventTime = `${time.formatTime(event.date)}${endTime}`;
                eventDateMobile = time.monthDayTime(event.date);
            }
            if (event.zoom && (event.dateName.getTime() - time.msd <= time.now) && (time.addHours(event.dateName, event.length) >= time.now)) {
                zoomLink = `
                <a class="event-zoom-link" href="${event.zoom}" target="_blank" rel="noopener">
                    <div class="event-zoom"> Join now on ${svg.zoom}</div>
                </a>
                `
            }
            if (time.addHours(event.dateName, event.length) >= time.now) {
                eventList += `
                <div class="event${zoomLink ? "" : " event-extend"}">
                    <div class="event-${event.style}" style="background-image: url(./img/events/_${event.img}.png")>
                        <a class="event-${event.style}-link" href="programs#${util.eventid(event.name)}">
                            <div class="event-${event.style}-cover${zoomLink ? "" : " event-extend-inner"}">
                                <p class="event-${event.style}-title">${event.title}</p>
                                <p class="event-${event.style}-subtitle">${event.subtitle}</p>
                                <hr class="event-${event.style}-hr"/>
                                <p class="event-${event.style}-date">${eventDate}</p>
                                <p class="event-${event.style}-time">${eventTime}</p>
                                <p class="event-${event.style}-date-mobile">${eventDateMobile}</p>
                                <p class="event-${event.style}-desc">${event.blurb}</p>
                            </div>
                        </a>
                    </div>
                    ${zoomLink}
                </div>
                `
                displayed++;
            }
        }
        util.setClass(`calendar-events`, eventList)
    }
}

// Git data
let tag = fs.readFileSync('src/data/_REV', 'utf8');
export const rev = () => {
    if (util.checkClass('version')) {
        util.setClass('version', `Build ${tag} · <a href="/site-map">Site Map</a> · <a href="/privacy"> Privacy</a>`);
    }
}