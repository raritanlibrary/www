import * as time from './time';
import * as util from './util';
const fs = require('fs');
const yaml = require('js-yaml');

// News data
let newsData = fs.readFileSync('src/data/news.yaml', 'utf8');
export let news = yaml.load(newsData);
news = news.sort((a, b) => b.date - a.date);

// Advertisement data
let adsData = fs.readFileSync('src/data/ads.yaml', 'utf8');
let ads = yaml.load(adsData);

// HTML injection for advertisements (sidebar)
export const adInjector = () => {
    const adPool = []
    for (const ad of ads) {
        if (((ad.start && ad.end) && (time.now >= ad.start && ad.end > time.now)) ||
        ((!ad.start && ad.end) && (time.now >= ad.start || ad.end > time.now)) ||
        (!ad.start && !ad.end)) {
            adPool.push(ad)
        }
    }
    const ad = adPool[Math.floor(Math.random() * adPool.length)]
    const adOutput = `
    <a class="advert-img" href="${ad.imglink}" target="_blank" ${util.extchk(ad.imglink)}>
        <picture>
            <source srcset="img/promo/${ad.img}.webp" type="image/webp"/>
            <img class="advert-img-inner" src="img/promo/${ad.img}.${ad.isgif ? "gif" : "jpeg"}" alt="${ad.imgalt}" type="image/${ad.isgif ? "gif" : "jpeg"}"/>
        </picture>
    </a>
    <div class="advert-tag">Advertisement</div>
    `
    document.getElementById("ad").innerHTML = adOutput;
}

// Git data
let tag = fs.readFileSync('src/data/_REV', 'utf8');
export const rev = () => {
    document.getElementById("git").innerHTML = `Build ${tag} · <a href="/site-map">Site Map</a> · <a href="/privacy"> Privacy</a>`;
}