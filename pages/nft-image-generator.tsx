import Head from 'next/head';
import React, { FC } from 'react';

import Layout from '../components/Layout';
import config from '../ssg.config';
import utilStyles from '../styles/utils.module.css';

const NFTImageGenerator: FC = () => {
  return (
    <Layout title={`NFT Image Generator`}>
      <>
        <Head>
          <title>NFT Image Generator | {config.title}</title>
          <meta
            name="twitter:description"
            content={`NFT Image Generator |${config.title}`}
          />
        </Head>
        <section className={utilStyles.headingMd}></section>
        <section
          className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}></section>
      </>
    </Layout>
  );
};

export default NFTImageGenerator;
