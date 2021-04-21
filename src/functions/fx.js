export const checkClass = (c) => document.getElementsByClassName(c).length > 0;
export const findClass = (c, n=0) => document.getElementsByClassName(c)[n];
export const setClass = (c, str, n=0) => document.getElementsByClassName(c)[n].innerHTML = str;