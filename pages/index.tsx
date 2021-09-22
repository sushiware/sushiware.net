import path from 'path';

import Head from 'next/head';
import Link from 'next/link';
import React, { FC } from 'react';

import Layout from '../components/Layout';
import Date from '../components/MyDate';
import { getAllSortedPostDatas, postData } from '../lib/posts';
import config from '../ssg.config';
import utilStyles from '../styles/utils.module.css';

import styles from './index.module.css';

export const getStaticProps = async (): Promise<{
  props: { postDatas: postData[] };
}> => {
  const postDatas = await getAllSortedPostDatas();
  return {
    props: {
      postDatas,
    },
  };
};

type Props = {
  postDatas: postData[];
};

const IndexPage: FC<Props> = ({ postDatas }) => {
  return (
    <Layout home={true}>
      <>
        <Head>
          <title>{config.title}</title>
          <meta name="twitter:description" content={config.description} />
        </Head>
        <section className={utilStyles.headingMd}></section>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <ul className={utilStyles.list}>
            {postDatas.map(({ slug, date, title, thumbnailURL }) => (
              <li className={styles.listItem} key={slug}>
                <Link href={`/posts/${slug}`}>
                  <a className={utilStyles.colorInherit}>
                    <div className={styles.line}>
                      <img
                        src={path.join('posts/thumbnails', thumbnailURL)}
                        className={styles.thumbnail}
                      />
                      <div className={styles.title}>
                        <p>{title}</p>
                        <small>
                          <Date raw={date} />
                        </small>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </>
    </Layout>
  );
};

export default IndexPage;
