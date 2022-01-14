// Class checking functions
export const checkClass = c => document.getElementsByClassName(c).length > 0;
export const findClass = (c, n=0) => document.getElementsByClassName(c)[n];
export const setClass = (c, str, n=0) => document.getElementsByClassName(c)[n].innerHTML = str;

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

// Returns the inverse of a 4-bit number
const bitnot = n => {
    let output = [];
    n = n.toString(2).padStart(3, '0').split('');
    n.forEach(nn => output.push(nn === '1' ? '0' : '1'));
    return output.join('');
}

// Generate a unique event identifier based on a string and date
export const eventid = (str, date) => {
    // Reduce input string
    str = str.replace(/\W+|\d/g, '').toLowerCase();
    str = str.substring(0, 19).padEnd(19, 'a');

    // Convert string to binary
    let strbin = ``;
    str.split('').forEach(char => strbin += (char.charCodeAt() - 97).toString(2).padStart(5, '0'));
    strbin += '0';

    // Convert date to binary
    const datestr = String(date.getTime()).substring(0, 8);
    let datebin = ``;
    datestr.split('').forEach(char => datebin += Number(char).toString(2).padStart(4, '0'));

    // Generate final binary number
    let bin = ``;
    for (let i = 0; i < strbin.length; i += 3) {
        let n = parseInt(strbin.substring(i, i + 3), 2);
        bin += datebin[i/3] === '1' ? bitnot(n) : n.toString(2).padStart(3, '0');
    }

    // Convert number to Base64 and return it
    let output = ``;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
    for (let i = 0; i < bin.length; i += 16) {
        let n = parseInt(bin.substring(i, i + 6), 2);
        output += chars[n];
    }
    return output;
}