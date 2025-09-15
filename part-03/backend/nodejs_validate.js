const util = require("util");

const clientData = {
  name: "Women's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

let validateOnSuccessNameIndex = -1;
let validateOnSuccessCategoryIndex = -1;
let validateOnErrorNameIndex = -1;
let validateOnErrorCategoryIndex = -1;
let validateNameCallbacks = { resolve: null, reject: null };
let validateCategoryCallbacks = { resolve: null, reject: null };

let moduleMemory = null;
let moduleExports = null;
let moduleTable = null;

const fs = require("fs");
fs.readFile("validate.wasm", function (error, bytes) {
  if (error) {
    throw error;
  }

  instantiateWebAssembly(bytes);
});

function instantiateWebAssembly(bytes) {
  const importObject = {
    wasi_snapshot_preview1: {
      proc_exit: (value) => {},
    },
  };

  WebAssembly.instantiate(bytes, importObject).then((result) => {
    moduleExports = result.instance.exports;
    moduleMemory = moduleExports.memory;
    moduleTable = moduleExports.__indirect_function_table;

    validateOnSuccessNameIndex = addToTable(() => {
      onSuccessCallback(validateNameCallbacks);
    }, "v");

    validateOnSuccessCategoryIndex = addToTable(() => {
      onSuccessCallback(validateCategoryCallbacks);
    }, "v");

    validateOnErrorNameIndex = addToTable((errorMessagePointer) => {
      onErrorCallback(validateNameCallbacks, errorMessagePointer);
    }, "vi");

    validateOnErrorCategoryIndex = addToTable((errorMessagePointer) => {
      onErrorCallback(validateCategoryCallbacks, errorMessagePointer);
    }, "vi");

    validateData();
  });
}

function addToTable(jsFunction, signature) {
  const index = moduleTable.length;
  moduleTable.grow(1);
  moduleTable.set(index, convertJsFunctionToWasm(jsFunction, signature));
  return index;
}

function convertJsFunctionToWasm(func, sig) {
  var typeSection = [0x01, 0x00, 0x01, 0x60];
  var sigRet = sig.slice(0, 1);
  var sigParam = sig.slice(1);
  var typeCodes = {
    i: 0x7f,
    j: 0x7e,
    f: 0x7d,
    d: 0x7c,
  };

  typeSection.push(sigParam.length);
  for (var i = 0; i < sigParam.length; ++i) {
    typeSection.push(typeCodes[sigParam[i]]);
  }

  if (sigRet == "v") {
    typeSection.push(0x00);
  } else {
    typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
  }

  typeSection[1] = typeSection.length - 2;

  var bytes = new Uint8Array(
    [0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00].concat(
      typeSection,
      [
        0x02, 0x07, 0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00, 0x07, 0x05, 0x01,
        0x01, 0x66, 0x00, 0x00,
      ]
    )
  );

  var module = new WebAssembly.Module(bytes);
  var instance = new WebAssembly.Instance(module, {
    e: {
      f: func,
    },
  });
  var wrappedFunc = instance.exports.f;
  return wrappedFunc;
}

function onSuccessCallback(validateCallbacks) {
  validateCallbacks.resolve();
  validateCallbacks.resolve = null;
  validateCallbacks.reject = null;
}

function onErrorCallback(validateCallbacks, errorMessagePointer) {
  const errorMessage = getStringFromMemory(errorMessagePointer);
  validateCallbacks.reject(errorMessage);
  validateCallbacks.resolve = null;
  validateCallbacks.reject = null;
}

function setErrorMessage(error) {
  console.log(error);
}

function validateData() {
  Promise.all([
    validateName(clientData.name),
    validateCategory(clientData.categoryId),
  ])
    .then(() => {})
    .catch((error) => {
      setErrorMessage(error);
    });
}

function createPointers(isForName, resolve, reject, returnPointers) {
  if (isForName) {
    validateNameCallbacks.resolve = resolve;
    validateNameCallbacks.reject = reject;
    returnPointers.onSuccess = validateOnSuccessNameIndex;
    returnPointers.onError = validateOnErrorNameIndex;
  } else {
    validateCategoryCallbacks.resolve = resolve;
    validateCategoryCallbacks.reject = reject;
    returnPointers.onSuccess = validateOnSuccessCategoryIndex;
    returnPointers.onError = validateOnErrorCategoryIndex;
  }
}

function getStringFromMemory(memoryOffset) {
  let returnValue = "";

  const size = 256;
  const bytes = new Uint8Array(moduleMemory.buffer, memoryOffset, size);

  let character = "";
  for (let i = 0; i < size; i++) {
    character = String.fromCharCode(bytes[i]);
    if (character === "\0") {
      break;
    }

    returnValue += character;
  }

  return returnValue;
}

function copyStringToMemory(value, memoryOffset) {
  const bytes = new Uint8Array(moduleMemory.buffer);
  bytes.set(new util.TextEncoder().encode(value + "\0"), memoryOffset);
}

function validateName(name) {
  return new Promise(function (resolve, reject) {
    const pointers = { onSuccess: null, onError: null };
    createPointers(true, resolve, reject, pointers);

    const namePointer = moduleExports.create_buffer(name.length + 1);
    copyStringToMemory(name, namePointer);

    moduleExports.ValidateName(
      namePointer,
      MAXIMUM_NAME_LENGTH,
      pointers.onSuccess,
      pointers.onError
    );

    moduleExports.free_buffer(namePointer);
  });
}

function validateCategory(categoryId) {
  return new Promise(function (resolve, reject) {
    const pointers = { onSuccess: null, onError: null };
    createPointers(false, resolve, reject, pointers);

    const categoryIdPointer = moduleExports.create_buffer(
      categoryId.length + 1
    );
    copyStringToMemory(categoryId, categoryIdPointer);

    const arrayLength = VALID_CATEGORY_IDS.length;
    const bytesPerElement = Int32Array.BYTES_PER_ELEMENT;
    const arrayPointer = moduleExports.create_buffer(
      arrayLength * bytesPerElement
    );

    const bytesForArray = new Int32Array(moduleMemory.buffer);
    bytesForArray.set(VALID_CATEGORY_IDS, arrayPointer / bytesPerElement);

    moduleExports.ValidateCategory(
      categoryIdPointer,
      arrayPointer,
      arrayLength,
      pointers.onSuccess,
      pointers.onError
    );

    moduleExports.free_buffer(arrayPointer);
    moduleExports.free_buffer(categoryIdPointer);
  });
}
