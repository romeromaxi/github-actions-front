import React, { ReactElement } from 'react';
import { Alert, Stack } from '@mui/material';

import SectionHeader from 'components/cards/SectionHeader';
import FileDocumentDetail, {
  FileDocumentDetailLoading,
} from './FileDocumentDetail';

import {
  Document,
  DocumentDelete,
  FileBase,
  FileSolicitation,
} from 'types/files/filesData';
import {MenuItemDropdown} from "../buttons/Buttons";

interface FileListProps {
  filesDocument?: Document[];
  onReload?: () => void;
  title?: string;
  delete?: boolean;
  share?: boolean;
  onSaveFile?: (fileBase: FileBase, file: File) => Promise<any>;
  onSelect?: (
    event: React.ChangeEvent<HTMLInputElement>,
    document: Document,
    fileSolicitation?: FileSolicitation,
  ) => void;
  download?: boolean;
  preview?: boolean;
  deleteBody?: DocumentDelete;
  action?: (document: Document) => ReactElement;
  dropdown?: boolean;
  onShare?: (item: Document) => void;
}

function FileDocumentList(props: FileListProps) {
  return (
    <Stack gap={2}>
      {props.title && <SectionHeader>{props.title}</SectionHeader>}

      {!props.filesDocument && <FileDocumentDetailLoading />}

      {props.filesDocument &&
        !props.filesDocument.length &&
        !props.onSaveFile && (
          <Alert severity="info">
            No se han encontrado documentos
          </Alert>
        )}

      {props.filesDocument &&
        props.filesDocument.map((document) => (
          <FileDocumentDetail
            document={document}
            delete={props.delete}
            deleteBody={props.deleteBody}
            share={props.share}
            onShare={props.onShare}
            download={props.download}
            onReload={props.onReload}
            onSelect={props.onSelect}
            preview={props.preview}
            action={props.action}
            dropdown={props.dropdown}
          />
        ))}
    </Stack>
  );
}

export default FileDocumentList;
