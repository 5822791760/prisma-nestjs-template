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
  callback: (row: TOutput) => void | Promise<void>,
  opts: {
    file: Express.Multer.File;
    zod: ZodType<TOutput, ZodTypeDef, unknown>;
    skipRows?: number;
  },
): Promise<
  Res<null, 'invalid' | 'noFile' | 'tooLarge' | 'invalidType' | 'invalidExt'>
> {
  const rValidate = validateCsvFile(opts.file);
  if (rValidate.isErr()) {
    return Err(rValidate.error.key, rValidate.error);
  }

  const promises: Promise<void>[] = [];

  const processRow = (raw: unknown): void => {
    const parsed = opts.zod.parse(raw);
    const res = callback(parsed);
    if (res instanceof Promise) promises.push(res);
  };

  try {
    await new Promise<void>((resolve, reject) => {
      const parser = parse({ headers: false, skipRows: opts.skipRows });

      parser
        .on('error', reject)
        .on('data', (row) => {
          try {
            processRow(row);
          } catch (e) {
            reject(e);
          }
        })
        .on('end', resolve);

      parser.write(opts.file.buffer);
      parser.end();
    });

    await Promise.all(promises);
    return Ok(null);
  } catch (e: any) {
    if (e instanceof ZodError) return ExceptionZod('invalid', e);
    return ExceptionErr('invalid', e);
  }
}
