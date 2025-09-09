const initialData = {
  name: "Woman's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

let moduleExports = null;
let moduleMemory = null;

function initializePage() {
  document.getElementById("name").value = initialData.name;

  const category = document.getElementById("category");
  const count = category.length;
  for (let index = 0; index < count; index++) {
    if (category[index].value === initialData.categoryId) {
      category.selectedIndex = index;
      break;
    }
  }
}

function getSelectedCategoryId() {
  const category = document.getElementById("category");
  const index = category.selectedIndex;
  if (index !== -1) {
    return category[index].value;
  }
  return "0";
}

function setErrorMessage(error) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.innerText = error;
  errorMessage.style.display = error === "" ? "none" : "block";
}

function onClickSave() {
  setErrorMessage("");

  const name = document.getElementById("name").value;
  const categoryId = getSelectedCategoryId();

  Promise.all([validateName(name), validateCategory(categoryId)])
    .then(() => {})
    .catch((error) => {
      setErrorMessage(error);
    });
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
  bytes.set(new TextEncoder().encode(value + "\0"), memoryOffset);
}

function createPointers(resolve, reject, returnPointers) {
  const onSuccess = Module.addFunction(function () {
    freePointers(onSuccess, onError);
    resolve();
  }, "v");

  const onError = Module.addFunction(function (errorMessage) {
    freePointers(onSuccess, onError);
    reject(Module.UTF8ToString(errorMessage));
  }, "vi");

  returnPointers.onSuccess = onSuccess;
  returnPointers.onError = onError;
}

function freePointers(onSuccess, onError) {
  Module.removeFunction(onSuccess);
  Module.removeFunction(onError);
}

function validateName(name) {
  return new Promise(function (resolve, reject) {
    const pointers = { onSuccess: null, onError: null };
    createPointers(resolve, reject, pointers);

    Module.ccall(
      "ValidateName",
      null,
      ["string", "number", "number", "number"],
      [name, MAXIMUM_NAME_LENGTH, pointers.onSuccess, pointers.onError]
    );
  });
}

function validateCategory(categoryId) {
  return new Promise(function (resolve, reject) {
    const pointers = { onSuccess: null, onError: null };
    createPointers(resolve, reject, pointers);

    const arrayLength = VALID_CATEGORY_IDS.length;
    const bytesPerElement = Module.HEAP32.BYTES_PER_ELEMENT;
    const arrayPointer = Module._malloc(arrayLength * bytesPerElement);
    Module.HEAP32.set(VALID_CATEGORY_IDS, arrayPointer / bytesPerElement);

    Module.ccall(
      "ValidateCategory",
      null,
      ["string", "number", "number", "number", "number"],
      [
        categoryId,
        arrayPointer,
        arrayLength,
        pointers.onSuccess,
        pointers.onError,
      ]
    );

    Module._free(arrayPointer);
  });
}
