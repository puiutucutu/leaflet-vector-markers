/**
 * @typedef {Object} IconSvg Object representing a custom icon via SVG
 * properties.
 * @property {String} [width]
 * @property {String} [height]
 * @property {String} [viewBox]
 * @property {PathEntity[]} paths
 */

/**
 * @typedef {Object} DefaultOptions
 * @property {Number[]} iconSize - A 2-tuple of integers
 * @property {Number[]} iconAnchor - A 2-tuple of integers
 * @property {Number[]} popupAnchor - A 2-tuple of integers
 * @property {IconSvg} iconSvg
 */

/**
 * @typedef {Object} Dictionary
 * @property {String} key
 * @property {String} value
 */

/**
 * @typedef {Object} PathEntity
 * @property {String} d - An SVG path string like `M16,1 C7.7146...` that
 * goes on the `d` attribute of an SVG path element.
 * @property {Dictionary} [attributes] - An optional dict representing
 * attributes for this path.
 */
