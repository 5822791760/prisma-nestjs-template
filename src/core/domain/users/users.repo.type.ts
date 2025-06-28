import { PaginationOptions } from '@core/shared/common/common.pagintaion';

export interface UsersPaginateOptions {
  paginate: PaginationOptions;
  orderBy: { id: 'asc' | 'desc' };
}

export interface UsersFindFirstOptions {
  where?: { id?: number; email?: string };
}
