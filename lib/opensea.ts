// import { OpenSeaPort, Network } from 'opensea-js';
// import { OpenSeaAsset } from 'opensea-js/lib/types';
import Web3 from 'web3';

import abi from './opensea-polygon-abi.json';

const web3 = new Web3('https://rpc-mainnet.maticvigil.com/');

const address = '0x2953399124F0cBB46d2CbACD8A89cF0599974963';

const contract = new web3.eth.Contract(abi as any, address);

// const seaport = new OpenSeaPort(provider, { networkName: Network.Main });

// NOTE:
// openseaのmetadataはAPIでしか取れない
// polygonのAPIはまだ用意されていない

export const getAsset = async (
  // tokenAddress: string,
  tokenId: string
): Promise<string> => {
  // const ret = contract.methods.uri(tokenId).call();

  const ret = contract.methods.uri(tokenId).call();

  return ret;

  // const asset = await seaport.api.getAsset({
  //   // tokenAddress, // string
  //   // tokenId, // string | number | null
  //   tokenAddress: '0x2953399124F0cBB46d2CbACD8A89cF0599974963',
  //   tokenId:
  //     '80533188798899796897868278064969341025676140528266714365537697187813461590017',
  // });

  // return ;
};
