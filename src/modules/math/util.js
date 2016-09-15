// @flow
import { map } from 'lodash/fp';
import tz from 'timezone';
import type { DateTime } from './types';

export const dateTimeToUTCUnix = (dateTime: DateTime): number => {
  const { year, month, date, hour, minute, second, timezone } = dateTime;
  return tz(timezone)([year, month, date, hour, minute, second], 'UTC');
};

export const utcUnixToTz = (utcUnix: number, timezone: string): number =>
  tz(utcUnix, timezone);

export const unixTzToDateTime = (unix: number, timezone: string): DateTime => {
  const formattedString = tz(unix, '%Y %m %d %H %M %S');
  const [year, month, date, hour, minute, second] = map(Number, formattedString.split(' '));
  const dateTime: DateTime = { year, month, date, hour, minute, second, timezone };
  return dateTime;
};
