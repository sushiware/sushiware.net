import { zonedTimeToUtc } from 'date-fns-tz';
import React, { FC } from 'react';

import styles from './MyDate.module.css';

type Params = {
  raw: string;
};

const Date: FC<Params> = ({ raw }): JSX.Element => {
  const date = zonedTimeToUtc(raw, 'Asia/Tokyo');
  return <div className={styles.date}>{date.toDateString()}</div>;
};

export default Date;
