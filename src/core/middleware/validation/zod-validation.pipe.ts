import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

import { ApiException } from '@core/shared/http/http.exception';

export const CoreZodValidationPipe = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: ZodError) => {
    const fields = {};
    for (const [k, v] of Object.entries(error.flatten().fieldErrors)) {
      fields[k] = v?.map((data) => data.toLowerCase()) || [];
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
