import Head from 'next/head';
import React, { FC } from 'react';

import Layout from '../components/Layout';
import NFTGenerator from '../components/NFTGenerator';
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
        <NFTGenerator />
      </>
    </Layout>
  );
};

export default NFTImageGenerator;
