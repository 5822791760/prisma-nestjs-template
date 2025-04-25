import { Provider } from '@nestjs/common';

import { CoreDB } from './db.common';
import { PrismaClient } from './prisma';

export const PrismaProvider: Provider = {
  provide: CoreDB,
  useFactory: async () => {
    const prisma = new PrismaClient();
    await prisma.$connect();

    return prisma;
  },
};
