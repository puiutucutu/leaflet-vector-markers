/**
 * @param {*} n
 * @return {string}
 */
export function getObjectType(n) {
  return Object.prototype.toString.call(n);
}

/**
 * @param {Object} obj
 * @param {String} propName
 * @return {Boolean}
 */
export function hasOwnProperty(obj, propName) {
  return Object.prototype.hasOwnProperty.call(obj, propName);
}

/**
 * @param {*} n
 * @return {Boolean}
 */
export function isString(n) {
  return getObjectType(n) === "[object String]";
}

/**
 * @param {*[]} arr
 * @return {Boolean}
 */
export function isArray(arr) {
  return getObjectType(arr) === "[object Array]";
}

/**
 * @param {*} n
 * @return {Boolean}
 */
export function isNumeric(n) {
  return getObjectType(n) === "[object Number]";
}

/**
 * @param {String} message
 * @return {undefined}
 */
export function logWarning(message) {
  console.log(
    `%c Warning: ${message}`,
    "background: yellow; color: black; font-weight: bold; font-size: 12px;"
  );
}
