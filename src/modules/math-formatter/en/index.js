// @flow
import tz from 'timezone/loaded';
import { NODE_ENTITY, NODE_DATE_TIME } from '../../math/types';
import type { Locale } from '../types';
import formatEntity from './entity';


const enFormatter: Locale = {
  [NODE_ENTITY]: formatEntity,
  [NODE_DATE_TIME]: (context, dateTime) => {
    const { year, month, date, hour, minute, second, timezone } = dateTime.value;
    return tz([year, month, date, hour, minute, second], 'en_GB', '%c', timezone);
  },
};
export default enFormatter;
