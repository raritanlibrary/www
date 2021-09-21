import * as Time from './time';
import * as fx from './fx';
const fs = require('fs');
const yaml = require('js-yaml');

// Events data
let eventData = fs.readFileSync('src/data/events.yaml', 'utf8');
export let events = yaml.load(eventData);

// Events data (childrens programming)
let kidsData = fs.readFileSync('src/data/kids.yaml', 'utf8');
export let kids = yaml.load(kidsData);

// Add board meeting if 2nd Thursday
if (Time.getR(0) < Time.now) {
    let boardObj = {
        "name": "RPL Board of Trustees Meeting",
        "title": "Board of Trustees",
        "subtitle": `Meeting for ${Time.month[Time.now.getMonth()]} ${Time.now.getFullYear()}`,
        "date": Time.getR(1),
        "length": 1,
        "noendtime": true,
        "blurb": "The regular monthly meeting of the Raritan Public Library Board of Trustees will be held in-person at the Raritan Public Library.",
        "desc": `The regular monthly meeting of the Raritan Public Library Board of Trustees will be held in-person at the Raritan Public Library.`,
        "style": "meeting",
        "img": "meeting",
        "imgalt": "Board Meeting",
    };
    events.push(boardObj);
}

// Parse all event data
fx.eventParser(events);
fx.eventParser(kids);

// News data
let newsData = fs.readFileSync('src/data/news.yaml', 'utf8');
export let news = yaml.load(newsData);
news = news.sort((a, b) => b.date - a.date);

