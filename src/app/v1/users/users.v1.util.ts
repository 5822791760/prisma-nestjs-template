import { z } from 'zod';

import { parseCsvNil } from '@core/shared/common/common.parser';
import {
  isAnyValidFunc,
  isCsvNil,
  isEmail,
  isISOString,
  isNull,
} from '@core/shared/common/common.validator';

export const PostUsersImportCsvV1FileData = z
  .tuple([
    z.string().min(1, 'ID_REQUIRED').transform(z.coerce.number().parse),
    z
      .string()
      .nullable()
      .refine(isAnyValidFunc(isCsvNil, isEmail), { message: 'EMAIL_INVALID' })
      .transform(parseCsvNil),
    z.string().refine(isISOString).transform(z.coerce.date().parse),
    z.string().refine(isISOString).transform(z.coerce.date().parse),
    z
      .string()
      .nullable()
      .refine(isAnyValidFunc(isNull, isISOString), {
        message: 'LAST_SIGNED_IN_AT_INVALID',
      })
      .transform((v) => z.coerce.date().nullable().parse(parseCsvNil(v))),
  ])
  .transform(([id, email, createdAt, updatedAt, lastSignedInAt]) => {
    return {
      id,
      email,
      createdAt,
      updatedAt,
      lastSignedInAt,
    };
  });
