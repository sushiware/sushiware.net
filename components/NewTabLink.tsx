import React, { FC } from 'react';

type Props = {
  children: JSX.Element;
  url: string;
};

const NewTabLink: FC<Props> = ({ children, url }) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

export default NewTabLink;
