# emcc calculate_primes.cpp -s SIDE_MODULE=2 -O1 -o calculate_primes.wasm
# emcc calculate_primes.cpp -O3 -s SIDE_MODULE=1 -o calculate_primes.wasm
# emcc calculate_primes.cpp -O1 -std=c++11 -s MODULARIZE=1 -o calculate_primes.js
 emcc calculate_primes.cpp -O1 -std=c++11 -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=4 -o pthreads.html