import { SVG_NAMESPACE } from "./constants";
import { isString } from "../utils/utils";

/**
 * @param {String} d - {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d}
 * @param {Dictionary} [attributes] - Other valid svg path attributes to add
 * to the path
 * @return {SVGPathElement}
 * @throws {TypeError} When `d` arg is not provided, is empty, or is not a string.
 */
function createSvgPathElement(d, attributes = {}) {
  const pathTypeGuardError = new TypeError(
    "Path property must be a non-empty string"
  );

  if (!d) throw pathTypeGuardError;
  if (!isString(d)) throw pathTypeGuardError;

  const path = document.createElementNS(SVG_NAMESPACE, "path");
  path.setAttribute("d", d);

  if (Object.keys(attributes).length !== 0) {
    for (let [attrName, attrVal] of Object.entries(attributes)) {
      path.setAttributeNS(SVG_NAMESPACE, attrName, attrVal);
    }
  }

  return path;
}

export { createSvgPathElement };
