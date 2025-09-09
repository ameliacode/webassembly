# emcc main.cpp -s MAIN_MODULE=1 --pre-js pre.js -s EXPORTED_FUNCTIONS="['_putchar', '_main', '_FindPrimes']" -o main.html
emcc main.cpp -O3 -s MAIN_MODULE=1 -s ERROR_ON_UNDEFINED_SYMBOLS=0 --pre-js pre.js -o main.html

