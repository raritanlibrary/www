import * as util from './util';

// Slide information
let curSlide = 0;
const mod = (n, m) => ((n % m) + m) % m;

// Navigation click listener
util.addClickListener(e => {
    const slideContainer = document.getElementById('hero-content');
    let slides = Array.from(slideContainer.children);
    const maxSlide = slides.length;
    const previous = document.getElementById("hero-prev");
    const next = document.getElementById("hero-next");
    if (previous.contains(e.target) || next.contains(e.target)) {
        // Unset slide dot
        document.getElementById(`hero-dot-${curSlide}`).classList.remove('hero-select-current');

        // Go back/forward 1 slide
        curSlide = previous.contains(e.target) ? mod(curSlide - 1, maxSlide) : mod(curSlide + 1, maxSlide);

        // Shift slide
        slides.forEach(slide => slide.classList.add('shift'));
        
        // Rearrange slide order
        previous.contains(e.target) ? slides.unshift(slides.pop()) : slides.push(slides.shift());
        slideContainer.innerHTML = slides.map(x => x.outerHTML).join('');
        
        // Shift slide back
        slides = Array.from(slideContainer.children);
        slides.forEach(slide => slide.classList.add('shift-transition'));
        setTimeout(() => slides.forEach(slide => slide.classList.remove('shift')), 1);
        setTimeout(() => slides.forEach(slide => slide.classList.remove('shift-transition')), 60);

        // Set slide dot
        document.getElementById(`hero-dot-${curSlide}`).classList.add('hero-select-current');
    }
});