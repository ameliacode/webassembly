const IS_NODE = typeof process === "object" && typeof require === "function";

if (IS_NODE) {
  let chai = null;
  let Module = null;
} else {
  var Module = {
    onRuntimeInitialized: () => {
      mocha.run();
    },
  };
}

describe("Testing the validate.wasm module from chapter 4", () => {
  before(() => {
    if (IS_NODE) {
      chai = require("chai");
      return new Promise((resolve) => {
        Module = require("./validate.js");
        Module["onRuntimeInitialized"] = () => {
          resolve();
        };
      });
    }
  });

  it("Pass an empty string", () => {
    const errorMessagePointer = Module._malloc(256);
    const name = "";
    const expectedMessage = "A Product Name must be provided.";

    const isValid = Module.ccall(
      "ValidateName",
      "number",
      ["string", "number", "number"],
      [name, 50, errorMessagePointer]
    );

    let errorMessage = "";
    if (isValid === 0) {
      errorMessage = Module.UTF8ToString(errorMessagePointer);
    }

    Module._free(errorMessagePointer);

    chai.expect(errorMessage).to.equal(expectedMessage);
  });

  it("Pass a string that's too long", () => {
    const errorMessagePointer = Module._malloc(256);
    const name = "Longer than 5 characters";
    const expectedMessage = "";

    const isValid = Module.ccall(
      "ValidateName",
      "number",
      ["string", "number", "number"],
      [name, 50, errorMessagePointer]
    );

    let errorMessage = "";
    if (isValid === 0) {
      errorMessage = Module.UTF8ToString(errorMessagePointer);
    }

    Module._free(errorMessagePointer);

    chai.expect(errorMessage).to.equal(expectedMessage);
  });
});
