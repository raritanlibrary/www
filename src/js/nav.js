import * as util from './util';

// Get an object with some important properties
const getListenerElements = str => {
    return  {
        "main": document.getElementById(`dropdown-${str}`),
        "sub": document.getElementById(`sublinks-${str}`),
        "arrow": document.querySelector(`#dropdown-${str} > div > svg`),    
    }
}

// Conditional for clicking dropdowns
const dropdownClickLogic = (str, e) => {
    const obj = getListenerElements(str);
    util.toggleClasses(
        obj.main.contains(e.target) && !obj.sub.classList.contains("sublinks-down"),
        !obj.sub.contains(e.target) && obj.sub.classList.contains("sublinks-down"),
        [obj.sub, "sublinks-down"],
        [obj.arrow, "rotate180"]
    )
}

// Conditional for dropdowns via keyboard input
const dropdownKeyLogic = (str, tab, e) => {
    const obj = getListenerElements(str);
    util.toggleClasses(
        e.key === "Tab" && (tab === `dropdown-${str}` || tab === `sublinks-${str}`) && !obj.sub.classList.contains("sublinks-down"),
        e.key === "Tab" && (tab !== `sublinks-${str}`) && obj.sub.classList.contains("sublinks-down"),
        [obj.sub, "sublinks-down"],
        [obj.arrow, "rotate180"]
    )
}

// Uncheck on clicking/tabbing outside, flip arrows on desktop
export const dropdown = () => {
    util.addClickListener(e => {
        dropdownClickLogic("books", e);
        dropdownClickLogic("more", e);
    });
    window.addEventListener('keyup', e => {
        let tabbed;
        try {
            tabbed = document.activeElement.id || document.activeElement.parentElement.parentElement.id;
        } catch (error) {
            tabbed = document.activeElement.id;
        }
        dropdownKeyLogic("books", tabbed, e);
        dropdownKeyLogic("more", tabbed, e);
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
                [main, "main-darken", "freeze"],
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
        const access = document.querySelector(".access");
        const page = document.querySelector("html");
        util.toggleClasses(
            menu.contains(e.target) && !menuIcon.classList.contains("enlarge"),
            !links.contains(e.target) && menuIcon.classList.contains("enlarge"),
            [links, "links-open"],
            [menuIcon, "enlarge"],
            [main, "main-darken", "freeze"],
            [access, "access-darken"],
            [page, "freeze"]
        )
    })
}