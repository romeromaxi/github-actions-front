import { Alert, Box, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {
  Document,
  DocumentFields,
  FileSolicitation,
  FileSolicitationFields,
} from '../../types/files/filesData';
import { FileNewDialogProps } from '../files/NewFileDialog';
import FileDocumentDetail from '../files/FileDocumentDetail';
import { dateFormatter } from '../../util/formatters/dateFormatter';
import { EntityWithIdFields } from '../../types/baseEntities';

interface SolicitationRequiredFileDetailProps {
  file: FileSolicitation;
  onReload: () => void;
  offerer: boolean;
  onSelectFile?: (
    event: React.ChangeEvent<HTMLInputElement>,
    document: Document,
    fileSolicitation?: FileSolicitation,
  ) => void;
  uploadDialog?: FileNewDialogProps;
  selectNotAllowed?: boolean;
}

const SolicitationRequiredFileDetail = (
  props: SolicitationRequiredFileDetailProps,
) => {
  return (
    <Grid item xs={12} container alignItems={'center'}>
      <Grid item xs={12} md={6}>
        <Stack spacing={1}>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <DescriptionOutlinedIcon sx={{ fontSize: '35px' }} />
            <Stack>
              <Typography fontSize={16} fontWeight={600}>
                {props.file[FileSolicitationFields.TitleSolicitation]}
              </Typography>
              <Typography
                fontSize={14}
                fontWeight={600}
                color={'#A1A5B7 !important'}
              >
                {`${dateFormatter.toShortDate(props.file[FileSolicitationFields.SolicitationDate])} - ${props.file[DocumentFields.Observations] ? `Observaciones: ${props.file[DocumentFields.Observations]}` : 'Sin observaciones'}`}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        {props.offerer ? (
          props.file[EntityWithIdFields.Id] !== 0 ? (
            <FileDocumentDetail
              document={props.file}
              fileSolicitation={props.file}
              download
              onReload={props.onReload}
            />
          ) : (
            <Box sx={{ width: '100%' }}>
              <Alert severity="info">
                La empresa aún no cargó este archivo
              </Alert>
            </Box>
          )
        ) : (
          <FileDocumentDetail
            document={props.file}
            fileSolicitation={props.file}
            onReload={props.onReload}
            download={props.file[EntityWithIdFields.Id] !== 0}
            upload={
              (props.file[EntityWithIdFields.Id] === 0 ||
                !props.file[FileSolicitationFields.Sent]) &&
              !props.selectNotAllowed
            }
            onSelect={
              props.file[EntityWithIdFields.Id] !== 0 &&
              !props.file[FileSolicitationFields.Sent] &&
              !props.selectNotAllowed
                ? props.onSelectFile
                : undefined
            }
            uploadDialogProps={props.uploadDialog}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default SolicitationRequiredFileDetail;
