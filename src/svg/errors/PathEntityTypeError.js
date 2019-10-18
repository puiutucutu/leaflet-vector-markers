/**
 * Errors based on when PathEntity or path related types are malformed.
 */
class PathEntityTypeError {
  /**
   * @param {String} message
   * @param {*} [payload]
   */
  constructor(message, payload) {
    this.name = "PathEntityTypeError";
    this.message = message;
    this.payload = payload;
  }

  /**
   * @return {PathEntityTypeError}
   */
  static invalidPaths() {
    return new PathEntityTypeError(
      `Paths must be a non-empty array of PathEntity types`
    );
  }

  /**
   * @param {Number} index
   * @return {PathEntityTypeError}
   */
  static invalidPathDefinition(index) {
    return new PathEntityTypeError(
      `Missing required attribute \`d\` in \`PathEntity\` type at index ${index} of paths array`
    );
  }

  /**
   * @param {String} attributeName
   * @param {String} attributeValue
   * @param {Object} path
   * @return {PathEntityTypeError}
   */
  static invalidPathAttributes(attributeName, attributeValue, path) {
    return new PathEntityTypeError(
      `Invalid \`path\` attributes of \`${attributeName}\` with value of \`${attributeValue}\` provided when expecting a Dictionary type of <k: string, v: string>.`,
      path
    );
  }
}

// PathEntityTypeError.prototype = Object.create(Error.prototype);
// PathEntityTypeError.prototype = Object.create(Error.prototype, {
//   constructor: { value: PathEntityTypeError }
// });

export { PathEntityTypeError };
