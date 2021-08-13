import * as Time from './time';

export const checkClass = (c) => document.getElementsByClassName(c).length > 0;
export const findClass = (c, n=0) => document.getElementsByClassName(c)[n];
export const setClass = (c, str, n=0) => document.getElementsByClassName(c)[n].innerHTML = str;

export const extchk = str => str.match('^http') ? `rel="noopener"` : ``;

export const addClickListener = fn => {
    var fns = fn.toString();
    fns = fns.slice(fns.indexOf("{") + 1, fns.lastIndexOf("}"));
    const fne = new Function(fns + "\n" + 'e.preventDefault()');
    window.addEventListener('touchstart', fne);
    window.addEventListener('click', fn);
}

export const eventParser = yaml => {
    yaml.forEach(event => {
        if (event.zoom && !event.tag) {
            event.tag = 'zoom';
        }
        if (event.date === 'tbd') {
            event.datesortable = Time.addHours(Time.now, event.length);
            event.datenominal = Time.addHours(Time.now, event.length);
            event.zoom = false;
        } else if (event.length === 'daterange') {
            event.length = 1;
            event.datenominal = event.date[1];
            event.daterange = true;
            if (event.date[0] < Time.now) {
                event.datesortable = Time.now;
            } else {
                event.datesortable = event.date[0];
            }
        } else if (Array.isArray(event.date)) {
            for (let i = 0; i < event.date.length; i++) {
                let day = event.date[i];
                if (Time.addHours(day, event.length) < Time.now && event.date.length !== 1) {
                    event.date.shift();
                    if (event.zoom) {
                        event.zoom.shift();
                    }
                    i--;
                } else {
                    event.datesortable = day;
                    event.datenominal = day;
                    if (event.zoom) {
                        event.zoom = event.zoom[0];
                    }
                    break;
                } 
            }
        } else {
            event.datesortable = event.date;
            event.datenominal = event.date;
        }
    });
    yaml = yaml.sort((a, b) => a.datesortable - b.datesortable);
}

const bitnot = n => {
    let output =  [];
    n = n.toString(2).padStart(3, '0').split('');
    n.forEach(nn => {
        output.push(nn === '1' ? '0' : '1');
    });
    return output.join('');
}

export const eventid = (str, date) => {
    str = str.replace(/\W+|\d/g, '').toLowerCase();
    str = str.substring(0, 19).padEnd(19, 'a');

    let strbin = [];
    str.split('').forEach(char => {
        strbin.push((char.charCodeAt() - 97).toString(2).padStart(5, '0'));
    });
    strbin = strbin.join('') + '0';

    const datestr = String(date.getTime()).substring(0,8);
    let datebin = [];
    datestr.split('').forEach(char => {
        datebin.push(Number(char).toString(2).padStart(4, '0'));
    });
    datebin = datebin.join('');

    let bin = [];
    for (let i = 0; i < strbin.length; i += 3) {
        let n = parseInt(strbin.substring(0+i,3+i), 2);
        if (datebin[i/3] === '1') {
            bin.push(bitnot(n));
        } else {
            bin.push(n.toString(2).padStart(3, '0'));
        }
    }
    bin = bin.join('');

    let output = ``;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
    for (let i = 0; i < bin.length; i += 16) {
        let n = parseInt(bin.substring(0+i,6+i), 2);
        output += chars[n];
    }    

    return output;
}
