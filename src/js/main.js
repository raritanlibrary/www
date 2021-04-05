// Time
const now = new Date();
const dotw = now.getDay();
const weekday = [
    "Sunday"
    ,"Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
const month = ["January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
const formatDate = (n) => {
    return (n % 10 == 1 && n % 100 != 11) ? `${n}st`
    : (n % 10 == 2 && n % 100 != 12) ? `${n}nd`
    : (n % 10 == 3 && n % 100 != 13) ? `${n}rd`
    : `${n}th`
}
const formatTime = (d) => {
    hh = d.getHours();
    m = d.getMinutes().toString().padStart(2, 0);
    dd = "AM";
    h = hh;
    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    return `${h}:${m} ${dd}`;
}
const addHours = (d, h) => {
    dNew = new Date(d.getTime() + h*60*60*1000);
    return dNew;
}

// List of hours
const hours = [
    "CLOSED",
    "10 AM - 5 PM",
    "10 AM - 5 PM",
    "10 AM - 5 PM",
    "10 AM - 8 PM",
    "10 AM - 5 PM",
    "10 AM - 3 PM"
];
const hoursPorch = [
    "CLOSED",
    "10 AM - 8 PM",
    "10 AM - 8 PM",
    "10 AM - 8 PM",
    "10 AM - 8 PM",
    "10 AM - 5 PM",
    "10 AM - 3 PM"
];

// Single-display calculation
const curhours = hours[dotw];
const curhoursPorch = hoursPorch[dotw];
let nexday = "tomorrow"
let nexhours = hoursPorch[dotw+1];
if (dotw == 6) {
    nexday = "next Monday"
    nexhours = hours[1];
}

// Special hours (early closings)
const spehours = ""
const spehoursPorch = ""

/* Events
    0   Type (for styling)
    1   Title
    2   Subtitle
    3   Short desc.
    4   Long desc.
    5   Datetime
    6   Length of program in hours
    7   Display end time 
    8   More information
    9   Zoom link
*/
const events = [
    [
        "yoga",
        "Virtual Chair Yoga",
        "with Breda",
        "Join our popular \"Chair Yoga\" instructor, Breda, for a virtual yoga session via the Zoom app. No experience necessary.",
        "Join our popular \"Chair Yoga\" instructor, Breda, for a virtual yoga session via the Zoom app. Session will last approximately 45 mins, and there's no experience necessary. We recommend you provide your email address to us so we can send you the Zoom link in advance.",
        new Date("2021-03-27T10:00-04:00"),
        1,
        true,
        "##",
        "#",
    ], [
        "orange",
        "Flower Trellis Wreath",
        "with Michele Liana",
        "Join Michele Liana in creating this beautiful flower and moss-covered Trellis Wreath. Class will be held on Zoom. A $15 fee applies for materials only and is due at time of registration.",
        "Join Michele Liana in creating this beautiful flower and moss-covered Trellis Wreath. Class will be held on Zoom. A $15 fee applies for materials only and is due at time of registration. Sign up early as class size is limited. Please note that flowers may vary from photo.",
        new Date("2021-04-29T18:30-04:00"),
        1.5,
        false,
        "##",
        "#",
    ],
];

// shorthand funcs
const checkClass = (c) => document.getElementsByClassName(c).length > 0;
const setClass = (c, str, n=0) => document.getElementsByClassName(c)[n].innerHTML = str;

window.onload = function() {
    // hours.pug
    if (checkClass(`hours-detail`)) {
        for (let i = 0; i < 6; i++) {
            setClass(`hours-detail`, hours[i+1], i)
            setClass(`hours-detail`, hoursPorch[i+1], i+7)
        }
        setClass(`hours-detail`, hours[0], 6)
        setClass(`hours-detail`, hoursPorch[0], 13)
    }
    // footer.pug
    if (checkClass(`hours-footer-main`) && checkClass(`hours-footer-other`)) {
        if (dotw === 0) {
            setClass(`hours-footer-main`, `The library is closed today.`);
            setClass(`hours-footer-other`, `Open ${nexday} · ${nexhours}`);
        } else if (spehours == "CLOSED") {
            setClass(`hours-footer-main`, `The library is closed today.`);
            setClass(`hours-footer-other`, `Open ${nexday} · ${nexhours}`);
        } else if (!!spehours && !!spehoursPorch) {
            setClass(`hours-footer-main`, `Open today · ${spehours}`);
            setClass(`hours-footer-other`, `Porchside Pickup · ${spehoursPorch}`);
        } else {
            setClass(`hours-footer-main`, `Open today · ${curhours}`);
            setClass(`hours-footer-other`, `Porchside Pickup · ${curhoursPorch}`);
        }
    }
    // calendar.pug
    if (checkClass(`calendar-events`)) {
        let displayed = 0;
        let eventList = ``;
        let eventFiller = ``;
        let eventFillerDesc = ``;
        let endTime, zoomLink;
        for (const event of events) {
            if (displayed === 3 ) { break };
            if (event[7]) {
                endTime = ` - ${formatTime(addHours(event[5], event[6]))}`
            } else {
                endTime = ``
            }
            if ((addHours(event[5], -0.25) <= now) && (addHours(event[5], event[6]) >= now)) {
                zoomLink = `
                <a class="event-zoom-link" href="${event[9]}" target="_blank">
                    <div class="event-zoom"> Join now on
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 7 24 8">
                            <path d="M4.585 13.607l-.27-.012H1.886l3.236-3.237-.013-.27a.815.815 0 00-.796-.796l-.27-.013H0l.014.27c.034.438.353.77.794.796l.27.013h2.43L.268 13.595l.014.269c.015.433.362.78.795.796l.27.013h4.046l-.014-.27c-.036-.443-.35-.767-.795-.795zm3.238-4.328h-.004a2.696 2.697 0 10.003 0zm1.141 3.841a1.619 1.619 0 11-2.289-2.288 1.619 1.619 0 012.289 2.288zM21.84 9.28a2.158 2.158 0 00-1.615.73 2.153 2.153 0 00-1.619-.732 2.148 2.148 0 00-1.208.37c-.21-.233-.68-.37-.949-.37v5.395l.27-.013c.45-.03.778-.349.796-.796l.013-.27v-1.889l.014-.27c.01-.202.04-.382.132-.54a1.078 1.079 0 011.473-.393 1.078 1.079 0 01.393.392c.093.16.12.34.132.54l.014.271v1.889l.013.269a.83.83 0 00.795.796l.27.013v-2.967l.012-.27c.01-.2.04-.384.134-.543.3-.514.96-.69 1.473-.39a1.078 1.079 0 01.393.393c.092.16.12.343.13.54l.015.27v1.889l.013.269c.028.443.35.77.796.796l.27.013v-3.237a2.158 2.158 0 00-2.16-2.156zm-10.263.788a2.697 2.698 0 103.811 3.816 2.697 2.698 0 00-3.811-3.816zm3.05 3.052a1.619 1.619 0 11-2.289-2.29 1.619 1.619 0 012.289 2.29z"/>
                        </svg>
                    </div>
                </a>
                `
            } else {
                eventFiller = ` event-filler`
                eventFillerDesc = `<p class="event-${event[0]}-desc-filler">Click here to learn more!</p>`
                zoomLink = `<div class="event-spacer"></div>`
            }
            if (addHours(event[5], event[6]) >= now) {
                eventList += `
                <div class="event">
                    <div class="event-${event[0]}${eventFiller}">
                        <a class="event-${event[0]}-link" href="${event[8]}">
                            <div class="event-${event[0]}-cover">
                                <p class="event-${event[0]}-title">${event[1]}</p>
                                <p class="event-${event[0]}-subtitle">${event[2]}</p>
                                <hr class="event-${event[0]}-hr" />
                                <p class="event-${event[0]}-time">${weekday[event[5].getDay()]}, ${month[event[5].getMonth()]} ${formatDate(event[5].getDate())}</p>
                                <p class="event-${event[0]}-date">${formatTime(event[5])}${endTime}</p>
                                <p class="event-${event[0]}-time-mobile">${month[event[5].getMonth()]} ${formatDate(event[5].getDate())} at ${formatTime(event[5])}</p>
                                <p class="event-${event[0]}-desc">${event[3]}</p>
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
        setClass(`calendar-events`, eventList)
    }
};