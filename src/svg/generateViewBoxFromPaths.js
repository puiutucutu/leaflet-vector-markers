import { createSvgFromPaths } from "./createSvgFromPaths";
import { isArray } from "../utils/utils";
import { PathEntityTypeError } from "./errors/PathEntityTypeError";

/**
 * @param {PathEntity[]} paths
 * @return {Array} 4-tuple of integers
 * @throws {TypeError} When `paths` is not an array or is empty.
 */
function generateViewBoxFromPaths(paths) {
  if (!isArray(paths) || paths.length === 0) {
    throw PathEntityTypeError.invalidPaths();
  }

  // when a value for the svg `viewBox` attribute is not provided, we
  // can obtain the `viewBox` by creating a temporary `<svg>` and
  // reading its width and height from the generated bounding box,
  // then removing the temporary `<svg>` from the page
  const tempSvg = createSvgFromPaths(paths);
  document.body.appendChild(tempSvg);

  // using `getBBox()` since it is defined in the SVG specification,
  // whereas the other options of `getBoundingClientRect()` and
  // `getClientRects()` are defined in the CSSOM specification
  const bbox = tempSvg.getBBox();
  document.body.removeChild(tempSvg);

  return [bbox.x, bbox.y, bbox.width, bbox.height];
}

export { generateViewBoxFromPaths };
