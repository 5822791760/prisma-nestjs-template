import { HttpException } from '@nestjs/common';

import { Info } from '../common/common.neverthrow';

export abstract class HttpBaseException extends HttpException {
  key: string;

  protected fields: Record<string, string[]>;
  protected context: Record<string, string>;
  abstract httpStatus: number;

  constructor(info: Info<string>) {
    super('Expected Http Exception', 0);
    this.key = info.key;
    this.fields = info.fields;
    this.context = info.context;
  }

  getContext() {
    return this.context;
  }
  getFields() {
    return this.fields;
  }
}

export class ApiException extends HttpBaseException {
  httpStatus: number;

  constructor(info: Info<string>, httpStatus: number, key?: string) {
    super(info);
    this.httpStatus = httpStatus;
    if (key) {
      this.key = key;
    }
  }
}
