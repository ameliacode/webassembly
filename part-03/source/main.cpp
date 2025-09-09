#include <cstdlib>

#ifdef __EMSCRIPTEN__
#include <dlfcn.h>
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

extern void FindPrimes(int start, int end);

#ifdef __cplusplus
}
#endif

int main() {
  FindPrimes(3, 99);
  return 0;
}
