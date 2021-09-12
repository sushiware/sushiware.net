import Head from 'next/head';
import React, { FC } from 'react';

import Layout from '../components/Layout';
import config from '../ssg.config';

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
        <p>Please wait...</p>
      </>
    </Layout>
  );
};

export default NFTImageGenerator;
