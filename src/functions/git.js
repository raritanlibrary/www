import * as fx from '../functions/fx';
const fs = require('fs');

const rev = fs.readFileSync('.git/refs/heads/main', 'utf-8').slice(0,7)

export const version = () => {
    if (fx.checkClass('version')) {
        fx.setClass('version', `rev. ${new Date().getFullYear()}-${rev} · <a href="./site-map"> View Site Map</a>`);
    }
}