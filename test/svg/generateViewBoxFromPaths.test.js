import { describe, Try } from "riteway";
import { JSDOM } from "jsdom";
import { generateViewBoxFromPaths, errors } from "../../src/svg";

const jsdomInstance = new JSDOM("", {
  beforeParse(window) {
    // need to mock the `getBBox()` method since the `jsdom` library does
    // not provide DOM methods related to rendering
    // https://github.com/jsdom/jsdom#intervening-before-parsing
    window.SVGGraphicsElement.prototype.getBBox = function() {
      return {
        x: 0,
        y: 0,
        width: 128,
        height: 128
      };
    };
  },
  pretendToBeVisual: true
});
global.window = jsdomInstance.window;
global.document = jsdomInstance.window.document;

/**
 * @type {PathEntity[]}
 */
const pathEntities = [
  { d: "M1", attributes: { "fill-rule": "evenodd" } },
  { d: "M2", attributes: { "clip-rule": "evenodd" } }
];

describe("generateViewBoxFromPaths()", async assert => {
  assert({
    given: "no arguments",
    should: "throw a TypeError with expected message",
    actual: Try(generateViewBoxFromPaths, []).toString(),
    expected: errors.PathEntityTypeError.invalidPaths().toString()
  });

  assert({
    given: "an array of PathEntity types",
    should: "return a 4-tuple of integers",
    actual: generateViewBoxFromPaths(pathEntities),
    expected: [0, 0, 128, 128]
  });

  delete global.window.SVGGraphicsElement.prototype.getBBox;
});
