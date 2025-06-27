import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';

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
