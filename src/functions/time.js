import * as util from './util';
const fs = require('fs');
const yaml = require('js-yaml');

// Current time
export const now = new Date();
export const dotw = now.getDay();

// Days of the week and month names
export const ww = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const mm = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Return day of the week or month name based on a datetime object
export const weekday = t => ww[t.getDay()];
export const month = t => mm[t.getMonth()];

// Millisecond shortcuts (milliseconds * seconds * minutes...)
const msh = 36e5;
const msd = msh*24;

// Add hours or days to a datetime object
export const addHours = (d, h) => new Date(d.getTime() + h * msh);
export const addDays = (d, dd) => new Date(d.getTime() + dd * msd);

// Get the next day of the week
export const getNextDotw = (d, which) => {
    let day = new Date(new Date(d).setHours(0,0,0,0));
    while (day.getDay() != which) {
        day = addDays(day, 1);
    }
    return day;
}

// Get the next time (Thursday) a board meeting will happen
export const getR = which => {
    const monthDay = new Date(now.getFullYear(), now.getMonth(), 1);
    let day = getNextDotw(monthDay, 4);
    day = addDays(day, which*7);
    day = addHours(day, 19);
    return day;
}

// Format a datetime into a string for dates
export const formatDate = n => {
    n = n.getDate();
    return (n % 10 === 1 && n % 100 != 11) ? `${n}st`
    : (n % 10 === 2 && n % 100 != 12) ? `${n}nd`
    : (n % 10 === 3 && n % 100 != 13) ? `${n}rd`
    : `${n}th`
}

// Format a datetime into a string for 12-hour times
export const formatTime = d => {
    const hh = d.getHours();
    const m = d.getMinutes().toString().padStart(2, 0);
    let dd = "AM";
    let h = hh;
    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h === 0) {
        h = 12;
    }
    return `${h}:${m} ${dd}`;
}

// Shortcuts to combine stringified datetimes
export const monthDay = t => `${month(t)} ${formatDate(t)}`;
export const fullDate = t => `${weekday(t)}, ${monthDay(t)}`;
export const monthDayTime = t => `${monthDay(t)} at ${formatTime(t)}`;
export const fullDayTime = t => `${fullDate(t)}, ${formatTime(t)}`;

// Formats multiple dates into a string, chunked by month
export const datechunk = arr => {
    let splitter = [0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].getMonth() !== arr[i-1].getMonth()) {
            splitter.push(i);
        }
    }
    splitter.push(arr.length)
    let output = [];
    let datestr;
    for (let i = 0; i < splitter.length-1; i++) {
        datestr = `${month(arr[splitter[i]])} `;
        for (let j = splitter[i]; j < splitter[i+1]; j++) {
            datestr += formatDate(arr[j]);
            if (j < splitter[i+1]-1) { datestr += ` & ` }
        }
        output.push(datestr);
    }
    return output;
}

// Load hours data
let hoursData = fs.readFileSync('src/data/hours.yaml', 'utf8');
let hoursYaml = yaml.load(hoursData);
const hours = hoursYaml.hours;
const hoursPorch = hoursYaml.porch;
const spehours = hours[7];
const spehoursPorch = hoursPorch[7];
const curhours = hours[dotw];
const curhoursPorch = hoursPorch[dotw];
let nexday = dotw === 6 ? "next Monday" : "tomorrow";
let nexhours = dotw === 6 ? hours[1] : hoursPorch[dotw+1];

// Inject hours data
export const injector = () => {
    if (util.checkClass(`hours-detail`)) {
        for (let i = 0; i < 6; i++) {
            util.setClass(`hours-detail`, hours[i+1], i)
            util.setClass(`hours-detail`, hoursPorch[i+1], i+7)
        }
        util.setClass(`hours-detail`, hours[0], 6)
        util.setClass(`hours-detail`, hoursPorch[0], 13)
    }
    if (util.checkClass(`hours-footer-main`) && util.checkClass(`hours-footer-other`)) {
        const mainStr = (dotw === 0) || (spehours === "CLOSED") ? `The library is closed today.`
        : !!spehours && !!spehoursPorch ? `Open today · ${spehours}`
        : `Open today · ${curhours}`;
        const otherStr = (dotw === 0) || (spehours === "CLOSED") ? `Open ${nexday} · ${nexhours}`
        : !!spehours && !!spehoursPorch ? `Porchside Pickup · ${spehoursPorch}`
        : `Porchside Pickup · ${curhoursPorch}`;
        util.setClass(`hours-footer-main`, mainStr);
        util.setClass(`hours-footer-other`, otherStr);
    }
}