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
