import { SVG_NAMESPACE, XLINK_NAMESPACE } from "./constants";

/**
 * @return {SVGElement} - A `<svg></svg>` element.
 */
function createSvgElement() {
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.setAttribute("xmlns", SVG_NAMESPACE);
  svg.setAttribute("xmlns:xlink", XLINK_NAMESPACE);
  svg.setAttributeNS(SVG_NAMESPACE, "version", "1.1");

  return svg;
}

export { createSvgElement };
