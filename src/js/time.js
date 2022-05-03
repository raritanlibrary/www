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
export const msh = 36e5;
export const msd = msh*24;

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
    day = addHours(day, 18); // 19 for DST
    return day;
}

// Format a datetime into a string for dates
export const formatDate = n => {
    n = n.getDate();
    return (n % 10 === 1 && n != 11) ? `${n}st`
    : (n % 10 === 2 && n != 12) ? `${n}nd`
    : (n % 10 === 3 && n != 13) ? `${n}rd`
    : `${n}th`
}

// Format a datetime into a string for 12-hour times
export const formatTime = d => {
    const hh = d.getHours();
    const m = d.getMinutes().toString().padStart(2, 0);
    const dd = hh >= 12 ? "PM" : "AM";
    let h = hh >= 12 ? hh - 12 : hh
    h = h === 0 ? h = 12 : h;
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
            if (j < splitter[i+1]-1) { datestr += `, ` }
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
const speHours = hours[7];
const speHoursPorch = hoursPorch[7];
const curHours = hours[dotw];
const curHoursPorch = hoursPorch[dotw];
let nextDay = dotw === 6 ? "next Monday" : "tomorrow";
let nextHours = dotw === 6 ? hours[1] : hoursPorch[dotw+1];

// Inject hours data
export const injector = () => {
    // Sidebar
    for (let i = 1; i < 7; i++) {
        document.getElementById(`hours${i-1}`).innerHTML = hours[i];
        document.getElementById(`porch${i-1}`).innerHTML = hoursPorch[i];
    }
    document.getElementById(`hours6`).innerHTML = hours[0];
    document.getElementById(`porch6`).innerHTML = hoursPorch[0];
    // Footer
    const mainStr = (dotw === 0) || (speHours === "CLOSED") ? `The library is closed today.`
    : `Open today · ${(!!speHours && !!speHoursPorch) ? speHours : curHours}`;
    const otherStr = (dotw === 0) || (speHours === "CLOSED") ? `Open ${nextDay} · ${nextHours}`
    : `Porchside Pickup · ${(!!speHours && !!speHoursPorch) ? speHoursPorch : curHoursPorch}`;
    document.getElementById("hours-footer-main").innerHTML = mainStr;
    document.getElementById("hours-footer-other").innerHTML = otherStr;
}