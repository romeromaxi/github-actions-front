﻿import { useState } from 'react';
import FileNewDialog from './NewFileDialog';
import { HttpCacheFiles } from 'http/cache/httpCacheFiles';

import { FileBase } from 'types/files/filesData';
import { Sections } from 'types/general/generalEnums';
import React from 'react';
import BoxListNewEntity from "../misc/BoxListNewEntity";
import {Box} from "@mui/material";

interface FileNewButtonProps {
  section: Sections;
  typeCode?: number;
  onSaveFile: (fileBase: FileBase, file: File) => Promise<any>;
  onReload?: () => void;
}

function FileNewButton(props: FileNewButtonProps) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const onOpenDialog = () => setOpenDialog(true);

  const onCloseDialog = () => setOpenDialog(false);

  return (
    <React.Fragment>
      <Box sx={{width: '100%'}}>
        <BoxListNewEntity
          title={'Agregar nuevo documento'}
          onClickNew={onOpenDialog}
        />
      </Box>

      {openDialog && (
        <FileNewDialog
          section={props.section}
          fileType={props.typeCode}
          onLoadFileTypes={HttpCacheFiles.getTypes}
          onCloseDialog={onCloseDialog}
          onSubmitDialog={props.onSaveFile}
          onReload={props.onReload}
          blockSection={!props.typeCode}
        />
      )}
    </React.Fragment>
  );
}

export default FileNewButton;
