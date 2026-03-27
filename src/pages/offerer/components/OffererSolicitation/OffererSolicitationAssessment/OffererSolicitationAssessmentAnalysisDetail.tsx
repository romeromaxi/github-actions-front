import {
  Button,
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  SolicitationAnalysisViewDTO,
  SolicitationAnalysisViewDTOFields,
} from 'types/solicitations/solicitationAnalysisData';
import { FileDocumentListSectionSolicitations } from 'components/files/FileDocumentListSection';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { SolicitationOffererStatusType } from 'types/solicitations/solicitationEnums';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { SearchOutlined } from '@mui/icons-material';
import FileNewDialog from 'components/files/NewFileDialog';
import { Sections } from 'types/general/generalEnums';
import { HttpCacheFiles } from 'http/cache/httpCacheFiles';
import OffererSolicitationAnalysisFormDialog from './OffererSolicitationAnalysisFormDialog';
import React, { ChangeEvent, useState } from 'react';
import { Document, FileBase } from 'types/files/filesData';
import { SolicitationViewDTO } from 'types/solicitations/solicitationData';
import {
  SolicitationDocumentationAnalysisViewDTO,
  SolicitationDocumentationAnalysisViewDTOFields,
} from 'types/solicitations/solicitationDocumentationAnalysisData';
import { OffererSolicitationAnalysisFormDataRequest } from 'types/offerer/offererSolicitationData';
import { SafetyComponent } from 'components/security';
import {
  OffererSolicitationDataAnalysisDetailSecObjects,
  OffererSolicitationDocumentationAnalysisSecObjects,
  SecurityComponents,
} from 'types/security';
import useSecurityObject from 'hooks/useSecurityObject';
import {useSolicitation} from "../../../../../hooks/contexts/SolicitationsContext";

interface OffererSolicitationAssessmentAnalysisDetailProps {
  solicitation: SolicitationViewDTO;
  viewState: boolean;
  actualState: number;
  dataAnalysis?: SolicitationAnalysisViewDTO;
  onReloadDataFiles?: (analysis: SolicitationAnalysisViewDTO) => void;
  filesSolicitation: Document[] | undefined;
  onSaveFile: (fileBase: FileBase, file: File) => Promise<any>;
  messageForm?: string;
  docAnalysis?: SolicitationDocumentationAnalysisViewDTO;
  onReloadDocFiles?: (
    analysis: SolicitationDocumentationAnalysisViewDTO,
  ) => void;
  handleSave: (
    considerations: string,
    aptitude: string,
    msgs?: OffererSolicitationAnalysisFormDataRequest[],
  ) => void;
  safetyComponentName: SecurityComponents;
  safetyObjectName:
    | OffererSolicitationDataAnalysisDetailSecObjects
    | OffererSolicitationDocumentationAnalysisSecObjects;
}

