import { Provider } from '@nestjs/common';
import {
  CamelCasePlugin,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'kysely';
import kyselyExtension from 'prisma-extension-kysely';

import { CoreDB } from './db.common';
import { DB } from './generated/types';
import { PrismaClient } from './prisma';

export const PrismaProvider: Provider = {
  provide: CoreDB,
  useFactory: async () => {
    const prisma = new PrismaClient().$extends(
      kyselyExtension({
        kysely: (driver) =>
          new Kysely<DB>({
            dialect: {
              // This is where the magic happens!
              createDriver: () => driver,
              // Don't forget to customize these to match your database!
              createAdapter: () => new PostgresAdapter(),
              createIntrospector: (db) => new PostgresIntrospector(db),
              createQueryCompiler: () => new PostgresQueryCompiler(),
            },
            plugins: [new CamelCasePlugin()],
          }),
      }),
    );
    await prisma.$connect();

    return prisma;
  },
};
