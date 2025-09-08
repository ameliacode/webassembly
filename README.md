# webassembly

```bash
source emsdk_env.sh

## BUILD FILE (options)
emcc [YOUR_FILENAME].cpp -o [.html, .js]
emcc [YOUR_FILENAME].cpp -s SIDE_MODULE=2 -O1 -s EXPORTED_FUNCTIONS=['_FUNCTION_NAME'] -o [YOUR_FILENAME].wasm
emcc validate.cpp -o validate.js   -s EXPORTED_RUNTIME_METHODS='["ccall", "UTF8ToString", "HEAP32"]' -s EXPORTED_FUNCTIONS='["_malloc", "_free"]' -s EXPORT_ALL=1

## RUN FILE
# option 1
emrun [OBJECTIVE].html

# option 2: run local server
python -m http.server
```
