import {
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import { Alert, Box, Grid, Skeleton, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SolicitationOffererStatusType } from 'types/solicitations/solicitationEnums';
import {
  SolicitationDocumentationAnalysisInsert,
  SolicitationDocumentationAnalysisInsertFields,
  SolicitationDocumentationAnalysisViewDTO,
  SolicitationDocumentationAnalysisViewDTOFields,
} from 'types/solicitations/solicitationDocumentationAnalysisData';
import { BaseRequestFields, EntityWithIdFields } from 'types/baseEntities';
import { HttpSolicitationDocumentationAnalysis } from 'http/solicitations/httpSolicitationDocumentationAnalysis';
import { HttpFilesSolicitationDocumentationAnalysis } from 'http/files/httpFilesSolicitation';
import { Document, FileBase } from 'types/files/filesData';
import { useAction } from 'hooks/useAction';
import OffererSolicitationAssessmentAnalysisDetail from './OffererSolicitationAssessmentAnalysisDetail';
import {
  OffererSolicitationAnalysisFormDataRequest,
  OffererSolicitationAnalysisFormDataRequestFields,
} from 'types/offerer/offererSolicitationData';
import {
  OffererSolicitationDocumentationAnalysisSecObjects,
  SecurityComponents,
} from '../../../../../types/security';
import UseAxios from '../../../../../hooks/useAxios';
import { HttpAction } from '../../../../../http';
import {
  ActionExecute,
  ActionExecuteFields,
} from '../../../../../types/workflow/actionData';
import { ActionsTypes } from '../../../../../types/workflow/actionEnums';

interface OffererSolicitationDocumentationAnalysisProps {
  solicitation: SolicitationViewDTO;
  actualState: number;
}

const OffererSolicitationDocumentationAnalysis = ({
  solicitation,
  actualState,
}: OffererSolicitationDocumentationAnalysisProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [prequalificationAnalysis, setPrequalificationAnalysis] =
    useState<SolicitationDocumentationAnalysisViewDTO>();
  const [filesSolicitation, setFilesSolicitation] = useState<Document[]>();
  const { snackbarError, snackbarSuccess } = useAction();
  const { fetchData } = UseAxios();

  const viewState: boolean =
    actualState === SolicitationOffererStatusType.PrequalificationApproval ||
    actualState === SolicitationOffererStatusType.PrequalificationReceived
      ? true
      : false;

  const loadSectionFiles = (
    preqAnalysis: SolicitationDocumentationAnalysisViewDTO,
  ) => {
    HttpFilesSolicitationDocumentationAnalysis.getList(
      solicitation[EntityWithIdFields.Id],
      preqAnalysis[EntityWithIdFields.Id],
    ).then((res) => {
      setFilesSolicitation(res);
    });
  };

  useEffect(() => {
    HttpSolicitationDocumentationAnalysis.getActualBySolicitationId(
      solicitation[EntityWithIdFields.Id],
    ).then((res) => {
      setPrequalificationAnalysis(res);
      loadSectionFiles(res);
      setLoading(false);
    });
  }, [solicitation]);

  const onSaveFile = (fileBase: FileBase, file: File) => {
    let prequalificationAnalysisId: number =
      prequalificationAnalysis?.[EntityWithIdFields.Id] ?? 0;

    return HttpFilesSolicitationDocumentationAnalysis.insert(
      solicitation[EntityWithIdFields.Id],
      prequalificationAnalysisId,
      fileBase,
      file,
    )
      .then(() => {
        snackbarSuccess('El documento se guardó correctamente');
        prequalificationAnalysis && loadSectionFiles(prequalificationAnalysis);
      })
      .catch(() => snackbarError('Ocurrió un error al guardar el archivo'));
  };

  const executeActionWorkflow = () => {
    const dataExecute: ActionExecute = {
      [ActionExecuteFields.MessageId]:
        solicitation[SolicitationViewDTOFields.MessageId],
      [ActionExecuteFields.WorkflowVariables]: [],
      [ActionExecuteFields.Observations]: '',
    } as ActionExecute;

    fetchData(
      () =>
        HttpAction.executeAction(
          ActionsTypes.SendPrequalificationAnalysisToApproval,
          dataExecute,
        ),
      true,
    ).then(() => {
      snackbarSuccess('El formulario se envió correctamente');
      window.location.reload();
    });
  };

  const handleSave = (
    considerations: string,
    aptitude: string,
    aditionalMessages?: OffererSolicitationAnalysisFormDataRequest[],
  ) => {
    const messages: string[] = [];
    aditionalMessages?.map((msg) =>
      messages.push(
        msg[OffererSolicitationAnalysisFormDataRequestFields.Message],
      ),
    );
    const isSuitable: boolean = aptitude === 'apto';

    const dataToInsert: SolicitationDocumentationAnalysisInsert = {
      [SolicitationDocumentationAnalysisInsertFields.Considerations]:
        considerations,
      [SolicitationDocumentationAnalysisInsertFields.IsSuitable]: isSuitable,
      [SolicitationDocumentationAnalysisInsertFields.AditionalAptitudeMessageList]:
        messages,
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    };

    fetchData(
      () =>
        HttpSolicitationDocumentationAnalysis.sendToApproval(
          solicitation[EntityWithIdFields.Id],
          dataToInsert,
        ),
      true,
    ).then(executeActionWorkflow);

    /*HttpSolicitationDocumentationAnalysis.sendToApproval(solicitation[EntityWithIdFields.Id], dataToInsert).then(() => {
            window.location.reload()
        }).catch(() => snackbarError("Ocurrió un error al guardar el formulario"))*/
  };

  const renderByActualState = () => {
    if (
      actualState === SolicitationOffererStatusType.PrequalificationAnalyisis ||
      viewState
    ) {
      // @ts-ignore
      return (
        <>
          {loading ? (
            <Stack spacing={1}>
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
            </Stack>
          ) : (
            <OffererSolicitationAssessmentAnalysisDetail
              solicitation={solicitation}
              viewState={viewState}
              actualState={actualState}
              docAnalysis={prequalificationAnalysis && prequalificationAnalysis}
              onReloadDocFiles={loadSectionFiles}
              messageForm={
                prequalificationAnalysis &&
                prequalificationAnalysis[
                  SolicitationDocumentationAnalysisViewDTOFields.AptitudeMessage
                ]
              }
              filesSolicitation={filesSolicitation}
              onSaveFile={onSaveFile}
              handleSave={handleSave}
              safetyComponentName={
                SecurityComponents.OffererSolicitationDocumentationAnalysis
              }
              safetyObjectName={
                OffererSolicitationDocumentationAnalysisSecObjects.ProposalDocumentationAnalysisSolicitationButton
              }
            />
          )}
        </>
      );
    } else {
      return (
        <Box sx={{ width: '100%' }}>
          <Alert severity="info">
            La solicitud aún no se encuentra en estado de análisis
          </Alert>
        </Box>
      );
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {renderByActualState()}
      </Grid>
    </Grid>
  );
};

export default OffererSolicitationDocumentationAnalysis;
