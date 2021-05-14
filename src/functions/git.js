import * as fx from '../functions/fx';
const fs = require('fs');

const rev = fs.readFileSync('.git/refs/heads/main', 'utf-8').slice(0,2)

export const version = () => {
    if (fx.checkClass('version')) {
        const y = (new Date().getFullYear() - 2020).toString(36) ;
        const m = (new Date().getMonth()).toString(36);
        const d = (new Date().getDate()).toString(36);
        const revF = `${y}${m}${d}${rev}`.toUpperCase()
        fx.setClass('version', `Revision ${revF} · <a href="./site-map"> View Site Map</a>`);
    }
}