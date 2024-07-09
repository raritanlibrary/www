import * as util from './util';
const fs = require('fs');

const _biJson = fs.readFileSync('src/data/bookit.json', 'utf8');
const biJson = JSON.parse(_biJson);

export const authors = () => {
    // Slide information
    const container = document.getElementById('bookit');
    displayNum = 10;

    const author = () => {
        const id = util.getRandomInt(199);
        return `<picture class="bookit-img">
            <source src="img/bookit/${id}.webp" alt="${biJson[id].name}" type="image/webp">
            <img src="img/bookit/${id}.jpg" alt="${biJson[id].name}" type="image/jpeg">
        </picture>`
    }

    // Add inital content set
    for (let i = 0; i < displayNum; i++) {
        container.innerHTML += author();
    }

    // Shift logic
    const shift = () => {
        // Remove first child, add new random
        container.removeChild(container.firstElementChild);
        container.innerHTML += author();
        // Update children list
        const children = Array.from(container.children);
        // Advance slide
        children.forEach((child, i) => child.style.transform = `translateX(${(i-2)*100}%)`);
        setTimeout(() => {
            children.forEach((child, i) => child.style.transform = `translateX(${(i-3)*100}%)`);
        }, 20)
    }

    // Auto-advance
    shift();
    setInterval(shift, 12000);
}