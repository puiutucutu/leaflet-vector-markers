import { markerGradientPresetNames } from "./markerGradientPresetNames";

/**
 * @return {String[]}
 */
const getAvailableGradientPresetNames = () =>
  Object.keys(markerGradientPresetNames);

export { getAvailableGradientPresetNames };
