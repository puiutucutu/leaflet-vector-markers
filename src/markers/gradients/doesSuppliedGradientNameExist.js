/**
 * @param {String} name
 * @param {String[]} presets
 * @return {Boolean}
 */
function doesSuppliedGradientNameExist(name, presets) {
  return !!name && presets.includes(name);
}

export { doesSuppliedGradientNameExist };
