# webassembly

```bash
source emsdk_env.sh

emcc [YOUR_FILENAME].cpp -o [.html, .js]
# or for sole wasm file,
emcc [YOUR_FILENAME].cpp -s SIDE_MODULE=2 -O1 -s EXPORTED_FUNCTIONS=['_FUNCTION_NAME'] -o [YOUR_FILENAME].wasm

# option 1
emrun [OBJECTIVE].html

# option 2: run local server
python -m http.server
```
