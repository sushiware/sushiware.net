import { zonedTimeToUtc } from 'date-fns-tz';
import React, { FC } from 'react';

import styles from './MyDate.module.css';

type Params = {
  raw: string;
};

const Date: FC<Params> = ({ raw }): JSX.Element => (
  <div className={styles.date}>{format(zonedTimeToUtc(raw, 'Asia/Tokyo'))}</div>
);

const format = (date: Date): string =>
  `${date.getFullYear()}.${to2Digit(date.getMonth() + 1)}.${to2Digit(
    date.getDate()
  )}`;

const to2Digit = (num: number): string => ('0' + num).slice(-2);

export default Date;
