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

// Generate a unique event identifier based on a string
export const eventid = (str) => {
    // Reduce input string
    str = str.replace(/\W+|\d/g, '').toLowerCase();
    str = str.substring(0, 24).padEnd(24, 'a');
    // Convert string to binary
    let bin = ``;
    str.split('').forEach(char => bin += (char.charCodeAt() - 97).toString(2).padStart(5, '0'));
    // Convert number to Base64 and return it
    let output = ``;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
    for (let i = 0; i < bin.length; i += 24) {
        let n = parseInt(bin.substring(i, i + 6), 2);
        output += chars[n];
    }
    return output;
}