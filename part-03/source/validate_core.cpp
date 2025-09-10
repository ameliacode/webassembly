#include <cstdlib>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

extern void UpdateHostAboutError(const char* error_message);

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int ValidateValueProvided(const char* value, const char* error_message) {
  if ((value == NULL) || (value[0] == '\0')) {
    UpdateHostAboutError(error_message);
    return 0;
  }
  return 1;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int IsIdInArray(char* selected_id, int* valid_ids, int array_length) {
  int id = atoi(selected_id);
  for (int index = 0; index < array_length; index++) {
    if (valid_ids[index] == id) {
      return 1;
    }
  }
  return 0;
}

#ifdef __cplusplus
}
#endif
