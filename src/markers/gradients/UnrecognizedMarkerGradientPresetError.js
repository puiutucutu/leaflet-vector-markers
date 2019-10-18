class UnrecognizedMarkerGradientPresetError {
  constructor(message) {
    this.name = "UnrecognizedMarkerGradientPresetError";
    this.message = message;
  }
}

UnrecognizedMarkerGradientPresetError.prototype = Object.create(
  Error.prototype
);

export { UnrecognizedMarkerGradientPresetError };
