import React, { Key } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Document, DocumentFields } from 'types/files/filesData';
import FileSelectedDetailStyles from './FileSelectedDetail.styles';
import { HttpFileDocument } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import useAxios from 'hooks/useAxios';
import {WrapperIcons} from "../icons/Icons";
import {FileText, X} from "@phosphor-icons/react";
import {DownloadSimple} from "phosphor-react";
import {TypographyBase} from "../misc/TypographyBase";

interface FileDocumentDetailSelectedSummaryProps {
  document: Document;
  titleMaxLen?: number;
  descMaxLen?: number;
  onDeleteDocument?: () => void;
  download?: boolean;
  key?: Key | null;
}

function FileDocumentDetailSelectedSummary(
  props: FileDocumentDetailSelectedSummaryProps,
) {
  const classes = FileSelectedDetailStyles();
  const { fetchAndDownloadFile } = useAxios();

  const onDownload = () =>
    fetchAndDownloadFile(() =>
      HttpFileDocument.download(props.document[EntityWithIdFields.Id]),
    );

  return (
    <Box className={classes.root} key={props.key}>
      <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
        <Stack>
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <WrapperIcons Icon={FileText} size={'sm'} />
            <Stack>
              <TypographyBase variant={'subtitle1'} fontWeight={500} maxLines={2} tooltip
                              overflowWrap={'anywhere'}
              >
                {props.document[DocumentFields.TitleDocument]}
              </TypographyBase>
              <TypographyBase variant={'caption'} fontWeight={500} maxLines={2} tooltip color='text.lighter'
                              overflowWrap={'anywhere'}
              >
                {props.document[DocumentFields.FileDesc]}
              </TypographyBase>
            </Stack>
          </Stack>
          <Typography fontSize={12} color={'#818992'}>{`${Math.floor(props.document[DocumentFields.FileSize] / 1000)} Kb`}</Typography>
        </Stack>
        <Stack
            direction={'row'}
            spacing={2}
            alignItems={'center'}
        >
          {props.onDeleteDocument && <Box sx={{cursor: 'pointer'}} onClick={props.onDeleteDocument}>
            <WrapperIcons Icon={X} size={'sm'} />
          </Box>}
          {
              props.download &&
              <Box sx={{cursor: 'pointer'}} onClick={onDownload}>
                <WrapperIcons Icon={DownloadSimple} size={'sm'} />
              </Box>
          }
        </Stack>
      </Stack>
    </Box>
  );
}

export default FileDocumentDetailSelectedSummary;
