import { Provider } from '@nestjs/common';
import {
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'kysely';
import kyselyExtension, {
  PrismaKyselyExtensionArgs,
} from 'prisma-extension-kysely';

import { config } from '@core/config';

import { CoreDB } from './db.common';
import { DB } from './generated/types';
import { PrismaClient } from './prisma';

const dbConfig = config().database;

const kyselyExtensionArgs: PrismaKyselyExtensionArgs<DB> = {
  kysely: (driver) =>
    new Kysely<DB>({
      dialect: {
        createAdapter: () => new PostgresAdapter(),
        createDriver: () => driver,
        createIntrospector: (db) => new PostgresIntrospector(db),
        createQueryCompiler: () => new PostgresQueryCompiler(),
      },
      plugins: [],
      log: dbConfig.enableLog ? ['query', 'error'] : undefined,
    }),
};

export const PrismaProvider: Provider = {
  provide: CoreDB,
  useFactory: async () => {
    // Enable Replica here
    // const replicaClient = new PrismaClient({
    //   datasourceUrl: 'YOUR_REPLICA_URL', // Replace this with your replica's URL!
    // }).$extends(kyselyExtension(kyselyExtensionArgs));

    const prisma = new PrismaClient({
      log: dbConfig.enableLog ? ['query', 'error'] : undefined,
    }).$extends(kyselyExtension(kyselyExtensionArgs));
    // .$extends(readReplicas({ replicas: [replicaClient] }));

    await prisma.$connect();

    return prisma;
  },
};
