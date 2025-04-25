import { Kysely } from 'kysely';

import { DB } from './generated/types';
import { PrismaClient } from './prisma';

export abstract class CoreDB extends PrismaClient {
  declare $kysely: Kysely<DB>;
}
