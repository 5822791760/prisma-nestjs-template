import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request, Response } from 'express';

import { getTransaltionFunc } from '@core/global/lang/lang.common';
import { TranslationFunctions } from '@core/i18n/i18n-types';

import { writeCsv as writeCsvData } from '../common/common.csv';
import { CSV_HEADER, LANG_HEADER } from './http.headers';

export interface CsvParam {
  acceptCsv: boolean;
  writeCsv: (opts: {
    filename: string;
    csv: [string, string | number][][];
  }) => any;
  t: TranslationFunctions;
}
export const CsvParam = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CsvParam => {
    const req: Request = ctx.switchToHttp().getRequest();
    const res = ctx.switchToHttp().getResponse<Response>();
    const acceptHeader = req.headers[CSV_HEADER] || '';

    function writeCsv(opts: {
      filename: string;
      csv: [string, string | number][][];
    }) {
      const filename = encodeURIComponent(opts.filename);
      const stream = writeCsvData(opts.csv);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('filename', filename);
      res.setHeader(
        'Access-Control-Expose-Headers',
        'Content-Disposition, filename',
      );

      stream.pipe(res);
      stream.end();
    }

    return {
      acceptCsv: acceptHeader === 'csv',
      writeCsv,
      t: getTransaltionFunc(req.headers[LANG_HEADER] as string),
    };
  },
);
