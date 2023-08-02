import * as util from './util';

// Slide information
let curSlide = 0;
const slides = document.querySelectorAll(".hero-slide");
const maxSlide = slides.length;
const slideNum = n => n % maxSlide;

// Navigation click listener
util.addClickListener(e => {
    const previous = document.querySelector(".hero-nav-prev");
    const next = document.querySelector(".hero-nav-next");
    if (previous.contains(e.target)) {
        curSlide = curSlide === 0 ? maxSlide - 1 : curSlide - 1;
        slides.forEach(slide => slide.style.transform = `translateX(${100 * - curSlide}%)`);
    } else if (next.contains(e.target)) {
        curSlide = curSlide === maxSlide - 1 ? 0 : curSlide + 1;
        slides.forEach(slide => slide.style.transform = `translateX(${100 * - curSlide}%)`);
    }
});

/*
const moveChoiceTo = (elem_choice, direction) => {
    var span = elem_choice.parentNode,
        td = span.parentNode;
    if (direction === -1 && span.previousElementSibling) {
        td.insertBefore(span, span.previousElementSibling);
    } else if (direction === 1 && span.nextElementSibling) {
        td.insertBefore(span, span.nextElementSibling.nextElementSibling)
    }
}
*/