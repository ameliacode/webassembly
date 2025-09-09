#include <emscripten.h>

#include <cstdio>
#include <cstdlib>

#ifdef __cplusplus
extern "C" {
#endif

int IsPrime(int value) {
  if (value == 2) {
    return 1;
  }
  if (value <= 1 || value % 2 == 0) {
    return 0;
  }

  for (int i = 3; (i * i) <= value; i += 2) {
    if (value % i == 0) {
      return 0;
    }
  }

  return 1;
}

EMSCRIPTEN_KEEPALIVE
void FindPrimes(int start, int end) {
  printf("Prime numbers between %d and %d:\n", start, end);

  if (start % 2 == 0) start++;  // ensure odd start
  for (int i = start; i <= end; i += 2) {
    if (IsPrime(i)) {
      printf("%d ", i);
    }
  }
  printf("\n");
}

#ifdef __cplusplus
}
#endif

#ifdef TEST_MAIN
int main() {
  FindPrimes(3, 100);
  return 0;
}
#endif
