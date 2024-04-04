import * as util from './util';

// Get an object with some important properties
const moreLinks = {
    "main": document.getElementById(`more`),
    "sub": document.getElementById(`more-content`),
    "arrow": document.querySelector(`#more > svg`)
}

// Conditional for clicking dropdowns
const dropdownClickLogic = e => {
    util.toggleClasses(
        moreLinks.main.contains(e.target) && !moreLinks.sub.classList.contains("more-links-down"),
        !moreLinks.sub.contains(e.target) && moreLinks.sub.classList.contains("more-links-down"),
        [moreLinks.sub, "more-links-down"],
        [moreLinks.arrow, "rotate180"]
    )
}

// Conditional for dropdowns via keyboard input
const dropdownKeyLogic = (tab, e) => {
    util.toggleClasses(
        e.key === "Tab" && tab === `more` && !moreLinks.sub.classList.contains("more-links-down"),
        e.key === "Tab" && tab !== `more` && moreLinks.sub.classList.contains("more-links-down"),
        [moreLinks.sub, "more-links-down"],
        [moreLinks.arrow, "rotate180"]
    )
}

// Uncheck on clicking/tabbing outside, flip arrows on desktop
export const dropdown = () => {
    util.addClickListener(e => {
        dropdownClickLogic(e);
    });
    window.addEventListener('keyup', e => {
        let tabbed;
        console.log(document.activeElement.id || document.activeElement.parentElement.parentElement.id);
        try {
            tabbed = document.activeElement.id || document.activeElement.parentElement.parentElement.id;
        } catch (error) {
            tabbed = document.activeElement.id;
        }
        dropdownKeyLogic(tabbed, e);
    });
}

// Icon sticks when selected on mobile, darken and freeze
export const sticky = () => {
    let xDown = null;
    document.addEventListener('touchstart', e => {
        const firstTouch = e.touches[0]; 
        xDown = firstTouch.clientX;
    });
    document.addEventListener('touchmove', e => {
        if (!xDown) { return }
        let xUp = e.touches[0].clientX;
        let xDiff = xDown - xUp;
        if (Math.abs(xDiff) > 10 && document.documentElement.scrollTop < 20) {
            const links = document.getElementById("links");
            const menuIcon = document.querySelector(".nav-toggle > svg");
            const main = document.querySelector(".main");
            const page = document.querySelector("html");
            util.toggleClasses(
                !menuIcon.classList.contains("enlarge") && (xDiff > 0),
                menuIcon.classList.contains("enlarge") && (xDiff < 0),
                [links, "links-open"],
                [menuIcon, "enlarge"],
                [main, "darken", "freeze"],
                [page, "freeze"]                
            )
        }
        xDown = null;
    });
    util.addClickListener(e => {
        const links = document.getElementById("links");
        const menu = document.getElementById("nav-toggle");
        const menuIcon = document.querySelector(".nav-toggle > svg");
        const main = document.querySelector(".main");
        const themeButton = document.getElementById("theme");
        const page = document.querySelector("html");
        util.toggleClasses(
            menu.contains(e.target) && !menuIcon.classList.contains("enlarge"),
            !links.contains(e.target) && menuIcon.classList.contains("enlarge"),
            [links, "links-open"],
            [menuIcon, "enlarge"],
            [main, "darken", "freeze"],
            [themeButton, "theme-darken"],
            [page, "freeze"]
        )
    })
}