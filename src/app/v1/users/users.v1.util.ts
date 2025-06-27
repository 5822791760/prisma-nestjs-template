import { z } from 'zod';

import {
  chainTilValid,
  isEmail,
  isNil,
} from '@core/shared/common/common.validator';

export const PostUsersImportCsvV1FileData = z
  .tuple([
    z.string().min(1, 'ID_REQUIRED'),
    z
      .string()
      .refine(chainTilValid(isNil, isEmail), { message: 'EMAIL_INVALID' }),
    z.string(),
    z.string(),
    z.string().optional().nullable(),
  ])
  .transform(([id, email, createdAt, updatedAt, lastSignedInAt]) => {
    if (lastSignedInAt === '-' || !lastSignedInAt) {
      lastSignedInAt = null;
    }

    return {
      id: z.coerce.number().parse(id),
      email: z.string().parse(email),
      createdAt: z.coerce.date().parse(createdAt),
      updatedAt: z.coerce.date().parse(updatedAt),
      lastSignedInAt: z.coerce.date().nullable().parse(lastSignedInAt),
    };
  });
