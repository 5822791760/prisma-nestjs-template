import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';

export const PostUsersImportCsvV1FileData = z
  .array(z.any())
  .transform(([id, email, createdAt, updatedAt, lastActive]) => {
    if (lastActive === '-' || !lastActive) {
      lastActive = null;
    }

    return {
      id: z.coerce.number().parse(id),
      email: z.string().parse(email),
      createdAt: z.coerce.date().parse(createdAt),
      updatedAt: z.coerce.date().parse(updatedAt),
      lastActive: z.coerce.date().nullable().parse(lastActive),
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
