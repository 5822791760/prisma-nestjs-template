import { format, parse } from 'fast-csv';
import { ZodError, ZodType, ZodTypeDef } from 'zod';

import myDayjs from './common.dayjs';
import { validateCsvFile } from './common.func';
import { Err, ExceptionErr, ExceptionZod, Ok, Res } from './common.neverthrow';

export function writeCsv(data: [string, string | number][][]) {
  const csvStream = format({ headers: true, alwaysWriteHeaders: true });

  data.forEach((row) => csvStream.write(row));

  return csvStream;
}

export function getCsvFileSuffix() {
  return myDayjs().format('YYYY_MM_DD');
}

export function getCsvDateDisplay(date: Date) {
  return myDayjs(date).format('YYYY/MM/DD');
}

export async function readCsv<TOutput>(
  callback: (row: TOutput) => void,
  opts: {
    file: Express.Multer.File;
    zod: ZodType<TOutput, ZodTypeDef, unknown>;
    skipRows?: number;
  },
): Promise<
  Res<null, 'invalid' | 'noFile' | 'tooLarge' | 'invalidType' | 'invalidExt'>
> {
  try {
    const rValidate = validateCsvFile(opts.file);
    if (rValidate.isErr()) {
      return Err(rValidate.error.key, rValidate.error);
    }

    return await new Promise<Res<null, 'invalid'>>((resolve, reject) => {
      const stream = opts.file.buffer;
      const parser = parse({ headers: false, skipRows: opts.skipRows });

      parser
        .on('error', (e) => reject(e))
        .on('data', (row) => {
          if (opts.zod) {
            row = opts.zod.parse(row);
          }

          callback(row);
        })
        .on('end', () => resolve(Ok(null)));

      parser.write(stream);
      parser.end();
    });
  } catch (e: any) {
    if (e instanceof ZodError) {
      return ExceptionZod('invalid', e);
    }

    return ExceptionErr('invalid', e);
  }
}
