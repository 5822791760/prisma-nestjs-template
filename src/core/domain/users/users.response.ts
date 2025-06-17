import { ApiProperty } from '@nestjs/swagger';

import { Users } from '@core/db/prisma';
import myDayjs from '@core/shared/common/common.dayjs';

interface UserExpose extends Omit<Users, 'password'> {}

export class UserResponseData implements UserExpose {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: myDayjs().toDate() })
  createdAt: Date;

  @ApiProperty({ example: myDayjs().toDate() })
  updatedAt: Date;

  @ApiProperty({ example: myDayjs().toDate() })
  lastSignedInAt: Date | null;
}
