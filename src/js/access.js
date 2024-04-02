import * as util from './util';

// Loads preferences from local storage
export const preload = () => {
    const root = document.documentElement;
    if (localStorage.getItem("color-mode") === "dark") {
        root.setAttribute("color-mode", "dark");
    }
}

// Toggle light/dark mode
const toggleMode = type => {
    const root = document.documentElement;
    const themeButton = document.getElementById("theme");
    const all = document.querySelectorAll("* :not(b):not(span):not(i):not(sup):not(path):not(svg)");
    const addRemove = type === "dark" ? "add" : "remove";
    themeButton.classList[addRemove]("darkmodeon");
    all.forEach(element => element.style.transition = "all 0.2s ease-in-out");
    root.setAttribute("color-mode", type);
    localStorage.setItem("color-mode", type);
    setTimeout(() => all.forEach(element => element.style.transition = ""), 500);    
}

// Send toggle function to event listener to execute it
export const toggleTheme = () => {
    const themeButton = document.getElementById("theme");
    if (localStorage.getItem("color-mode") === "dark") {
        themeButton.classList.add("darkmodeon");
    }
    util.addClickListener(e => {
        if (themeButton.contains(e.target) && !themeButton.classList.contains("darkmodeon")) {
            toggleMode("dark");
        } else if (themeButton.contains(e.target) && themeButton.classList.contains("darkmodeon")) {
            toggleMode("lite");
        }
    });
}

// Back to top button
export const toTop = () => {
    const html = document.documentElement;
    const body = document.body;
    const upButton = document.getElementById("totop");
    // Calc height
    const width = util.getWidth();
    console.log(width);
    let height = 60;
    if (width > 1368) {
        height = 0;
    } else if (width >= 768) {
        height = 0;
    } else if (width >= 500) {
        height = 76;
    }
    // Appear when 20% below top
    document.addEventListener('scroll', e => {
        const element = body.scrollHeight - body.clientHeight === 0 ? html : body;
        const maxScroll = element.scrollHeight - element.clientHeight;
        const ratio = element.scrollTop / maxScroll;
        if (maxScroll / element.clientHeight >= 1) {
            if (element.scrollTop >= (maxScroll * 0.2 + height * 2)) {
                upButton.style.top = `calc(100vh - ${height}px)`
            } else if (ratio >= 0.2) {
                upButton.style.top = `calc(100vh - ${(element.scrollTop - maxScroll * 0.2) / 2}px)`
            } else {
                upButton.style.top = '100vh'
            }
        } else {
            upButton.style.top = '100vh'
        }
    });
    // Scroll to top on click
    util.addClickListener(e => {
        if (upButton.contains(e.target)) {
            html.scrollTop = 0; // chrome/ff/ie/opera
            body.scrollTop = 0; // safari
        }
    });
}