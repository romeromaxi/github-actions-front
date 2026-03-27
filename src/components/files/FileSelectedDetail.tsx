import { Box, Stack, Typography } from '@mui/material';
import FileSelectedDetailStyles from './FileSelectedDetail.styles';
import {
  DocumentFields,
  FileBase,
  FileBaseFields,
  FileBaseInsert,
  FileBaseInsertFields,
  FileBlobResponse,
  FileBlobResponseFields,
} from '../../types/files/filesData';
import React, { useState } from 'react';
import DialogPreviewFile from './DialogPreviewFile';
import {WrapperIcons} from "../icons/Icons";
import { MagnifyingGlass, X} from "@phosphor-icons/react";
import {fileFormatter} from "../../util/formatters/fileFormatter";
import {TypographyBase} from "../misc/TypographyBase";

interface FileSelectedDetailProps {
  file: FileBaseInsert;
  actions?: boolean;
  onDelete?: (file: FileBase) => void;
}

export function FileSelectedDetail(props: FileSelectedDetailProps) {
  const classes = FileSelectedDetailStyles();
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const fileBlob: FileBlobResponse = {
    [FileBlobResponseFields.File]: props.file[FileBaseInsertFields.File],
    [FileBlobResponseFields.FileName]: props.file[FileBaseFields.FileDesc],
  };
  const onPreview = () => {
    setOpenPreview(true);
  };

  const onClosePreview = () => {
    setOpenPreview(false);
  };


  return (
    <Box className={classes.root}>
      <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
        <Stack width={'85%'}>
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            {fileFormatter.getIconFolder({ fontSize: 'large' })}
            <TypographyBase variant={'subtitle1'} fontWeight={500} tooltip maxLines={2}>
              {props.file[DocumentFields.FileDesc]}
            </TypographyBase>
          </Stack>
          <Typography fontSize={12} color={'#818992'}>{`${Math.floor(props.file[DocumentFields.FileSize] / 1000)} Kb`}</Typography>
        </Stack>
        {props.actions && (
            <Stack
                direction={'row'}
                spacing={2}
                alignItems={'center'}
            >
              <Box sx={{cursor: 'pointer'}} onClick={() => props.onDelete?.(props.file)}>
                <WrapperIcons Icon={X} size={'sm'} />
              </Box>
              <Box sx={{cursor: 'pointer'}} onClick={onPreview}>
                <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />
              </Box>
            </Stack>
        )}
      </Stack>

      {fileBlob && (
        <DialogPreviewFile
          open={openPreview}
          onClose={onClosePreview}
          fileBlob={fileBlob}
        />
      )}
    </Box>
  );
}
