import React, { FC } from 'react';
import { useFileUpload, FileUpload } from 'use-file-upload';

import Button from './Button';

function isArray<T>(maybeArray: T | readonly T[]): maybeArray is T[] {
  return Array.isArray(maybeArray);
}

const NFTGenerator: FC = () => {
  const [files, selectFiles] = useFileUpload();
  return (
    <div>
      {isArray(files) &&
        files.map((file) => (
          <img
            key={file.source.toString()}
            src={file.source.toString()}
            alt="preview"
          />
        ))}
      {files && !isArray(files) && (
        <img src={files.source.toString()} alt="preview" />
      )}
      <GenerateButton
        color={'pink'}
        onClick={() =>
          selectFiles(
            { accept: 'image/*', multiple: true },
            (file: FileUpload | [FileUpload]) => {
              console.log('Files Selected', file);
            }
          )
        }>
        <p>Push</p>
      </GenerateButton>
    </div>
  );
};

type Props = {
  onClick: () => void;
  color: string;
};

const GenerateButton: FC<Props> = ({ onClick, color }) => (
  <Button
    border="none"
    radius="15%"
    width="80px"
    color={color}
    height="40px"
    onClick={onClick}>
    <p>Push</p>
  </Button>
);

const gen = (file: FileUpload | [FileUpload]): void => {
  if (isArray(file)) {
    file.map((f) => {
      console.log(f);
    });
    return;
  }

  console.log(file);
};

export default NFTGenerator;
