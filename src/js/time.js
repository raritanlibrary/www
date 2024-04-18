import * as svg from './svg';
const fs = require('fs');
import holidays from '../data/holidays.json';

// Current time
export const now = new Date();
export const dotw = now.getDay();

// Days of the week and month names
export const ww = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const mm = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Return day of the week or month name based on a datetime object
export const weekday = t => ww[t.getDay()];
export const weekdayShort = t => `${weekday(t).slice(0,3)}.`;
export const month = t => mm[t.getMonth()];
export const monthShort = t => `${month(t).slice(0,3)}.`;

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

// Format a datetime into a string yyyymmddThhmmssZ (for calendar links)
export const formatISOAlt = date => date.toISOString().replace(/\d+Z/, 'Z').replaceAll(/[^\dTZ]+/g, '');

// Shortcuts to combine stringified datetimes
export const monthDay = t => `${month(t)} ${formatDate(t)}`;
export const shortDate = t => `${weekdayShort(t)} ${month(t)} ${t.getDate()}`;
export const fullDate = t => `${weekday(t)}, ${monthDay(t)}`;

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

// Inject holiday data
export const injector = () => {
    // Prune expired alerts
    const alerts = document.getElementById("alerts");
    if (alerts) {
        const alertList = Array.from(alerts.children);
        let prunedAlerts = ``;
        alertList.forEach(alert => {
            const expiry = Number(alert.dataset.expires);
            if (expiry > now.getTime() || isNaN(expiry)) {
                prunedAlerts += alert.outerHTML;
            }
        })
        alerts.innerHTML = prunedAlerts;
    }

    // Holiday alerts
    const holidayKeys = Object.keys(holidays);
    holidayKeys.forEach(holiday => {
        const isHoliday = holidays[holiday].isHoliday;
        const holidayDates = holidays[holiday].dates;
        const dateKeys = Object.keys(holidayDates);
        // Get closing days
        let closings = dateKeys.filter(x => holidayDates[x] === 'CLOSED');
        // Get modified schedules
        let modDates = {...holidayDates};
        Object.keys(modDates).forEach(x => {if (closings.includes(x)) delete modDates[x]});
        // Prepare alert string (closings)
        let closeStr, modStr;
        if (closings.length > 0) {
            const closeStart    = addHours(new Date(closings[0]), 5);
            const closeEnd      = addHours(new Date(closings[closings.length-1]), 29);
            const closeEndName  = addHours(new Date(closeEnd), -24)
            closeStr = `be closed ${closings.length > 1 ? `from <b>${fullDate(closeStart)}</b> to <b>${fullDate(closeEndName)}</b>` : `on <b>${fullDate(closeStart)}</b>`}`;
        }
        // Prepare alert string (delays/early closings)
        // Handles only one modified schedule for now.
        if (Object.keys(modDates).length > 0) {
            const modKey = Object.keys(modDates)[0];
            const modDay = addHours(new Date(modKey), 5);
            const [modOpen, modClose] = modDates[modKey].split(' - ');
            modStr = `${modOpen !== '9 AM' ? `open at <b>${modOpen}` : `close at <b>${modClose}`}</b> on <b>${fullDate(modDay)}</b>`;
        }
        // Concat + inject string
        const holidayStart  = addHours(new Date(dateKeys[0]), 5);
        const holidayEnd    = addHours(new Date(dateKeys[dateKeys.length-1]), -24);
        if (alerts && holidayStart.getTime() - now.getTime() <= msd*14 && holidayEnd.getTime() - now.getTime() > 0) {
            alerts.innerHTML = `${alerts.innerHTML}
            <div class="alert-info">
                ${svg.info}
                <span>Raritan Public Library will ${closeStr ? closeStr : modStr} ${isHoliday ? 'in observance of' : 'for'} <b>${holiday}</b>. ${modStr ? `The Library will also ${modStr}.` : ``}</span>
            </div>`
        }
    });
}