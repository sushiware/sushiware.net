import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import remark from 'remark';
import highlight from 'remark-highlight.js';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');
const isDev = process.env.NODE_ENV === 'development';

export type matterData = {
  title: string;
  date: string;
  draft: boolean;
  tokenAddress: string;
  tokenId: string;
  thumbnailURL: string;
  openSeaURL: string;
};

export type params = {
  slug: string;
};

export type postData = matterData &
  params & {
    contentHtml: string;
    beginningPart: string;
  };

export const getAllPostSlugs = async (): Promise<{ params: params }[]> => {
  const fileNames = fs.readdirSync(postsDirectory);

  const postDatas = await getPostDatas(fileNames);

  return postDatas.map((data) => {
    return { params: data };
  });
};

export const getAllSortedPostDatas = async (): Promise<postData[]> => {
  const fileNames = fs.readdirSync(postsDirectory);

  const postDatas = await getPostDatas(fileNames);

  return postDatas.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
};

export const getPostData = async (slug: string): Promise<postData> => {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .use(highlight)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const data = matterResult.data as matterData;

  // NOTE: openseaのAPIがpolygonに未対応なので、使用しない
  // const thumbnailURL =
  //   data.tokenAddress && data.tokenId
  //     ? ((await getAsset(data.tokenAddress, data.tokenId)).imageUrl as string)
  //     : '';

  const beginningPart = (
    fileContents.length > 50 ? fileContents.substring(0, 50) : fileContents
  ).replace(/\r?\n/g, ' ');

  return {
    slug,
    contentHtml,
    beginningPart,
    ...data,
  };
};

const getPostDatas = async (fileNames: string[]): Promise<postData[]> => {
  const postDatas = await Promise.all(
    fileNames.map(async (fileName) => {
      return await getPostData(fileName.split('.').slice(0, -1).join('.'));
    })
  );

  return postDatas.filter((postData) => isDev || !postData.draft);
};
