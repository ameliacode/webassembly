#include <emscripten.h>

#include <cstdio>
#include <cstdlib>

#ifdef __cpluscplus
extern 'C' {
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

    for (int i = start; i <= end; i += 2) {
      if (IsPrime(i)) {
        printf("%d ", i);
      }
    }
    printf("\n");
  }

  int main() {
    FindPrimes(3, 10000);
    return 0;
  }

#ifdef __cpluscplus
}
#endif