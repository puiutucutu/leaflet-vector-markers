class InvalidViewBoxTypeError {
  /**
   * @param {String} message
   * @param {*} [payload]
   */
  constructor(message, payload) {
    this.name = "InvalidViewBoxTypeError";
    this.message = message;
    this.payload = payload;
  }
}

export { InvalidViewBoxTypeError };
