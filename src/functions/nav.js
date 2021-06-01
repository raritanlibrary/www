import * as fx from './fx';

// Uncheck on clicking outside, flip arrows on desktop
export const dropdown = () => {
    window.addEventListener('click', function(e) {   
        const books = document.getElementById("dropdown-books");
        const booksSub = document.getElementById("sublinks-books");
        const booksArrow = document.querySelector("#dropdown-books > div > svg");
        const more = document.getElementById("dropdown-more");
        const moreSub = document.getElementById("sublinks-more");
        const moreArrow = document.querySelector("#dropdown-more > div > svg");
        
        if (books.contains(e.target) && !booksSub.classList.contains("sublinks-down")) {
            booksSub.classList.add("sublinks-down");
            booksArrow.classList.add("rotate180");
        } else if (!booksSub.contains(e.target) && booksSub.classList.contains("sublinks-down")) {
            booksSub.classList.remove("sublinks-down");
            booksArrow.classList.remove("rotate180");
        }

        if (more.contains(e.target) && !moreSub.classList.contains("sublinks-down")) {
            moreSub.classList.add("sublinks-down");
            moreArrow.classList.add("rotate180");
        } else if (!booksSub.contains(e.target) && moreSub.classList.contains("sublinks-down")) {
            moreSub.classList.remove("sublinks-down");
            moreArrow.classList.remove("rotate180");
        }
    });
}

// Icon sticks when selected on mobile, darken and freeze
export const sticky = () => {
    let xDown = null;
    document.addEventListener('touchstart', function(e) {
        const firstTouch = e.touches[0]; 
        xDown = firstTouch.clientX;
    });
    document.addEventListener('touchmove', function(e) {
        if (!xDown) { return; }
        let xUp = e.touches[0].clientX;
        let xDiff = xDown - xUp;
        if (Math.abs(xDiff) > 10) {
            const links = fx.findClass("links");
            const menuIcon = document.querySelector(".nav-toggle > svg");
            const main = document.querySelector(".main");
            const page = document.querySelector("html");
            if (!menuIcon.classList.contains("enlarge") && (xDiff > 0)) {
                links.classList.add("links-open");
                menuIcon.classList.add("enlarge");
                main.classList.add("main-darken", "freeze");
                page.classList.add("freeze");
            } else if (menuIcon.classList.contains("enlarge") && (xDiff < 0)) {
                links.classList.remove("links-open");
                menuIcon.classList.remove("enlarge");
                main.classList.remove("main-darken", "freeze");
                page.classList.remove("freeze");
            }                       
        }
        xDown = null;
    });
    window.addEventListener('click', function(e) {
        const links = fx.findClass("links");
        const menu = fx.findClass("nav-toggle");
        const menuIcon = document.querySelector(".nav-toggle > svg");
        const main = document.querySelector(".main");
        const access = document.querySelector(".access");
        const page = document.querySelector("html");
        if (menu.contains(e.target) && !menuIcon.classList.contains("enlarge")) {
            links.classList.add("links-open");
            menuIcon.classList.add("enlarge");
            main.classList.add("main-darken", "freeze");
            access.classList.add("access-darken");
            page.classList.add("freeze");
        } else if (!links.contains(e.target) && menuIcon.classList.contains("enlarge")) {
            links.classList.remove("links-open");
            menuIcon.classList.remove("enlarge");
            main.classList.remove("main-darken", "freeze");
            access.classList.remove("access-darken");
            page.classList.remove("freeze");
        }
    })
}