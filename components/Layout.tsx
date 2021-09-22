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
            <img src="/header.png" />
          </>
        ) : (
          <>
            <Link href="/">
              <img src="/posts/header.png" />
            </Link>
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
