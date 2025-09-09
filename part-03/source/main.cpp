#include <cstdlib>

#ifdef __EMSCRIPTEN__
#include <dlfcn.h>
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

// typedef void (*FindPrimes)(int, int);
extern void FindPrimes(int start, int end);

// void CalculatePrimes(const char* file_name) {
//   void* handle = dlopen(file_name, RTLD_NOW);
//   if (handle == NULL) {
//     return;
//   }

//   FindPrimes find_primes = (FindPrimes)dlsym(handle, "FindPrimes");
//   if (find_primes == NULL) {
//     return;
//   }

//   find_primes(3, 100000);

//   dlclose(handle);
// }

int main() {
  //   emscripten_async_wget("calculate_primes.wasm", "calculate_primes.wasm",
  //                         CalculatePrimes, NULL);

  FindPrimes(3, 99);
  return 0;
}

#ifdef __cplusplus
}
#endif