import Link from 'next/link';
import React, { FC } from 'react';

import config from '../ssg.config';
import utilStyles from '../styles/utils.module.css';

import styles from './Layout.module.css';

type Props = {
  children: JSX.Element;
  title: string;
  home?: boolean;
};

const Layout: FC<Props> = ({ children, title, home = false }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {home ? (
          <>
            <h1 className={utilStyles.heading2Xl}>{config.title}</h1>
            <img src="logo.png" />
            <h1 className={utilStyles.headingXl}>{config.subtitle}</h1>
          </>
        ) : (
          <>
            <h1 className={utilStyles.heading2Xl}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{title}</a>
              </Link>
            </h1>
          </>
        )}
      </header>
      <main className={utilStyles.main}>{children}</main>
      <footer className={styles.footer}>
        &copy;
        {config.title}
      </footer>
    </div>
  );
};

export default Layout;
