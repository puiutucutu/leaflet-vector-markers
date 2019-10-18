class InvalidViewBoxProvidedError {
  /**
   * @param {String} message
   * @param {*} [payload]
   */
  constructor(message, payload) {
    this.name = "InvalidViewBoxProvidedError";
    this.message = message;
    this.payload = payload;
  }

  static forIcon(viewBoxProvided) {
    return new InvalidViewBoxProvidedError(
      `Invalid \`viewBox\` value of \`${viewBoxProvided}\` provided for icon when expecting a 4-tuple in the form of an array like \`[0,0,128,128]\``
    );
  }

  static forPath(path) {
    return new InvalidViewBoxProvidedError(
      `Invalid \`path\` value of \`${path}\` provided when expecting a properly formed PathEntity type.`
    );
  }

  static forPathAttributes(attributeName, attributeValue, paths) {
    return new InvalidViewBoxProvidedError(
      `Invalid \`path\` attributes of \`${attributeName}\` with value of \`${attributeValue}\` provided when expecting a Dictionary type of <k: string, v: string>.`,
      paths
    );
  }
}

InvalidViewBoxProvidedError.prototype = Object.create(Error.prototype);

export { InvalidViewBoxProvidedError };
