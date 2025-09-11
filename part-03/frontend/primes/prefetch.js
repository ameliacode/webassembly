let compileModule = null;
let emscriptenModule = null;

const worker = new Worker("prefetch.worker.js");
worker.onmessage = (e) => {
  compileModule = e.data;
  Module({ instantiateWasm: onInstantiateWasm }).then((module) => {
    emscriptenModule = module;
  });
};

function onInstantiateWasm(importObject, successCallback) {
  WebAssembly.instantiate(compileModule, importObject).then((instance) =>
    successCallback(instance)
  );

  return {};
}
