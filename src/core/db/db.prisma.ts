import {
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'kysely';
import kyselyExtension, {
  PrismaKyselyExtensionArgs,
} from 'prisma-extension-kysely';

import { AppConfig } from '@core/config';
import {
  PaginationOptions,
  getLimit,
  getOffset,
} from '@core/shared/common/common.pagintaion';

import { DB } from './generated/types';
import { Prisma, PrismaClient } from './prisma';

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
    }),
};

type FlatTransactionClient = Prisma.TransactionClient & {
  $commit: () => Promise<void>;
  $rollback: () => Promise<void>;
};

const ROLLBACK = { [Symbol.for('prisma.client.extension.rollback')]: true };
export async function getPrisma(dbConfig: AppConfig['database']) {
  // Enable Replica here
  // const replicaClient = new PrismaClient({
  //   datasourceUrl: 'YOUR_REPLICA_URL', // Replace this with your replica's URL!
  // }).$extends(kyselyExtension(kyselyExtensionArgs));

  const prisma = new PrismaClient({
    log: dbConfig.enableLog ? ['query', 'error'] : undefined,
  })
    .$extends({
      client: {
        async $begin() {
          const prisma = Prisma.getExtensionContext(this);
          let setTxClient: (txClient: Prisma.TransactionClient) => void;
          let commit: () => void;
          let rollback: () => void;

          // a promise for getting the tx inner client
          const txClient = new Promise<Prisma.TransactionClient>((res) => {
            setTxClient = res;
          });

          // a promise for controlling the transaction
          const txPromise = new Promise((_res, _rej) => {
            commit = () => _res(undefined);
            rollback = () => _rej(ROLLBACK);
          });

          // opening a transaction to control externally
          if (
            '$transaction' in prisma &&
            typeof prisma.$transaction === 'function'
          ) {
            const tx = prisma
              .$transaction((txClient) => {
                setTxClient(txClient as unknown as Prisma.TransactionClient);
                return txPromise;
              })
              .catch((e) => {
                if (e === ROLLBACK) {
                  return;
                }
                throw e;
              });

            // return a proxy TransactionClient with `$commit` and `$rollback` methods
            return new Proxy(await txClient, {
              get(target, prop) {
                if (prop === '$commit') {
                  return () => {
                    commit();
                    return tx;
                  };
                }
                if (prop === '$rollback') {
                  return () => {
                    rollback();
                    return tx;
                  };
                }
                return target[prop as keyof typeof target];
              },
            }) as FlatTransactionClient;
          }

          throw new Error('Transactions are not supported by this client');
        },
      },
      model: {
        $allModels: {
          async paginate<T, A>(
            this: T,
            paginationOpts: PaginationOptions,
            opts: Omit<
              Prisma.Args<T, 'findMany'>,
              'skip' | 'take' | 'cursor' | 'distinct'
            >,
          ): Promise<{
            data: Prisma.Result<T, A, 'findMany'>;
            totalItems: number;
          }> {
            const context = Prisma.getExtensionContext(this);
            const totalItems = await (context as any).count({
              where: opts['where'],
            });
            const data = await (context as any).findMany({
              ...opts,
              take: getLimit(paginationOpts),
              skip: getOffset(paginationOpts),
            });

            return { data, totalItems };
          },
          async exists<T>(
            this: T,
            where: Prisma.Args<T, 'findFirst'>['where'],
          ): Promise<boolean> {
            const context = Prisma.getExtensionContext(this);
            const result = await (context as any).findFirst({ where });
            return result !== null;
          },
          async updateIgnoreOnNotFound<T, A>(
            this: T,
            args: Prisma.Exact<A, Prisma.Args<T, 'update'>>,
          ): Promise<Prisma.Result<T, A, 'update'> | null> {
            try {
              const context = Prisma.getExtensionContext(this) as any;
              return await context.update(args);
            } catch (err) {
              if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                err.code === 'P2025'
              ) {
                return null;
              }
              throw err;
            }
          },
          async deleteIgnoreOnNotFound<T, A>(
            this: T,
            args: Prisma.Exact<A, Prisma.Args<T, 'delete'>>,
          ): Promise<Prisma.Result<T, A, 'delete'> | null> {
            try {
              const context = Prisma.getExtensionContext(this) as any;
              return await context.delete(args);
            } catch (err) {
              if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                err.code === 'P2025'
              ) {
                return null;
              }
              throw err;
            }
          },
        },
      },
    })
    // .$extends(readReplicas({ replicas: [replicaClient] }));

    // This need to be at the end or it will bug with transaction
    .$extends(kyselyExtension(kyselyExtensionArgs));

  await prisma.$connect();

  return prisma;
}
