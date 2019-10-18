import { getObjectType, isArray, isNumeric } from "../../utils/utils";

/**
 * @param {*} [viewBox]
 * @return {undefined}
 * @throws {TypeError}
 */
function validateViewBox(viewBox) {
  if (!!viewBox) {
    if (!isArray(viewBox) || viewBox.length !== 4) {
      throw new TypeError("Invalid `viewBox` supplied");
    }

    // check that viewbox tuple is made of integers
    for (let el of viewBox) {
      if (!isNumeric(el)) {
        const elType = getObjectType(el);
        throw new TypeError(
          `Viewbox element \`${el}\` in \`${viewBox}\` must be a number, instead \`${elType}\` given`
        );
      }
    }
  }
}

export { validateViewBox };
