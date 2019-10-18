import { markerGradientPresetNames } from "./markerGradientPresetNames";
import { UnrecognizedMarkerGradientPresetError } from "./UnrecognizedMarkerGradientPresetError";

/**
 * @param {Array} rgbArr
 * @return {String}
 */
const arrayToRgbString = rgbArr => `rgb(${rgbArr.join(",")})`;

/**
 * @param {String} name
 * @return {MarkerGradient}
 * @throws {UnrecognizedMarkerGradientPresetError}
 */
const getMarkerGradient = name => {
  if (!markerGradientPresetNames.hasOwnProperty(name)) {
    throw new UnrecognizedMarkerGradientPresetError(
      `Requested unrecognized marker gradient preset with name of ${name}`
    );
  }

  const gradient = markerGradientPresetNames[name];
  return {
    top: arrayToRgbString(gradient.top),
    bottom: arrayToRgbString(gradient.bottom)
  };
};

export { getMarkerGradient };
