import { describe, Try } from "riteway";
import { JSDOM } from "jsdom";
import { createSvgPathElement } from "../../src/svg";

const jsdomInstance = new JSDOM("", { pretendToBeVisual: true });
global.window = jsdomInstance.window;
global.document = jsdomInstance.window.document;

describe("createSvgPathElement()", async assert => {
  assert({
    given: "no arguments",
    should: "throw",
    actual: Try(createSvgPathElement),
    expected: new TypeError()
  });

  assert({
    given: "path arg empty",
    should: "throw",
    actual: Try(createSvgPathElement, ""),
    expected: new TypeError()
  });

  assert({
    given: "path arg not a string",
    should: "throw",
    actual: Try(createSvgPathElement, 123),
    expected: new TypeError()
  });

  assert({
    given: "a path",
    should: "return an svg path",
    actual: createSvgPathElement("M15").outerHTML,
    expected: `<path d="M15"></path>`
  });

  assert({
    given: "a path and attributes",
    should: "return an svg path with attributes added",
    actual: createSvgPathElement("M15", { "fill-rule": "evenodd" }).outerHTML,
    expected: `<path d="M15" fill-rule="evenodd"></path>`
  });
});