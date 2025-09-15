#include <emscripten.h>

#include <cstdlib>
#include <ctime>

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE
void SeedRandomNumberGenerator() { srand(time(NULL)); }

EMSCRIPTEN_KEEPALIVE
int GetRandomNumber(int range) { return rand() % range; }

#ifdef __cplusplus
}
#endif