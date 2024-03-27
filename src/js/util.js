// Generate a request and response using a url and handling function
export const req = async (url, resFunc) => {
    fetch(url)
    .then(response => response.json())
    .then(data => resFunc(data))
    .catch(err => console.log(err));
};

// Corrected modulo function
export const mod = (n, m) => ((n % m) + m) % m;

// Returns extra data based on existance of external website string
export const extchk = str => str.match('^http') ? `rel="noopener"` : ``;

// Toggle a list of element-class pairs based on conditionals
export const toggleClasses = (addCondition, removeCondition, ...pairs) => {
    if (addCondition) {
        pairs.forEach(pair => pair[0].classList.add(pair[1]))
    } else if (removeCondition) {
        pairs.forEach(pair => pair[0].classList.remove(pair[1]))
    }
}

// Adds an event listener with full touch/click coverage
export const addClickListener = func => {
    if ('ontouchstart' in window) {
        window.addEventListener('touchstart', func);
    } else {
        window.addEventListener('click', func);
    }
}

// Category-to-style parsing function
export const stylizer = cat => {
    cat = cat.length === 1 ? cat[0].name : "";
    switch (cat) {
        case "Holiday":                 return "crimson";
        case "Computers & Technology":  return "red";
        case "Movie":                   return "orange";
        case "Health & Fitness":        return "yellow";
        case "History":                 return "lime";
        case "ESL":                     return "green";
        case "Book Club":               return "teal";
        case "Arts & Culture":          return "cyan";
        case "Gaming":                  return "blue";
        case "Storytime":               return "purple";
        case "Craft Program":           return "pink";
        default:                        return "gray";
    }
}