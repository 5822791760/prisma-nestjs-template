import { z } from 'zod';

export const zPagination = {
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(-1),
};
