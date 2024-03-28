import * as time from './time';
import * as util from './util';
const fs = require('fs');
const yaml = require('js-yaml');

// Event parsing function (truncated)
export const eventInjector = (data, cache) => {
    let dupes = [];
    let truncatedData = []

    // Transpose cache
    cacheByID = {}
    Object.keys(cache).forEach(key => {
        const arr = cache[key];
        arr.forEach(id => {
            cacheByID[id] = key;
        })
    })

    // Initial pass
    data.forEach(entry => {
        let category = entry.category.length > 0 ? entry.category[0].name : 'Event';
        if (!dupes.includes(entry.title) && ['cancel', 'brendan', '1-on-1'].some(x => !(entry.title).toLowerCase().includes(x)) && category !== "Holiday") {
            if (entry.allday) {
                dupes.push(entry.title);
            }
            let event = {
                "title": entry.title.replace("Bridgewater-Raritan High School", "BRHS"),
                "date": [new Date(entry.start)].concat(entry.future_dates.map(({start}) => new Date(start))),
                "length": entry.allday ? 24 : (new Date(entry.end) - new Date(entry.start)) / time.msh,
                "range": entry.allday && entry.future_dates.length > 2,
                "category": category,
                "image": cacheByID[entry.id],
                "form": entry.url.public
            };
            event.enddate = event.range ? new Date(event.date[event.date.length - 1]) : new Date(entry.end);
            event.schedule = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${time.formatISOAlt(event.date[0])}%2F${time.formatISOAlt(event.enddate)}&location=Raritan%20Public%20Library&text=${encodeURIComponent(event.title)}`
            event.datesort = (event.date[0] < time.now && event.length === "range") ? time.now : event.date[0];
            truncatedData.push(event);
        }
    });
    truncatedData = truncatedData.sort((a, b) => a.datesort - b.datesort);
    
    // Begin injection
    let displayed = 0;
    let eventList = ``;
    for (const event of truncatedData) {
        let eventDateTime = time.shortDate(event.date[0]);
        if (displayed === 5 ) {
            break
        }
        if (event.range) {
            eventDateTime += ` - ${time.shortDate(event.enddate)}`;
        } else if (event.date.length > 1 && event.date[0].getDate() === event.date[1].getDate()) {
            eventDateTime += ` | ${time.formatTime(event.date[0])} and ${time.formatTime(event.date[1])}`;
        } else {
            eventDateTime += ` | ${time.formatTime(event.date[0])}`;
        }
        if (event.enddate >= time.now && event.category !== 'Reading Program') {
            eventList += `
            <div class="event">
                <div class="event-category">${event.category}</div>
                <div class="event-main">
                    <picture class="event-image">
                        <source srcset="img/events/${event.image}.webp" alt="${event.title}" type="image/webp">
                        <img src="img/events/${event.image}.jpg" alt="${event.title}" type="image/jpeg">
                    </picture>
                    <div class="event-info">
                        <h2 class="event-header" href="${event.form}" target="_blank" rel="noopener">${event.title}</h2>
                        <div class="event-datetime">${eventDateTime}</div>
                        <div class="event-action">
                            <a href="${event.form}" target="_blank" rel="noopener">Register</a>
                            <a href="${event.schedule}" target="_blank" rel="noopener">Add to calendar</a>
                        </div>
                    </div>
                </div>
            </div>`
            displayed++;
        }
    }

    // Check for div
    const upcomingDiv = document.getElementById("upcoming");
    if (upcomingDiv) {
        upcomingDiv.innerHTML = eventList;
    }
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
    document.getElementById("calendar-nav-back").innerHTML = `🡐 ${lastMonthName} ${lastYear}`;
    document.getElementById("calendar-nav-next").innerHTML = `${nextMonthName} ${nextYear} 🡒`;
    
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
    let dupes = [
        "1-on-1 Computer Help",
        "Brendan 1-on-1 Computer Help",
        "Brendan 1-on-1 Computer Session",
        "1-on-1 Computer Class with Brendan"
    ];
    while (!(calIter > 6 && dateTime.getMonth() !== calDate.getMonth() && calDate.getDay() === 0)) {
        const filteredEvents = events.filter(event => new Date(event.start).setHours(0,0,0,0) === calDate.setHours(0,0,0,0) && ['cancel', 'brendan', '1-on-1'].some(x => !(event.title).toLowerCase().includes(x)));
        const dayClass = dateTime.getMonth() !== calDate.getMonth() ? "-grey" : (simpleNow.getTime() === calDate.getTime() ? "-now" : "")
        const hideEmpty = filteredEvents.length === 0 || (calDate.getMonth() === simpleNow.getMonth() & calDate.getDate() < simpleNow.getDate()) ? " calendar-day-empty" : "";
        calContent += ` 
        <div class="calendar-day${dayClass}${hideEmpty}">
            <div class="calendar-num">
                <span class="calendar-num-dotw">${time.weekday(calDate)}</span>
                <span class="calendar-num-date">${time.mm[calDate.getMonth()]} ${calDate.getDate()}</span>
            </div>`
        for (const event of filteredEvents) {
            let eventTitle = event.title;
            let eventTime = event.allday ? "All Day Event" : `${time.formatTime(new Date(event.start))} - ${time.formatTime(new Date(event.end))}`;
            calContent += `
            <a class="calendar-entry-${util.stylizer(event.category)}" href="${event.url.public}" target="_blank" rel="noopener">
                <span class="calendar-entry-${util.stylizer(event.category)}-time">${eventTime}</span>
                <span>${eventTitle}</span>
            </a>`
        }
        calContent += `</div>`
        calDate = new Date(calDate.getFullYear(), calDate.getMonth(), calDate.getDate()+1);
        calIter++;
    }
    document.getElementById("calendar-weeks").innerHTML = calContent;
}

// Git data
let rev = fs.readFileSync('src/data/_REV', 'utf8');
let sha5 = fs.readFileSync('src/data/_ID', 'utf8');
export const devInfo = () => {
    document.getElementById("git").innerHTML = `<a href="/site-map">Site Map</a> · <a href="/privacy"> Privacy</a> · v2.${String(rev-321).padStart(3, '0')} (${sha5.slice(0,7)}) `;
}