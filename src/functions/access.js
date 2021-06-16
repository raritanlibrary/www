export const preload = () => {
    const access = document.getElementById("access");
    const root = document.documentElement;
    if (localStorage.getItem("color-mode") === "dark") {
        root.setAttribute("color-mode", "dark");
    }
}

export const hicontrast = () => {
    const access = document.getElementById("access");
    const root = document.documentElement;
    const all = document.querySelectorAll("* :not(b):not(i):not(sup):not(svg):not(path):not(.event-zoom)");
    if (localStorage.getItem("color-mode") === "dark") {
        access.classList.add("darkmodeon");
    }
    window.addEventListener('click', function(e) {
        if (access.contains(e.target) && !access.classList.contains("darkmodeon")) {
            access.classList.add("darkmodeon");
            all.forEach(element => element.style.transition = "all 0.2s ease-in-out");
            root.setAttribute("color-mode", "dark");
            localStorage.setItem("color-mode", "dark");
            setTimeout(() => all.forEach(element => element.style.transition = ""), 500);
        } else if (access.contains(e.target) && access.classList.contains("darkmodeon")) {
            access.classList.remove("darkmodeon");
            all.forEach(element => element.style.transition = "all 0.2s ease-in-out");
            root.setAttribute("color-mode", "lite");
            localStorage.setItem("color-mode", "lite");
            setTimeout(() => all.forEach(element => element.style.transition = ""), 500);
        }
    });
}