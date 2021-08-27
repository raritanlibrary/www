import * as fx from './fx';
const fs = require('fs');
const yaml = require('js-yaml');

export const now = new Date();
export const dotw = now.getDay();
export const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
export const month = [
    "January",
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

export const getR = (which) => {
    const month = new Date(`${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, 0)}-01 00:00:00 -4`);
    let output = [];
    for (let i = month.getTime(); i < i + 2419200000; i += 86400000) {
        let id = new Date(i);
        if (id.getDay() == 4) {
            output.push(new Date(`${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, 0)}-${id.getDate()+7} 19:00:00 -4`));
            output.push(new Date(`${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, 0)}-${id.getDate()+14} 19:00:00 -4`));
            break;
        }
    }
    return output[which];
}

export const formatDate = (n) => {
    return (n % 10 == 1 && n % 100 != 11) ? `${n}st`
    : (n % 10 == 2 && n % 100 != 12) ? `${n}nd`
    : (n % 10 == 3 && n % 100 != 13) ? `${n}rd`
    : `${n}th`
}

export const formatTime = (d) => {
    const hh = d.getHours();
    const m = d.getMinutes().toString().padStart(2, 0);
    let dd = "AM";
    let h = hh;
    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    return `${h}:${m} ${dd}`;
}

export const addHours = (d, h) => {
    const dNew = new Date(d.getTime() + h*60*60*1000);
    return dNew;
}

export const datechunk = arr => {
    // [8,8,9,9,10]
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
        datestr = `${month[arr[splitter[i]].getMonth()]} `;
        for (let j = splitter[i]; j < splitter[i+1]; j++) {
            datestr += formatDate(arr[j].getDate())
            if (j < splitter[i+1]-1) { datestr += ` & ` }
        }
        output.push(datestr);
    }
    return output;
}

export let hoursData = fs.readFileSync('src/data/hours.yaml', 'utf8');
export let hoursYaml = yaml.load(hoursData);
export const hours = hoursYaml.hours;
export const hoursPorch = hoursYaml.porch;
export const spehours = hours[7];
export const spehoursPorch = hoursPorch[7];

export const curhours = hours[dotw];
export const curhoursPorch = hoursPorch[dotw];
export let nexday = "tomorrow"
export let nexhours = hoursPorch[dotw+1];
if (dotw == 6) {
    nexday = "next Monday"
    nexhours = hours[1];
}

export const injector = () => {
    if (fx.checkClass(`hours-detail`)) {
        for (let i = 0; i < 6; i++) {
            fx.setClass(`hours-detail`, hours[i+1], i)
            fx.setClass(`hours-detail`, hoursPorch[i+1], i+7)
        }
        fx.setClass(`hours-detail`, hours[0], 6)
        fx.setClass(`hours-detail`, hoursPorch[0], 13)
    }
    if (fx.checkClass(`hours-footer-main`) && fx.checkClass(`hours-footer-other`)) {
        if (dotw === 0) {
            fx.setClass(`hours-footer-main`, `The library is closed today.`);
            fx.setClass(`hours-footer-other`, `Open ${nexday} · ${nexhours}`);
        } else if (spehours == "CLOSED") {
            fx.setClass(`hours-footer-main`, `The library is closed today.`);
            fx.setClass(`hours-footer-other`, `Open ${nexday} · ${nexhours}`);
        } else if (!!spehours && !!spehoursPorch) {
            fx.setClass(`hours-footer-main`, `Open today · ${spehours}`);
            fx.setClass(`hours-footer-other`, `Porchside Pickup · ${spehoursPorch}`);
        } else {
            fx.setClass(`hours-footer-main`, `Open today · ${curhours}`);
            fx.setClass(`hours-footer-other`, `Porchside Pickup · ${curhoursPorch}`);
        }
    }
}