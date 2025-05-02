import { getPrisma } from './db.prisma';

export const CORE_DB = Symbol('CORE_DB');
export type CoreDB = Awaited<ReturnType<typeof getPrisma>>;
