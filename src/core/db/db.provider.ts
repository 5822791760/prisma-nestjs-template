import { Provider } from '@nestjs/common';

import { CORE_DB } from './db.common';
import { getPrisma } from './db.prisma';

export const PrismaProvider: Provider = {
  provide: CORE_DB,
  useFactory: getPrisma,
};
