WebAssembly.compileStreaming(fetch("calculate_primes.wasm")).then((module) => {
  postMessage(module);
});
