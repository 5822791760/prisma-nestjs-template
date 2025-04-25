import { Provider } from '@nestjs/common';
import {
  CamelCasePlugin,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'kysely';
import kyselyExtension, {
  PrismaKyselyExtensionArgs,
} from 'prisma-extension-kysely';

import { CoreDB } from './db.common';
import { DB } from './generated/types';
import { PrismaClient } from './prisma';

const kyselyExtensionArgs: PrismaKyselyExtensionArgs<DB> = {
  kysely: (driver) =>
    new Kysely<DB>({
      dialect: {
        createAdapter: () => new PostgresAdapter(),
        createDriver: () => driver,
        createIntrospector: (db) => new PostgresIntrospector(db),
        createQueryCompiler: () => new PostgresQueryCompiler(),
      },
      plugins: [new CamelCasePlugin()],
    }),
};

export const PrismaProvider: Provider = {
  provide: CoreDB,
  useFactory: async () => {
    // Enable Replica here
    // const replicaClient = new PrismaClient({
    //   datasourceUrl: 'YOUR_REPLICA_URL', // Replace this with your replica's URL!
    // }).$extends(kyselyExtension(kyselyExtensionArgs));

    const prisma = new PrismaClient().$extends(
      kyselyExtension(kyselyExtensionArgs),
    );
    // .$extends(readReplicas({ replicas: [replicaClient] }));

    await prisma.$connect();

    return prisma;
  },
};
