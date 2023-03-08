// Generate a request and response using a url and handling function
export const req = async (url, resFunc) => {
    fetch(url)
    .then(response => response.json())
    .then(data => resFunc(data))
    .catch(err => console.log(err));
};

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
    let funcStr = func.toString();
    funcStr = funcStr.slice(funcStr.indexOf("{") + 1, funcStr.lastIndexOf("}"));
    const funcTouch = new Function(funcStr + "\n" + 'e.preventDefault()');
    window.addEventListener('touchstart', funcTouch);
    window.addEventListener('click', func);
}

// Category-to-style parsing function
export const stylizer = cat => {
    cat = cat.length === 1 ? cat[0].name : "";
    switch (cat) {
        case "Holiday":                 return "red";
        case "Computers & Technology":  return "red2";
        case "Movie":                   return "orange";
        case "Health & Fitness":        return "yellow";
        case "History":                 return "lime";
        case "Book Club":               return "green";
        case "ESL":                     return "green2";
        case "Arts & Culture":          return "cyan";
        case "Gaming":                  return "blue";
        case "Storytime":               return "purple";
        case "Craft Program":           return "pink";
        default:                        return "gray";
    }
}