const OffererSolicitationAssessmentAnalysisDetail = ({
  safetyComponentName,
  safetyObjectName,
  ...props
}: OffererSolicitationAssessmentAnalysisDetailProps) => {
  const { isStageResponsible } = useSolicitation();
  const { hasWritePermission } = useSecurityObject();
  const writePermission =
    hasWritePermission(safetyComponentName, safetyObjectName) &&
    isStageResponsible;

  const [considerations, setConsiderations] = useState<string>('');
  const [aptitude, setAptitude] = useState<string>('');
  const [openFileDialog, setOpenFileDialog] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAptitude: string,
  ) => {
    setAptitude(newAptitude);
  };

  const onSaveDialog = (
    msgs?: OffererSolicitationAnalysisFormDataRequest[],
  ) => {
    props.handleSave(considerations, aptitude, msgs);
    setFormOpen(false);
  };

  const onChangeTextField = (e: ChangeEvent<HTMLInputElement>) =>
    setConsiderations(e.target.value);

  const handleReload = () => {
    props.dataAnalysis &&
      props.onReloadDataFiles &&
      props.onReloadDataFiles(props.dataAnalysis);
    props.docAnalysis &&
      props.onReloadDocFiles &&
      props.onReloadDocFiles(props.docAnalysis);
  };

  const getSuitableSituation = () => {
    if (props.viewState) {
      return props.dataAnalysis
        ? props.dataAnalysis[SolicitationAnalysisViewDTOFields.IsSuitable]
        : props.docAnalysis?.[
            SolicitationDocumentationAnalysisViewDTOFields.IsSuitable
          ];
    } else {
      return aptitude === 'apto';
    }
  };

  const loadForm = () => {
    if (props.dataAnalysis) {
      return props.actualState === SolicitationOffererStatusType.InAnalysis;
    } else {
      return (
        props.actualState ===
        SolicitationOffererStatusType.PrequalificationAnalyisis
      );
    }
  };

  const getDefaultTextField = () => {
    if (props.viewState) {
      return props.dataAnalysis
        ? props.dataAnalysis[SolicitationAnalysisViewDTOFields.Considerations]
        : props.docAnalysis &&
            props.docAnalysis[
              SolicitationDocumentationAnalysisViewDTOFields.Considerations
            ];
    }

    return '';
  };

  return (
    <Grid item xs={12} container spacing={3}>
      <Grid item xs={12}>
        <Stack spacing={1}>
          <Typography variant={'body2'} fontWeight={500}>
            Consideraciones de uso interno
          </Typography>

          <TextField
            id="outlined-multiline-static"
            multiline
            rows={3}
            fullWidth
            onChange={onChangeTextField}
            defaultValue={getDefaultTextField()}
            disabled={props.viewState || !writePermission}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1}>
          <Typography variant={'body2'} fontWeight={500}>
            Carga de archivos
          </Typography>
          <FileDocumentListSectionSolicitations
            filesDocument={props.filesSolicitation && props.filesSolicitation}
            delete={!props.viewState && writePermission}
            download
            onReload={handleReload}
            preview
          />
          {isStageResponsible && !props.viewState && (
            <SafetyComponent
              componentName={safetyComponentName}
              objectName={safetyObjectName}
            >
              <Button
                variant={'contained'}
                color={'primary'}
                startIcon={<UploadFileIcon />}
                onClick={() => {
                  setOpenFileDialog(true);
                }}
              >
                Subir archivo
              </Button>
            </SafetyComponent>
          )}
        </Stack>
      </Grid>
      
      {(isStageResponsible || props.viewState) && (
        <>
          <Grid item xs={6}>
            <SafetyComponent
              componentName={safetyComponentName}
              objectName={safetyObjectName}
              disabled={props.viewState}
            >
              <ToggleButtonGroup
                color={'primary'}
                value={
                  !props.viewState
                    ? aptitude
                    : (
                          props.dataAnalysis
                            ? props.dataAnalysis[
                                SolicitationAnalysisViewDTOFields.IsSuitable
                              ]
                            : props.docAnalysis?.[
                                SolicitationDocumentationAnalysisViewDTOFields
                                  .IsSuitable
                              ]
                        )
                      ? 'apto'
                      : 'noapto'
                }
                exclusive
                onChange={handleChange}
                aria-label={'Aptitud'}
                size={'large'}
                fullWidth
                disabled={props.viewState}
              >
                <ToggleButton value={'noapto'} color={'error'} disabled={props.viewState}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Typography fontSize={16} fontWeight={600}>
                      NO APTO
                    </Typography>
                    <CloseIcon fontSize={'small'} />
                  </Stack>
                </ToggleButton>
                <ToggleButton value={'apto'} color={'success'} disabled={props.viewState}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Typography fontSize={16} fontWeight={600}>
                      AVANZAR
                    </Typography>
                    <CheckIcon fontSize={'small'} />
                  </Stack>
                </ToggleButton>
              </ToggleButtonGroup>
            </SafetyComponent>
          </Grid>

          <Grid item xs={6}>
            <SafetyComponent
              componentName={safetyComponentName}
              objectName={safetyObjectName}
            >
              <Stack direction={'row'} justifyContent={'flex-end'}>
                {loadForm() ? (
                  <Button
                    variant={'outlined'}
                    color={'primary'}
                    size={'small'}
                    startIcon={<PlagiarismIcon />}
                    onClick={() => {
                      setFormOpen(true);
                    }}
                    disabled={!aptitude}
                  >
                    Cargar formulario
                  </Button>
                ) : (
                  <Button
                    variant={'outlined'}
                    color={'primary'}
                    size={'small'}
                    startIcon={<SearchOutlined />}
                    onClick={() => {
                      setFormOpen(true);
                    }}
                  >
                    Ver comunicación
                  </Button>
                )}
              </Stack>
            </SafetyComponent>
          </Grid>
        </>
      )}

      {openFileDialog && (
        <FileNewDialog
          section={Sections.Solicitations}
          onLoadFileTypes={HttpCacheFiles.getTypes}
          onCloseDialog={() => {
            setOpenFileDialog(false);
          }}
          onSubmitDialog={props.onSaveFile}
        />
      )}
      <OffererSolicitationAnalysisFormDialog
        open={formOpen}
        suitable={getSuitableSituation()}
        solicitation={props.solicitation}
        justView={props.viewState}
        prevMessage={props.messageForm && props.messageForm}
        data={props.dataAnalysis && true}
        dataAnalysis={props.dataAnalysis && props.dataAnalysis}
        docAnalysis={props.docAnalysis && props.docAnalysis}
        onSave={onSaveDialog}
        onClose={() => {
          setFormOpen(false);
        }}
      />
    </Grid>
  );
};

export default OffererSolicitationAssessmentAnalysisDetail;
