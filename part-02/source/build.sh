# emcc validate.cpp -o validate.js   -s EXPORTED_RUNTIME_METHODS='["ccall", "UTF8ToString", "HEAP32"]' -s EXPORTED_FUNCTIONS='["_malloc", "_free"]' -s EXPORT_ALL=1
# emcc validate.cpp -O1 --no-entry -o validate.wasm
# emcc validate.cpp --js-library mergeinto.js -s EXPORTED_RUNTIME_METHODS='["ccall", "UTF8ToString", "HEAP32"]' -s EXPORTED_FUNCTIONS='["_malloc", "_free"]' -s EXPORT_ALL=1 -o validate.js
# emcc validate.cpp -O1 --no-entry -s ERROR_ON_UNDEFINED_SYMBOLS=0 -o validate.wasm
emcc validate.cpp -s RESERVED_FUNCTION_POINTERS=4 -s EXPORTED_RUNTIME_METHODS='["ccall", "UTF8ToString", "HEAP32", "addFunction", "removeFunction"]' -o validate.js