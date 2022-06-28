import * as time from './time';
import * as util from './util';
const fs = require('fs');
const yaml = require('js-yaml');

// Event parsing function (sidebar)
export const eventInjector = data => {
    let dupes = ["1-on-1 Computer Help", "1-on-1 Computer Class with Brendan"];
    let sidebarData = []
    data.forEach(entry => {
        let category = entry.category.length > 0 ? entry.category[0].name : entry.category;
        if (!dupes.includes(entry.title) && category !== "Holiday") {
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
            sidebarData.push(event);
        }
    });
    sidebarData = sidebarData.sort((a, b) => a.datesort - b.datesort);
    // Begin injection
    let displayed = 0;
    let eventList = ``;
    for (const event of sidebarData) {
        let eventDate, eventTime, eventDateMobile;
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
            eventDate = time.fullDate(event.date[0]);
            eventTime = `${time.formatTime(event.date[0])} - ${time.formatTime(event.enddate)}`;
            eventDateMobile = time.monthDayTime(event.date[0]);
        }
        if (event.enddate >= time.now) {
            eventList += `
            <div class="event">
            <div class="event-${event.style}">
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

// HTML injection for event calendar
export const programCalendar = (events, dateTime) => {
    const curMonth      = dateTime.getMonth();
    const curMonthName  = time.mm[curMonth];
    const curYear       = dateTime.getFullYear();
    const lastDate      = new Date(curYear, curMonth-1, 1);
    const lastMonth     = lastDate.getMonth();
    const lastMonthName = time.mm[lastMonth];
    const lastYear      = lastDate.getFullYear();
    const nextDate      = new Date(curYear, curMonth+1, 1);
    const nextMonth     = nextDate.getMonth();
    const nextMonthName = time.mm[nextMonth];
    const nextYear      = nextDate.getFullYear();
    document.getElementById("calendar-month").innerHTML = `${curMonthName} ${curYear}`;
    document.getElementById("month-nav-left").innerHTML = `<< ${lastMonthName} ${lastYear}`;
    document.getElementById("month-nav-right").innerHTML = `${nextMonthName} ${nextYear} >>`;
    // Get day of the week for the first day of the month
    const monthFirst = new Date(curYear, dateTime.getMonth(), 1);
    const monthFirstDay = monthFirst.getDay();
    // Add all days of the month, starting from Sunday
    // Then count from that first day until the calendar is filled
    // Add events as you go through the calendar
    let calDate = new Date(curYear, dateTime.getMonth(), 1-monthFirstDay);
    let calIter = 0;
    let calContent = ``;
    const simpleNow = new Date(time.now.getFullYear(), time.now.getMonth(), time.now.getDate());
    while (!(calIter > 6 && dateTime.getMonth() !== calDate.getMonth() && calDate.getDay() === 0)) {
        const dayClass = dateTime.getMonth() !== calDate.getMonth() ? "-grey" : (simpleNow.getTime() === calDate.getTime() ? "-now" : "")
        const extraClass = time.flexMonth(calDate.getMonth()).includes(calDate.getDate()) ? " calendar-flex-half" : "";
        calContent += ` 
        <div class="calendar-day${dayClass}${extraClass}">
            <p class="calendar-num${dayClass}">
                ${calDate.getDate()}<span class="calendar-dotw-inner">${time.weekday(calDate)}</span>
            </p>
            `
        for (const event of events) {
            if (new Date(event.start).setHours(0,0,0,0) === calDate.setHours(0,0,0,0)) {
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
        calDate = new Date(calDate.getFullYear(), calDate.getMonth(), calDate.getDate()+1);
        calIter++;
    }
    document.getElementById("calendar-weeks").innerHTML = calContent;
}

// News data
let newsData = fs.readFileSync('src/data/news.yaml', 'utf8');
export let news = yaml.load(newsData);
for (let i = 0; i < news.length; i++) {
    if (news[i].hidden) {
        news.splice(i, 1);
        i--;
    }
}
news = news.sort((a, b) => b.date - a.date);

// Git data
let tag = fs.readFileSync('src/data/_REV', 'utf8');
export const rev = () => {
    document.getElementById("git").innerHTML = `Build ${tag} · <a href="/site-map">Site Map</a> · <a href="/privacy"> Privacy</a>`;
}