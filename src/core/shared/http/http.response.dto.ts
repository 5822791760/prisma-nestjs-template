import { z } from 'zod';

import { IPaginationMeta, IPaginationSchema } from './http.standard';

export class PaginationResponseSchema implements IPaginationSchema {
  page: number;
  nextPage: number;
  previousPage: number;
  perPage: number;
  totalItems: number;
  currentPageItems: number;
  totalPages: number;
}

export class PaginationMetaResponse implements IPaginationMeta {
  pagination: PaginationResponseSchema;
}

export function getPaginationZod() {
  return z.object({
    pagination: z.object({
      page: z.number(),
      nextPage: z.number(),
      previousPage: z.number(),
      perPage: z.number(),
      totalItems: z.number(),
      currentPageItems: z.number(),
      totalPages: z.number(),
    }),
  });
}
