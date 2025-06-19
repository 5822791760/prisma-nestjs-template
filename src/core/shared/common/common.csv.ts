import { format } from 'fast-csv';

import myDayjs from './common.dayjs';

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
