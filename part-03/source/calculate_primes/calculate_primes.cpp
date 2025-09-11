#include <emscripten.h>
#include <pthread.h>

#include <chrono>
#include <cstdio>
#include <cstdlib>
#include <vector>

#ifdef __cplusplus
extern "C" {
#endif

struct thread_args {
  int start;
  int end;
  std::vector<int>* primes_found;
}

void * thread_func(void* arg){
  struct thread_args* args = (struct thread_args*)arg;
  FindPrimes(args->start, args->end, *(args->primes_found));
  return arg;
}

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
void FindPrimes(int start, int end, std::vector<int>& primes_found) {
  if (start % 2 == 0) {
    start++;
  }
  for (int i = start; i <= end; i += 2) {
    if (IsPrime(i)) {
      primes_found.push_back(i);
    }
  }
}

int main() {
  int start = 3, end = 1000000;
  printf("Prime numbers between %d and %d...\n", start, end);

  std::chrono::high_resolution_clock::time_point duration_start =
      std::chrono::high_resolution_clock::now();

  pthread_t thread_ids[4];
  struct thread_args args[5];

  int args_index = 1;
  int arg_start = 200000;

  for (int i = 0; i < 4; i++) {
    args[args_index].start = arg_start;
    args[args_index].end = arg_start + 199999;

    if (pthread_create(&thread_ids[i], NULL, thread_func,
                       (void*)&args[args_index])) {
      perror("Thread create failed");
      return 1;
    }

    args_index++;
    args_start += 200000;
  }

  FindPrimes(3, 199999, args[0].primes_found);

  for (int j = 0; j < 4; j++) {
    pthread_join(thread_ids[j], NULL);
  }

  std::chrono::high_resolution_clock::time_point duration_end =
      std::chrono::high_resolution_clock::now();

  std::chrono::duration<double> duration = duration_end - duration_start;

  printf("FindPrimes took %f seconds to execute\n", duration.count());

  printf("The values found:\n");
  for (int k = 0; k < 5; k++) {
    for (int n : args[k].primes_found) {
      printf("%d, ", n);
    }
  }
  printf("\n");
  return 0;
}

#ifdef __cplusplus
}
#endif
