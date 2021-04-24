import * as Time from './time';
import * as fx from './fx';
const fs = require('fs');
const yaml = require('js-yaml');

// Events data
let eventData = fs.readFileSync('src/data/events.yaml', 'utf8');
export let events = yaml.load(eventData);
events = events.sort((a, b) => a.date - b.date);

// News data
let newsData = fs.readFileSync('src/data/news.yaml', 'utf8');
export let news = yaml.load(newsData);
news = news.sort((a, b) => b.date - a.date);

export const eventInjector = () => {
    if (fx.checkClass(`calendar-events`)) {
        let displayed = 0;
        let eventList = ``;
        let endTime, zoomLink;
        for (const event of events) {
            let eventFiller = ``;
            let eventFillerDesc = ``;
            if (displayed === 3 ) { break };
            if (event.endtime) {
                endTime = ` - ${Time.formatTime(Time.addHours(event.date, event.length))}`
            } else {
                endTime = ``
            }
            if ((Time.addHours(event.date, -0.25) <= Time.now) && (Time.addHours(event.date, event.length) >= Time.now)) {
                zoomLink = `
                <a class="event-zoom-link" href="${event.zoom}" target="_blank" rel="noopener">
                    <div class="event-zoom"> Join now on
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 7 24 8">
                            <path d="M4.585 13.607l-.27-.012H1.886l3.236-3.237-.013-.27a.815.815 0 00-.796-.796l-.27-.013H0l.014.27c.034.438.353.77.794.796l.27.013h2.43L.268 13.595l.014.269c.015.433.362.78.795.796l.27.013h4.046l-.014-.27c-.036-.443-.35-.767-.795-.795zm3.238-4.328h-.004a2.696 2.697 0 10.003 0zm1.141 3.841a1.619 1.619 0 11-2.289-2.288 1.619 1.619 0 012.289 2.288zM21.84 9.28a2.158 2.158 0 00-1.615.73 2.153 2.153 0 00-1.619-.732 2.148 2.148 0 00-1.208.37c-.21-.233-.68-.37-.949-.37v5.395l.27-.013c.45-.03.778-.349.796-.796l.013-.27v-1.889l.014-.27c.01-.202.04-.382.132-.54a1.078 1.079 0 011.473-.393 1.078 1.079 0 01.393.392c.093.16.12.34.132.54l.014.271v1.889l.013.269a.83.83 0 00.795.796l.27.013v-2.967l.012-.27c.01-.2.04-.384.134-.543.3-.514.96-.69 1.473-.39a1.078 1.079 0 01.393.393c.092.16.12.343.13.54l.015.27v1.889l.013.269c.028.443.35.77.796.796l.27.013v-3.237a2.158 2.158 0 00-2.16-2.156zm-10.263.788a2.697 2.698 0 103.811 3.816 2.697 2.698 0 00-3.811-3.816zm3.05 3.052a1.619 1.619 0 11-2.289-2.29 1.619 1.619 0 012.289 2.29z"/>
                        </svg>
                    </div>
                </a>
                `
            } else {
                eventFiller = ` event-filler`
                eventFillerDesc = `<p class="event-${event.style}-desc-filler">Learn more about this event</p>`
                zoomLink = `<div class="event-spacer"></div>`
            }
            if (Time.addHours(event.date, event.length) >= Time.now) {
                eventList += `
                <div class="event">
                    <div class="event-${event.style}" style="background-image: url(./img/events/${event.img};")>
                        <a class="event-${event.style}-link" href="programs#${(event.date.getTime()/100000).toString(36).slice(1)}">
                            <div class="event-${event.style}-cover">
                                <p class="event-${event.style}-title">${event.title}</p>
                                <p class="event-${event.style}-subtitle">${event.subtitle}</p>
                                <hr class="event-${event.style}-hr" />
                                <p class="event-${event.style}-time">${Time.weekday[event.date.getDay()]}, ${Time.month[event.date.getMonth()]} ${Time.formatDate(event.date.getDate())}</p>
                                <p class="event-${event.style}-date">${Time.formatTime(event.date)}${endTime}</p>
                                <p class="event-${event.style}-time-mobile">${Time.month[event.date.getMonth()]} ${Time.formatDate(event.date.getDate())} at ${Time.formatTime(event.date)}</p>
                                <p class="event-${event.style}-desc">${event.blurb}</p>
                                ${eventFillerDesc}
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