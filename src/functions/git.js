import * as fx from '../functions/fx';
const fs = require('fs');

const rev = fs.readFileSync('.git/refs/heads/main', 'utf-8').slice(0,2)

const time = fs.readFileSync('.git/logs/HEAD', 'utf-8')
const timelines = time.trim().split('\n');
const timeslice = timelines.slice(-1)[0].slice(139,149)
const timeparsed = new Date (Number(timeslice * 1000));

export const version = () => {
    if (fx.checkClass('version')) {
        const y = (timeparsed.getFullYear() - 2020).toString(36) ;
        const m = (timeparsed.getMonth()).toString(36);
        const d = (timeparsed.getDate()).toString(36);
        const revF = `${y}${m}${d}${rev}`.toUpperCase()
        fx.setClass('version', `Revision ${revF} · <a href="./site-map"> View Site Map</a>`);
    }
}