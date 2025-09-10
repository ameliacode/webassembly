emcc validate_product.cpp -O1 -s SIDE_MODULE=2 \
  -s EXPORTED_FUNCTIONS="['_ValidateName', '_ValidateCategory']" \
  -o validate_product.wasm
emcc validate_order.cpp -O1 -s SIDE_MODULE=2 \
  -s EXPORTED_FUNCTIONS="['_ValidateProduct', '_ValidateQuantity']" \
  -o validate_order.wasm
emcc validate_core.cpp --js-library mergeinto.js -s MAIN_MODULE=2 -s MODULARIZE=1 -s EXPORTED_FUNCTIONS=['_strlen','_atoi','_malloc','_free'] -s EXPORTED_RUNTIME_METHODS=['ccall','stringToUTF8','UTF8ToString','HEAP32'] -o validate_core.js