import { describe } from "riteway";
import { JSDOM } from "jsdom";
import { createSvgElement } from "../../src/svg";

const jsdomInstance = new JSDOM("", { pretendToBeVisual: true });
global.window = jsdomInstance.window;
global.document = jsdomInstance.window.document;

// prettier-ignore
describe("createSvgElement()", async assert => {
  assert({
    given: "no arguments",
    should: "return a svg element that matches the snapshot",
    actual: createSvgElement().outerHTML,
    expected: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"></svg>`
  });
});
