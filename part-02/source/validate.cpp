#include <cstdint>
#include <cstdlib>
#include <cstring>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
uint8_t* create_buffer(int size_needed) { return new uint8_t[size_needed]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif

void free_buffer(const char* pointer) { delete pointer; }

typedef void (*OnSuccess)(void);
typedef void (*OnError)(const char*);

int ValidateValueProvided(const char* value) {
  if ((value == NULL) || (value[0] == '\0')) {
    return 0;
  }
  return 1;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif

int ValidateName(char* name, int maximum_length, OnSuccess UpdateHostOnSuccess,
                 OnError UpdateHostOnError) {
  if (ValidateValueProvided(name) == 0) {
    UpdateHostOnError("A Product Name must be provided");
  }

  if (strlen(name) > maximum_length) {
    UpdateHostOnError("The Product Name is too long");
    return 0;
  }

  return 1;
}

int IsCategoryIdInArray(char* selected_category_id, int* valid_category_ids,
                        int array_length) {
  int category_id = atoi(selected_category_id);
  for (int index = 0; index < array_length; index++) {
    if (valid_category_ids[index] == category_id) {
      return 1;
    }
  }
  return 0;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif

int ValidateCategory(char* category_id, int* valid_category_ids,
                     int array_length, OnSuccess UpdateHostOnSuccess,
                     OnError UpdateHostOnError) {
  if (ValidateValueProvided(category_id) == 0) {
    UpdateHostOnError("A Product Category must be selected");
  } else if ((valid_category_ids == NULL) || (array_length == 0)) {
    UpdateHostOnError("There are no Product Categories available");
    return 0;
  } else if (IsCategoryIdInArray(category_id, valid_category_ids,
                                 array_length) == 0) {
    UpdateHostOnError("The selected Category is not valid");
    return 0;
  } else {
    UpdateHostOnSuccess();
  }

  return 1;
}

#ifdef __cplusplus
}
#endif