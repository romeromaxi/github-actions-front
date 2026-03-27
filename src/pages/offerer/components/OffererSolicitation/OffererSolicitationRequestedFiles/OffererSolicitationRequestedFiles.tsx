import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Skeleton,
  Stack,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { SolicitationFileRequested } from 'types/files/filesData';
import { HttpFilesSolicitation } from 'http/files/httpFilesSolicitation';
import {
  FileRequestedSolicitationInsert,
  FileRequestedSolicitationInsertFields,
  SolicitationFlagsFields,
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import { EntityWithIdFields } from 'types/baseEntities';
// @ts-ignore

import { useAction } from 'hooks/useAction';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SolicitationRequiredFileNewDialog from './SolicitationRequiredFileNewDialog';
import { SafetyComponent } from 'components/security';
import {
  OffererSolicitationRequestedFilesSecObjects,
  SecurityComponents,
} from 'types/security';
import useAxios from 'hooks/useAxios';
import { SolicitationNavHeaderContext } from '../OffererSolicitationNavHeader';
import SolicitationRequiredFileGroupDetail from '../../../../../components/solicitations/SolicitationRequiredFileGroupDetail';
import SolicitationRequiredFileDetailHeader from '../../../../../components/solicitations/SolicitationRequiredFileDetailHeader';
import { Document } from '../../../../../types/files/filesData';
import { SearchButton } from '../../../../../components/buttons/Buttons';
import OffererApprovedRequestedFilesDialog from './OffererApprovedRequestedFilesDialog';
import {useSolicitation} from "../../../../../hooks/contexts/SolicitationsContext";

interface OffererSolicitationRequestedFilesProps {
  solicitation: SolicitationViewDTO;
}

const OffererSolicitationRequestedFiles = ({
  solicitation,
}: OffererSolicitationRequestedFilesProps) => {
  const { flags } = useSolicitation();
  const { isCommercialResponsible } = useContext(SolicitationNavHeaderContext);

  const [requiredSolicitations, setRequiredSolicitations] =
    useState<SolicitationFileRequested[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [openApprovedFiles, setOpenApprovedFiles] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);

  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    document: Document,
  ) => {
    let newSelectedFiles;
    if (event.target.checked) {
      newSelectedFiles = [...selectedFiles, parseInt(event.target.value)];
      setSelectedFiles(newSelectedFiles);
    } else {
      newSelectedFiles = selectedFiles.filter(
        (id) => id !== parseInt(event.target.value),
      );
      setSelectedFiles(newSelectedFiles);
    }
  };
  const loadFiles = () => {
    setRequiredSolicitations(undefined);
    solicitation &&
      HttpFilesSolicitation.getOffererRequestedFiles(
        solicitation[EntityWithIdFields.Id],
      ).then((files) => {
        setRequiredSolicitations(files.reverse());
      });
  };

  useEffect(() => {
    loadFiles();
  }, [solicitation]);

  const onSaveFile = (fileRequested: FileRequestedSolicitationInsert) => {
    const submitData: FileRequestedSolicitationInsert = {
      ...fileRequested,
      [FileRequestedSolicitationInsertFields.DocumentIds]: selectedFiles,
    };

    fetchData(
      () =>
        HttpFilesSolicitation.requestNewFile(
          solicitation[EntityWithIdFields.Id],
          submitData,
        ),
      true,
    ).then(() => {
      snackbarSuccess('El documento se solicitó correctamente');
      loadFiles();
    });
  };

  const onViewApprovedFiles = () => setOpenApprovedFiles(true);

  const onCloseViewApprovedFiles = () => setOpenApprovedFiles(false);

  const renderAction = () =>
    flags?.[SolicitationFlagsFields.SolicitationRequestDocumentationAllowed] &&
    isCommercialResponsible ? (
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        <SearchButton onClick={onViewApprovedFiles}>
          Ver documentos validados
        </SearchButton>
        <SafetyComponent
          componentName={SecurityComponents.OffererSolicitationRequestedFiles}
          objectName={
            OffererSolicitationRequestedFilesSecObjects.SolicitationOffererRequestFileButton
          }
        >
          <Button
            variant={'contained'}
            color={'primary'}
            startIcon={<UploadFileIcon />}
            onClick={() => {
              setOpen(true);
            }}
          >
            Solicitar nuevo archivo
          </Button>
        </SafetyComponent>
      </Stack>
    ) : (
      <></>
    );

  return (
    <Card>
      <CardHeader title={'Documentación solicitada'} action={renderAction()} />
      <CardContent>
        <Grid container alignItems={'center'} spacing={2}>
          {requiredSolicitations ? (
            requiredSolicitations.length !== 0 ? (
              <>
                <SolicitationRequiredFileDetailHeader
                  offerer
                  solicitationId={solicitation[EntityWithIdFields.Id]}
                />
                {requiredSolicitations.map((req, idx) => (
                  <SolicitationRequiredFileGroupDetail
                    solicitationId={solicitation[EntityWithIdFields.Id]}
                    file={req}
                    onReload={loadFiles}
                    offerer
                    offererId={
                      solicitation[SolicitationViewDTOFields.OffererId]
                    }
                    commercial={isCommercialResponsible}
                    last={idx === requiredSolicitations.length - 1}
                  />
                ))}
              </>
            ) : (
              <Grid item xs={12}>
                <Box sx={{ width: '100%' }}>
                  <Alert severity="info">
                    Al parecer no se han solicitado archivos a mostrar por la
                    empresa
                  </Alert>
                </Box>
              </Grid>
            )
          ) : (
            <Stack sx={{ width: '100%' }} textAlign={'center'}>
              <Skeleton sx={{ width: '90%' }} />
              <Skeleton sx={{ width: '90%' }} />
              <Skeleton sx={{ width: '90%' }} />
              <Skeleton sx={{ width: '90%' }} />
            </Stack>
          )}
        </Grid>
      </CardContent>
      <SolicitationRequiredFileNewDialog
        solicitation={solicitation}
        open={open}
        onClose={() => setOpen(false)}
        onSubmitDialog={onSaveFile}
        onSelect={handleCheckboxChange}
        onReload={loadFiles}
        selectedFiles={selectedFiles}
      />
      <OffererApprovedRequestedFilesDialog
        open={openApprovedFiles}
        onClose={onCloseViewApprovedFiles}
        solicitationId={solicitation[EntityWithIdFields.Id]}
      />
    </Card>
  );
};

export default OffererSolicitationRequestedFiles;
