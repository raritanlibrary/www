export const checkClass = (c) => document.getElementsByClassName(c).length > 0;
export const findClass = (c, n=0) => document.getElementsByClassName(c)[n];
export const setClass = (c, str, n=0) => document.getElementsByClassName(c)[n].innerHTML = str;

export const eventid = (str, date) => {
    let tmp = ``;
    let output = ``;
    str = str.replace(/\W+/g, '').toLowerCase();
    str = str.substring(4, 10);
    str.split('').forEach(char => {
        tmp += String(char.charCodeAt() - 97).padStart(2, '0');
    });
    tmp.match(/.{1,4}/g).forEach(word => {
        let w = Number(word).toString(36);
        if (w[0] === '1') {
            w = w.substring(1);
        }
        output += w;
    });
    const y = (date.getFullYear() - 2020).toString(36) ;
    const m = (date.getMonth()).toString(36);
    const d = (date.getDate()).toString(36);
    const h = (date.getHours()).toString(36);
    return `${y}${output.substring(0,2)}${m}${output.substring(2,4)}${d}${output.substring(4,6)}${h}`;
}