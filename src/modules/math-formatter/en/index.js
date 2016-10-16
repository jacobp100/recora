// @flow
import { padCharsStart, flow } from 'lodash/fp';
import { NODE_ENTITY, NODE_DATE_TIME } from '../../math/types';
import type { Locale } from '../types';
import formatEntity from './entity';


const formatZeros = flow(String, padCharsStart('0', 2));
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const enFormatter: Locale = {
  [NODE_ENTITY]: formatEntity,
  [NODE_DATE_TIME]: (context, dateTime) => {
    const { year, month, date, hour, minute, timezone } = dateTime.value;
    const day = days[new Date(year, month - 1, date).getDay()];
    const time = `${formatZeros(hour)}:${formatZeros(minute)}`;
    const tz = timezone === 'UTC' ? '' : ` (${timezone})`;
    return `${time} ${day} ${date} ${months[month - 1]} ${year}${tz}`;
  },
};
export default enFormatter;
