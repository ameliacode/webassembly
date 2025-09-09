# emcc calculate_primes.cpp -s SIDE_MODULE=2 -O1 -o calculate_primes.wasm
emcc calculate_primes.cpp -O3 -s SIDE_MODULE=1 -o calculate_primes.wasm
