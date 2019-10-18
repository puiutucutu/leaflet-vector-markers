import { describe, Try } from "riteway";
import { errors, createSvgFromPaths } from "../../src/svg";

describe("createSvgFromPaths()", async assert => {
  assert({
    given: "no arguments",
    should: "throw",
    actual: Try(createSvgFromPaths),
    expected: errors.PathEntityTypeError.invalidPaths()
  });

  assert({
    given: "paths containing a PathEntity without `d` property",
    should: "throw invalid path definition error",
    actual: Try(createSvgFromPaths, [
      { d: "M7", attributes: { "fill-rule": "evenodd" } },
      { d: "M8", attributes: { "fill-rule": "evenodd" } },
      { d: "", attributes: {} }
    ]),
    expected: errors.PathEntityTypeError.invalidPathDefinition(2)
  });

  const paths = [
    {
      d: "M6",
      attributes: {
        "fill-rule": 123456
      }
    }
  ];

  assert({
    given: "paths containing a PathEntity with invalid `attributes` type",
    should: "throw",
    actual: Try(createSvgFromPaths, paths),
    expected: errors.PathEntityTypeError.invalidPathAttributes(
      "fill-rule",
      123456,
      paths[0]
    )
  });

  assert({
    given: "all the arguments",
    should: "return an svg with paths",
    actual: createSvgFromPaths(
      [
        {
          d: "M7",
          attributes: { "fill-rule": "evenodd", "clip-rule": "evenodd" }
        }
      ],
      [0, 0, 128, 128],
      128,
      128
    ).outerHTML,
    expected: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" fill="currentColor" viewBox="0 0 128 128" width="128" height="128"><path d="M7" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`
  });
});
