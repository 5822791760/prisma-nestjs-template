import * as dayjs from 'dayjs';
import * as dayOfYear from 'dayjs/plugin/dayOfYear';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(dayOfYear);

dayjs.tz.setDefault('Asia/Bangkok');

const myDayjs = dayjs;

export default myDayjs;
