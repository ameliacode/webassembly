function logPrime(prime) {
  console.log(prime.toString());
}

WebAssembly.instantiateStreaming(fetch("is_prime.wasm"), {})
  .then((isPrimeModule) => {
    const findPrimesImportObject = {
      env: {
        IsPrime: isPrimeModule.instance.exports._IsPrime,
        LogPrime: logPrime,
      },
    };

    return WebAssembly.instantiateStreaming(
      fetch("find_primes.wasm"),
      findPrimesImportObject
    );
  })
  .then((findPrimesModule) => {
    findPrimesModule.instance.exports._FindPrimes(3, 100);
  })
  .catch(console.error);
