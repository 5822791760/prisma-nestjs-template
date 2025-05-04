export type FieldsErrorKey = 'exists';

export interface IPaginationSchema {
  page: number;
  nextPage: number;
  previousPage: number;
  perPage: number;
  totalItems: number;
  currentPageItems: number;
  totalPages: number;
}

export interface IPaginationMeta {
  pagination: IPaginationSchema;
}

export interface IStandardSingleApiResponse<
  M extends Record<string, any> = object,
> {
  success: boolean;
  key: string;
  data: object | undefined;
  error?: {
    fields: Record<string, FieldsErrorKey[]>;
    context: Record<string, any>;
    details: any;
  };
  meta?: M;
}

export interface IStandardArrayApiResponse<
  M extends Record<string, any> = object,
> extends Omit<IStandardSingleApiResponse<M>, 'data'> {
  data: object[];
  meta?: M;
}
