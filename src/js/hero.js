import * as util from './util';

export const hero = () => {
    // Slide information
    const container     = document.getElementById('hero-content');
    let slides          = Array.from(container.children);
    const dots          = Array.from(document.getElementById('hero-select').children);
    const maxSlide      = slides.length - 1;
    const firstSlide    = slides[0];
    const lastSlide     = slides[maxSlide];
    const cloneFirst    = firstSlide.cloneNode(true);
    const cloneLast     = lastSlide.cloneNode(true);
    let curSlide        = 0;
    let curSlideMod     = 0;
    let allowShift      = true;
    let autoAdvance     = true;
    const prev          = document.getElementById("hero-prev");
    const next          = document.getElementById("hero-next");

    // Clone first/last slides
    container.appendChild(cloneFirst);
    container.insertBefore(cloneLast, firstSlide);
    slides = Array.from(container.children);
    slides.forEach(slide => slide.style.transform = `translateX(-100%)`);

    // Wait for transition
    const transitionEndSelector = () => {
        const e = document.createElement('fakeelement');
        const transitions = {
            'transition'        : 'transitionend',
            'OTransition'       : 'oTransitionEnd',
            'MozTransition'     : 'transitionend',
            'WebkitTransition'  : 'webkitTransitionEnd'
        }
        for (let t in transitions) {
            if (e.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }
    const transitionEnd = transitionEndSelector();

    // Shift logic
    const shift = n => {
        // Add transition
        slides.forEach(slide => slide.classList.add('shift'));

        // Unset slide dot
        document.getElementById(`hero-dot-${curSlide}`).classList.remove('hero-select-current');

        // Advance slide
        curSlide = curSlide + n;
        curSlideMod = util.mod(curSlide, maxSlide+1);
        slides.forEach(slide => slide.style.transform = `translateX(${-100 * (curSlide+1)}%)`);

        // Set slide dot
        document.getElementById(`hero-dot-${curSlideMod}`).classList.add('hero-select-current');

        // Check to allow shifting
        allowShift = curSlide === curSlideMod;
    }

    // Remove transition after finish, account for edge slides
    const checkIndex = () => {
        slides.forEach(slide => slide.classList.remove('shift'));
        if (curSlide === -1) {
            slides.forEach(slide => slide.style.transform = `translateX(${-100 * maxSlide - 100}%)`);
            curSlide = maxSlide;
        } else if (curSlide === maxSlide + 1) {
            slides.forEach(slide => slide.style.transform = `translateX(-100%)`);
            curSlide = 0;
        }
        allowShift = true;
    }

    // Navigation listeners
    util.addClickListener(e => {
        // Arrows
        if (prev.contains(e.target) && allowShift) {
            autoAdvance = false;
            shift(-1);
        } else if (next.contains(e.target) && allowShift) {
            autoAdvance = false;
            shift(1);
        }
        // Dots
        dots.forEach((dot, i) => {
            if (dot.contains(e.target) && allowShift) {
                autoAdvance = false;
                shift(i - curSlide);
            }
        })
    });

    // Transition listeners
    slides.forEach(slide => slide.addEventListener(transitionEnd, checkIndex));

    // Auto-advance until clicked
    setInterval(() => {if (autoAdvance) shift(1)}, 8500);
}