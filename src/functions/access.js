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
    const access = document.getElementById("access");
    const all = document.querySelectorAll("* :not(b):not(i):not(sup):not(svg):not(path):not(.newsletter-decor):not(.event-zoom)");
    const addRemove = type === "dark" ? "add" : "remove";
    access.classList[addRemove]("darkmodeon");
    all.forEach(element => element.style.transition = "all 0.2s ease-in-out");
    root.setAttribute("color-mode", type);
    localStorage.setItem("color-mode", type);
    setTimeout(() => all.forEach(element => element.style.transition = ""), 500);    
}

// Send toggle function to event listener to execute it
export const hicontrast = () => {
    const access = document.getElementById("access");
    if (localStorage.getItem("color-mode") === "dark") {
        access.classList.add("darkmodeon");
    }
    util.addClickListener(e => {
        if (access.contains(e.target) && !access.classList.contains("darkmodeon")) {
            toggleMode("dark");
        } else if (access.contains(e.target) && access.classList.contains("darkmodeon")) {
            toggleMode("lite");
        }
    });
}