export const eventInjector = () => {
    if (fx.checkClass(`calendar-events`)) {
        let displayed = 0;
        let eventList = ``;
        let endTime;
        for (const event of events) {
            let eventDate;
            let eventTime;
            let eventDateMobile;
            let zoomLink = ``;
            let extender = [" event-extend", " event-extend-inner"];
            if (displayed === 4 ) { break };
            if (!event.noendtime) {
                endTime = ` - ${Time.formatTime(Time.addHours(event.datenominal, event.length))}`;
            } else {
                endTime = ``;
            }
            if (event.date === 'tbd') {
                eventDate = `<p class="event-${event.style}-date">Date:&nbsp;TBD</p>`;
                eventTime = `<p class="event-${event.style}-time"></p>`;
                eventDateMobile = `<p class="event-${event.style}-date-mobile">Date: TBD</p>`;
            } else if (event.daterange) {
                eventDate = `<p class="event-${event.style}-date">Starting ${Time.month[event.date[0].getMonth()]} ${Time.formatDate(event.date[0].getDate())}</p>`;
                eventTime = `<p class="event-${event.style}-time">through ${Time.month[event.date[1].getMonth()]} ${Time.formatDate(event.date[1].getDate())}</p>`;
                eventDateMobile = `<p class="event-${event.style}-date-mobile">${Time.month[event.date[0].getMonth()]} ${Time.formatDate(event.date[0].getDate())} - ${Time.month[event.date[1].getMonth()]} ${Time.formatDate(event.date[1].getDate())}</p>`;
            } else if (Array.isArray(event.date) && event.date.length > 1) {
                if (event.date[0].getDate() === event.date[1].getDate()) {
                    eventDate = `<p class="event-${event.style}-date">${Time.weekday[event.date[0].getDay()]}, ${Time.month[event.date[0].getMonth()]} ${Time.formatDate(event.date[0].getDate())}</p>`;
                    eventDateMobile = `<p class="event-${event.style}-date-mobile">${Time.month[event.date[0].getMonth()]} ${Time.formatDate(event.date[0].getDate())} at ${Time.formatTime(event.date[0])}</p>`;    
                    eventTime = `<p class="event-${event.style}-time">${Time.formatTime(event.date[0])} and ${Time.formatTime(event.date[1])}</p>`;
                } else {
                    eventDate = `<p class="event-${event.style}-date">${Time.weekday[event.date[0].getDay()]}s at ${Time.formatTime(event.date[0])}</p>`
                    eventDateMobile = `<p class="event-${event.style}-date-mobile">${Time.weekday[event.date[0].getDay()]}s at ${Time.formatTime(event.date[0])}</p>`
                    eventTime = `<p class="event-${event.style}-time">`
                    Time.datechunk(event.date).forEach((chunk, i) => {
                        eventTime += chunk
                        if (i < event.date.length-1) { eventTime += `<br>` }
                    });
                    eventTime += `</p>`;
                }
            } else if (Array.isArray(event.date) && event.date.length === 1) {
                eventDate = `<p class="event-${event.style}-date">${Time.weekday[event.date[0].getDay()]}, ${Time.month[event.date[0].getMonth()]} ${Time.formatDate(event.date[0].getDate())}</p>`;
                eventTime = `<p class="event-${event.style}-time">${Time.formatTime(event.date[0])}${endTime}</p>`;
                eventDateMobile = `<p class="event-${event.style}-date-mobile">${Time.month[event.date[0].getMonth()]} ${Time.formatDate(event.date[0].getDate())} at ${Time.formatTime(event.date[0])}</p>`;
            } else {
                eventDate = `<p class="event-${event.style}-date">${Time.weekday[event.date.getDay()]}, ${Time.month[event.date.getMonth()]} ${Time.formatDate(event.date.getDate())}</p>`;
                eventTime = `<p class="event-${event.style}-time">${Time.formatTime(event.date)}${endTime}</p>`;
                eventDateMobile = `<p class="event-${event.style}-date-mobile">${Time.month[event.date.getMonth()]} ${Time.formatDate(event.date.getDate())} at ${Time.formatTime(event.date)}</p>`;
            }
            if (event.zoom && (event.datenominal.getTime() - 86400000 <= Time.now) && (Time.addHours(event.datenominal, event.length) >= Time.now)) {
                zoomLink = `
                <a class="event-zoom-link" href="${event.zoom}" target="_blank" rel="noopener">
                    <div class="event-zoom"> Join now on
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 7 24 8">
                            <path d="M4.585 13.607l-.27-.012H1.886l3.236-3.237-.013-.27a.815.815 0 00-.796-.796l-.27-.013H0l.014.27c.034.438.353.77.794.796l.27.013h2.43L.268 13.595l.014.269c.015.433.362.78.795.796l.27.013h4.046l-.014-.27c-.036-.443-.35-.767-.795-.795zm3.238-4.328h-.004a2.696 2.697 0 10.003 0zm1.141 3.841a1.619 1.619 0 11-2.289-2.288 1.619 1.619 0 012.289 2.288zM21.84 9.28a2.158 2.158 0 00-1.615.73 2.153 2.153 0 00-1.619-.732 2.148 2.148 0 00-1.208.37c-.21-.233-.68-.37-.949-.37v5.395l.27-.013c.45-.03.778-.349.796-.796l.013-.27v-1.889l.014-.27c.01-.202.04-.382.132-.54a1.078 1.079 0 011.473-.393 1.078 1.079 0 01.393.392c.093.16.12.34.132.54l.014.271v1.889l.013.269a.83.83 0 00.795.796l.27.013v-2.967l.012-.27c.01-.2.04-.384.134-.543.3-.514.96-.69 1.473-.39a1.078 1.079 0 01.393.393c.092.16.12.343.13.54l.015.27v1.889l.013.269c.028.443.35.77.796.796l.27.013v-3.237a2.158 2.158 0 00-2.16-2.156zm-10.263.788a2.697 2.698 0 103.811 3.816 2.697 2.698 0 00-3.811-3.816zm3.05 3.052a1.619 1.619 0 11-2.289-2.29 1.619 1.619 0 012.289 2.29z"/>
                        </svg>
                    </div>
                </a>
                `
                extender = ["", ""]
            }
            if (Time.addHours(event.datenominal, event.length) >= Time.now) {
                eventList += `
                <div class="event${extender[0]}">
                    <div class="event-${event.style}" style="background-image: url(./img/events/_${event.img}.png")>
                        <a class="event-${event.style}-link" href="programs#${fx.eventid(event.name, event.datenominal)}">
                            <div class="event-${event.style}-cover${extender[1]}">
                                <p class="event-${event.style}-title">${event.title}</p>
                                <p class="event-${event.style}-subtitle">${event.subtitle}</p>
                                <hr class="event-${event.style}-hr" />
                                ${eventDate}
                                ${eventTime}
                                ${eventDateMobile}
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
        fx.setClass(`calendar-events`, eventList)
    }
}

// Git data
let tag = fs.readFileSync('src/data/_REV', 'utf8');
export const rev = () => {
    if (fx.checkClass('version')) {
        fx.setClass('version', `Revision ${tag} · <a href="/site-map"> View Site Map</a>`);
    }
}