/*
 * Utility functions for all sort of Object, Array and string operations
 * Initial author: Jonas Ahlf
 * Created: Fri Feb  1 11:15:17 CET 2019
 */

/**
 * Creates a clone from an Object
 * @param obj {Object}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function clone(obj) {
    let copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    return null;
}

/**
 * String format with pattern 'Hello {0}', ['World']
 * @param str {string}
 * @param values {Array}
 * @return {string} formatted string
 */
function strFormat(str, values) {
    let formatted = str;
    for (let i = 0; i < values.length; i++) {
        let currValue = values[i];
        if (currValue instanceof Object) {
            currValue = JSON.stringify(currValue);
        }
        formatted = formatted.replace('{' + i + '}', currValue);
    }
    return formatted;
}

/**
 * Formats string where values is an object.
 * The keys from the objects are replaced in the string by the values from object
 * pattern 'Hello {World}', {World: 'Germany'}
 * @param str {string}
 * @param values {Object}
 * @return {string} formatted string
 */
function strKeyFormat(str, values) {
    let formatted = str;
    const keys = Object.keys(values);
    for (let i = 0; i < keys.length; i++) {
        let currentValue = values[keys[i]];
        if (currentValue instanceof Object) {
            currentValue = JSON.stringify(currentValue);
        }
        const searchPattern = '{' + keys[i] + '}';
        formatted = formatted.replace(searchPattern, currentValue);
    }
    return formatted;
}


/**
 * Return false if data and filter are equal
 * @param data {array} 
 * @param filter {array}
 * @returns boolean {boolean}
 */
function isequal(data, filter){
    if()
    for (let index = 0; index < data.length; index++) {
        const dataelement = data[index];
        for (let idex = 0; idex < filter.length; idex++) {
            const filterelement = filter[idex];
            if(dataelement == filterelement){
                console.log("isNotCorrect");
                console.log("data element" + dataelement);
                console.log("filter element" + filterelement);
                return false;
            }
        }
    }
    return true;
}

module.exports = {
  frm: strFormat,
  frmObj: strKeyFormat,
  Clone: clone,
  isEqual: isequal
};