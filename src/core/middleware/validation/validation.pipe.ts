import { Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { ValidateFields } from '@core/shared/common/common.neverthrow';
import { ApiException } from '@core/shared/http/http.exception';
import { FieldsErrorKey } from '@core/shared/http/http.standard';

@Injectable()
export class CoreValidationPipe extends ValidationPipe {
  constructor() {
    super({ whitelist: true, transform: true });
  }

  createExceptionFactory() {
    return (errors: ValidationError[] | undefined) => {
      if (!errors?.length) {
        return errors;
      }

      const fields: ValidateFields<Record<string, any>> = {};
      errors.map((error) => {
        if (error.constraints) {
          Object.values(error.constraints).forEach((message) => {
            if (!fields[error.property]) {
              fields[error.property] = [];
            }
            fields[error.property].push(message as FieldsErrorKey);
          });
        }
      });
      return new ApiException(
        {
          key: 'invalidJson',
          fields,
          context: {},
        },
        400,
      );
    };
  }
}
