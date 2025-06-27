import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import {
  chainTilValid,
  isEmail,
  isNil,
} from '@core/shared/common/common.validator';
import { zodDto } from '@core/shared/common/common.zod';

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

export const PostUsersImportCsvV1Input = z.object({
  name: z.string(),
});
export type PostUsersImportCsvV1Input = z.infer<
  typeof PostUsersImportCsvV1Input
>;

export class PostUsersImportCsvV1Dto extends zodDto(PostUsersImportCsvV1Input) {
  // nestjs file will need to be inserted in handler
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
