import React, {useState} from 'react';
import { Alert, Stack } from '@mui/material';
import FileNewButton from './FileNewButton';
import FileDocumentDetail from './FileDocumentDetail';

import { Sections } from 'types/general/generalEnums';
import { FileType } from 'types/files/filesDataCache';
import { Document, FileBase } from 'types/files/filesData';
import { EntityWithIdAndDescriptionFields } from 'types/baseEntities';
import SharedDocumentationRelateDialog from "../../pages/sharedDocumentation/SharedDocumentationRelateDialog";

interface SupportingFilesCollapsableDetailTypeProps {
  fileType?: FileType;
  files: Document[];
  download?: boolean;
  canDelete?: boolean;
  share?: boolean;
  onReload: () => void;
  onSelect?: () => void;
  onSaveFile?: (fileBase: FileBase, file: File) => Promise<any>;
  relateToFolder?: boolean;
  section: Sections;
}

const SupportingFilesCollapsableDetailType = (
  props: SupportingFilesCollapsableDetailTypeProps,
) => {
  const [showShare, setShowShare] = useState<boolean>(false)
  const [shareDoc, setShareDoc] = useState<Document>()
  const handleShare = (file: Document) => {
    setShowShare(true)
    setShareDoc(file)
  }
  
  return (
    <Stack spacing={1}>
      {props.files.length !== 0 ? (
        props.files.map((file) => (
          <FileDocumentDetail
            document={file}
            onReload={props.onReload}
            onSelect={props.onSelect}
            fileIconSize={'medium'}
            download={props.download}
            delete={props.canDelete}
            share={props.share}
            onShare={() => handleShare(file)}
            relateToFolder={props.relateToFolder}
            preview
            edit
            dropdown
          />
        ))
      ) : !props.onSaveFile ? (
        <Alert severity="info">{`Por el momento no hay documentos del tipo ${props.fileType?.[EntityWithIdAndDescriptionFields.Description]}`}</Alert>
      ) : (
        <></>
      )}
      {props.onSaveFile && (
        <Stack alignItems={'flex-end'} mb={1} mt={1}>
          <FileNewButton
            section={props.section}
            typeCode={props.fileType?.[EntityWithIdAndDescriptionFields.Id]}
            onSaveFile={props.onSaveFile}
            onReload={props.onReload}
          />
        </Stack>
      )}
      {
          shareDoc &&
          <SharedDocumentationRelateDialog open={showShare}
                                           onClose={() => setShowShare(false)}
                                           document={shareDoc}
          />
      }
    </Stack>
  );
};

export default SupportingFilesCollapsableDetailType;
