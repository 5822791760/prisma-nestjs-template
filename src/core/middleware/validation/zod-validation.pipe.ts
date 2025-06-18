import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

import { ApiException } from '@core/shared/http/http.exception';

function setNestedKey(
  target: Record<string, any>,
  path: (string | number)[],
  message: string,
): void {
  let curr = target;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];

    if (i === path.length - 1) {
      curr[key] = [message];
    } else {
      curr[key] ||= {};
      curr = curr[key];
    }
  }
}

export const CoreZodValidationPipe = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: ZodError) => {
    const fields = {};
    for (const err of error.errors) {
      setNestedKey(fields, err.path, err.message);
    }

    return new ApiException(
      {
        key: 'invalidJson',
        fields,
        context: {},
      },
      400,
    );
  },
});
