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

// Parsing function for mobile calendar display
export const flexMonth = month => {
    const daysInMonth = (new Date(now.getFullYear(), month + 1, 0)).getDate();
    switch (daysInMonth) {
        case 28: return [25, 26, 27, 28];
        case 29: return [28, 29];
        case 30: return [];
        case 31: return [28, 29, 30, 31];
        default: return [];
    }
}

// Load hours data
let hoursData = fs.readFileSync('src/data/hours.yaml', 'utf8');
let hoursYaml = yaml.load(hoursData);
const hours = hoursYaml.hours;
const speHours = hours[7];
const curHours = hours[dotw];
let nextDay = dotw === 6 ? "next Monday" : "tomorrow";
let nextHours = dotw === 6 ? hours[1] : hours[dotw+1];

// Inject hours data
export const injector = () => {
    // Sidebar
    for (let i = 1; i < 7; i++) {
        document.getElementById(`hours${i-1}`).innerHTML = hours[i];
    }
    document.getElementById(`hours6`).innerHTML = hours[0];
    // Footer
    const mainStr = (dotw === 0) || (speHours === "CLOSED") ? `The library is closed today.`
    : `Open today · ${(!!speHours) ? speHours : curHours}`;
    const otherStr = (dotw === 0) || (speHours === "CLOSED") ? `Open ${nextDay} · ${nextHours}` : "";
    document.getElementById("hours-footer-main").innerHTML = mainStr;
    document.getElementById("hours-footer-other").innerHTML = otherStr;
}