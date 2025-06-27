import { format, parse } from 'fast-csv';

import myDayjs from './common.dayjs';
import { validateCsvFile } from './common.func';
import { Err, ExceptionErr, Ok, Res } from './common.neverthrow';

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

type CsvOpts<T extends string> =
  | {
      skipRows?: number;
      headers: true;
      onRow: (info: {
        row: Record<T, string>;
        rowNum: number;
      }) => void | Promise<void>;
    }
  | {
      skipRows?: number;
      headers: false;
      onRow: (info: { row: string[]; rowNum: number }) => void | Promise<void>;
    };

export async function readCsv<T extends string>(
  file: Express.Multer.File,
  opts: CsvOpts<T>,
): Promise<
  Res<null, 'invalid' | 'noFile' | 'tooLarge' | 'invalidType' | 'invalidExt'>
> {
  const rValidate = validateCsvFile(file);
  if (rValidate.isErr()) {
    return Err(rValidate.error.key, rValidate.error);
  }

  let rowNum = 0;
  if (opts?.headers) {
    // skip header
    rowNum++;
  }
  if (opts?.skipRows) {
    // skip header
    rowNum = rowNum + opts.skipRows;
  }

  const promises: Promise<void>[] = [];
  const processRow = (info: { row: any; rowNum: number }): void => {
    const res = opts.onRow(info);
    if (res instanceof Promise) promises.push(res);
  };

  try {
    await new Promise<void>((resolve, reject) => {
      const parser = parse({
        headers: opts.headers,
        skipRows: opts.skipRows ?? 0,
      });

      parser
        .on('error', reject)
        .on('data', (row) => {
          try {
            processRow({ row, rowNum });
            rowNum++;
          } catch (e) {
            reject(e);
          }
        })
        .on('end', resolve);

      parser.write(file.buffer);
      parser.end();
    });

    await Promise.all(promises);
    return Ok(null);
  } catch (e: any) {
    return ExceptionErr('invalid', e);
  }
}
