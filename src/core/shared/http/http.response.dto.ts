import { ApiProperty } from '@nestjs/swagger';

import { IPaginationMeta, IPaginationSchema } from './http.standard';

class PaginationResponseSchema implements IPaginationSchema {
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

export class StandardResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: '' })
  key: string;
}
