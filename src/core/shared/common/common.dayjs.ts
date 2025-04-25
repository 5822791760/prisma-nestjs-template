import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

dayjs.tz.setDefault('Asia/Bangkok');

export default function tzDayjs(date?: dayjs.ConfigType) {
  return dayjs(date).tz();
}
