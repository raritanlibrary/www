import * as time from './time';
import * as util from './util';
const fs = require('fs');
const yaml = require('js-yaml');

// Event data
let eventData = fs.readFileSync('dist/calendar.json', 'utf8');
export let events = JSON.parse(eventData).events;

// Event parsing function (sidebar)
const eventParserSidebar = data => {
    let dupes = ["1-on-1 Computer Help"];
    let out = []
    data.forEach(entry => {
        if (!dupes.includes(entry.title)) {
            dupes.push(entry.title);
            let event = {
                "title": entry.title.replace("Bridgewater-Raritan High School", "BRHS"),
                "date": [new Date(entry.start)].concat(entry.future_dates.map(({start}) => new Date(start))),
                "length": entry.allday ? 24 : (new Date(entry.end) - new Date(entry.start)) / time.msh,
                "range": entry.allday && entry.future_dates.length > 2,
                "blurb": entry.description.replace(/<[^>]*>?/gm, ''),
                "style": util.stylizer(entry.category),
                "form": entry.url.public
            };
            event.enddate = event.range ? new Date(event.date[event.date.length - 1]) : new Date(entry.end);
            event.datesort = (event.date[0] < time.now && event.length === "range") ? time.now : event.date[0];
            out.push(event);
        }
    });
    out = out.sort((a, b) => a.datesort - b.datesort);
    return out;
}

// Parsed event data for sidebar
const sidebarData = eventParserSidebar(events);

// HTML injection for program blurbs (sidebar)
export const eventInjector = () => {
    let displayed = 0;
    let eventList = ``;
    for (const event of sidebarData) {
        let eventDate, eventTime, eventDateMobile;
        console.log(event);
        if (displayed === 4 ) {
            break
        }
        if (event.range) {
            eventDate = `Starting ${time.monthDay(event.date[0])}`;
            eventTime = `through ${time.monthDay(event.enddate)}`;
            eventDateMobile = `${eventDate.slice(9)} - ${eventTime.slice(8)}`;
        } else if (event.date.length > 1) {
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
        } else {
            console.log(event.name, event.date)
            eventDate = time.fullDate(event.date[0]);
            eventTime = `${time.formatTime(event.date[0])} - ${time.formatTime(event.enddate)}`;
            eventDateMobile = time.monthDayTime(event.date[0]);
        }
        if (event.enddate >= time.now) {
            eventList += `
            <div class="event">
            <div class="event-${event.style}" style="background-image: url(./img/events/${event.img}.jpg);">
                    <a class="event-${event.style}-link" href="${event.form}" target="_blank" rel="noopener">
                        <div class="event-${event.style}-cover">
                            <p class="event-${event.style}-title">${event.title}</p>
                            <hr class="event-${event.style}-hr"/>
                            <p class="event-${event.style}-date">${eventDate}</p>
                            <p class="event-${event.style}-time">${eventTime}</p>
                            <p class="event-${event.style}-date-mobile">${eventDateMobile}</p>
                            <p class="event-${event.style}-desc">${event.blurb}</p>
                        </div>
                    </a>
                </div>
            </div>
            `
            displayed++;
        }
    }
    document.getElementById("events").innerHTML = eventList;
}

// News data
let newsData = fs.readFileSync('src/data/news.yaml', 'utf8');
export let news = yaml.load(newsData);
news = news.sort((a, b) => b.date - a.date);

// Advertisement data
let adsData = fs.readFileSync('src/data/ads.yaml', 'utf8');
let ads = yaml.load(adsData);

// HTML injection for advertisements (sidebar)
export const adInjector = () => {
    const adPool = []
    for (const ad of ads) {
        if (((ad.start && ad.end) && (time.now >= ad.start && ad.end > time.now)) ||
        ((!ad.start && ad.end) && (time.now >= ad.start || ad.end > time.now)) ||
        (!ad.start && !ad.end)) {
            adPool.push(ad)
        }
    }
    const ad = adPool[Math.floor(Math.random() * adPool.length)]
    const adOutput = `
    <a class="advert-img" href="${ad.imglink}" target="_blank" ${util.extchk(ad.imglink)}>
        <picture>
            <source srcset="img/promo/${ad.img}.webp" type="image/webp"/>
            <img class="advert-img-inner" src="img/promo/${ad.img}.${ad.isgif ? "gif" : "jpeg"}" alt="${ad.imgalt}" type="image/${ad.isgif ? "gif" : "jpeg"}"/>
        </picture>
    </a>
    <div class="advert-tag">Advertisement</div>
    `
    document.getElementById("ad").innerHTML = adOutput;
}

// Git data
let tag = fs.readFileSync('src/data/_REV', 'utf8');
export const rev = () => {
    document.getElementById("git").innerHTML = `Build ${tag} · <a href="/site-map">Site Map</a> · <a href="/privacy"> Privacy</a>`;
}