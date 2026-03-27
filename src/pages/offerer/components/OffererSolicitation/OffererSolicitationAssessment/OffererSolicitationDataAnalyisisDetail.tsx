import {Alert, Box, Grid, Skeleton, Stack} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {BaseRequestFields, EntityWithIdFields} from 'types/baseEntities';
import {HttpSolicitationAnalysis} from 'http/solicitations/httpSolicitationAnalysis';
import {useAction} from 'hooks/useAction';
import {SolicitationViewDTO, SolicitationViewDTOFields,} from 'types/solicitations/solicitationData';
import {
  SolicitationAnalysisInsert,
  SolicitationAnalysisInsertFields,
  SolicitationAnalysisViewDTO,
  SolicitationAnalysisViewDTOFields,
} from 'types/solicitations/solicitationAnalysisData';
import {SolicitationOffererStatusType} from 'types/solicitations/solicitationEnums';
import {HttpFilesSolicitationAnalysis} from 'http/files/httpFilesSolicitation';
import {Document, FileBase} from 'types/files/filesData';
import OffererSolicitationAssessmentAnalysisDetail from './OffererSolicitationAssessmentAnalysisDetail';
import {
  OffererSolicitationAnalysisFormDataRequest,
  OffererSolicitationAnalysisFormDataRequestFields,
} from 'types/offerer/offererSolicitationData';
import {OffererSolicitationDataAnalysisDetailSecObjects, SecurityComponents,} from 'types/security';
import {ActionExecute, ActionExecuteFields,} from 'types/workflow/actionData';
import {HttpAction} from 'http/index';
import useAxios from 'hooks/useAxios';
import {ActionsTypes} from 'types/workflow/actionEnums';
import {Systems} from "types/workflow/workflowEnums";

interface OffererSolicitationDataAnalyisisDetailProps {
  solicitation: SolicitationViewDTO;
  actualState: number;
}

const OffererSolicitationDataAnalysisDetail = ({
  solicitation,
  actualState,
}: OffererSolicitationDataAnalyisisDetailProps) => {
  const [solicitationAnalysis, setSolicitationAnalysis] =
    useState<SolicitationAnalysisViewDTO>();
  const [filesSolicitation, setFilesSolicitation] = useState<Document[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { snackbarSuccess, snackbarError } = useAction();
  const { fetchData } = useAxios();

  const onSaveFile = (fileBase: FileBase, file: File) => {
    let solicitationAnalysisId: number =
      solicitationAnalysis?.[EntityWithIdFields.Id] ?? 0;
    return HttpFilesSolicitationAnalysis.insert(
      solicitation[EntityWithIdFields.Id],
      solicitationAnalysisId,
      fileBase,
      file,
    )
      .then(() => {
        snackbarSuccess('El documento se guardó correctamente');
        solicitationAnalysis && loadSectionFiles(solicitationAnalysis);
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

    const actionId = 
        solicitation[SolicitationViewDTOFields.SystemCode] === Systems.Solicitations ?
        ActionsTypes.SendDataAnalysisToApproval : ActionsTypes.SolicitationsReferralsReceive;
    
    fetchData(
      () => HttpAction.executeAction(actionId, dataExecute),
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

    const dataToInsert: SolicitationAnalysisInsert = {
      [SolicitationAnalysisInsertFields.Considerations]: considerations,
      [SolicitationAnalysisInsertFields.IsSuitable]: isSuitable,
      [SolicitationAnalysisInsertFields.AditionalAptitudeMessageList]: messages,
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    };

    fetchData(
      () =>
        HttpSolicitationAnalysis.sendToApproval(
          solicitation[EntityWithIdFields.Id],
          dataToInsert,
        ),
      true,
    ).then(executeActionWorkflow);
    /*HttpSolicitationAnalysis.sendToApproval(solicitation[EntityWithIdFields.Id], dataToInsert).then(() => {
            snackbarSuccess("El formulario se guardó correctamente")
            window.location.reload()
        }).catch(() => snackbarError("Ocurrió un error al guardar el formulario"))*/
  };

  const viewState: boolean =
    actualState === SolicitationOffererStatusType.AnalysisApproval ||
    actualState === SolicitationOffererStatusType.PrequalificationAnalyisis ||
    actualState === SolicitationOffererStatusType.PrequalificationApproval ||
    actualState === SolicitationOffererStatusType.PrequalificationReceived ||
    actualState === SolicitationOffererStatusType.SolicitationReceptionApproval ||
    actualState === SolicitationOffererStatusType.Derivation ||
    actualState === SolicitationOffererStatusType.SolicitationSGRResponse ||
    actualState === SolicitationOffererStatusType.SolicitionPymeResponse ||
    actualState === SolicitationOffererStatusType.SolicitationResponseMatcher ||
    actualState === SolicitationOffererStatusType.SolicitationUnableDerivation

  const loadSectionFiles = (analysis: SolicitationAnalysisViewDTO) => {
    setFilesSolicitation(undefined);
    HttpFilesSolicitationAnalysis.getList(
      solicitation[EntityWithIdFields.Id],
      analysis[EntityWithIdFields.Id],
    ).then((res) => {
      setFilesSolicitation(res);
    });
  };

  useEffect(() => {
    HttpSolicitationAnalysis.getActualBySolicitationId(
      solicitation[EntityWithIdFields.Id],
    ).then((res) => {
      setSolicitationAnalysis(res);
      loadSectionFiles(res);
      setLoading(false);
    });
  }, [solicitation]);

  const renderByActualState = () => {
    if (actualState === SolicitationOffererStatusType.InAnalysis || actualState === SolicitationOffererStatusType.SolicitationReception || viewState) {
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
              dataAnalysis={solicitationAnalysis && solicitationAnalysis}
              onReloadDataFiles={loadSectionFiles}
              messageForm={
                solicitationAnalysis &&
                solicitationAnalysis[
                  SolicitationAnalysisViewDTOFields.AptitudeMessage
                ]
              }
              filesSolicitation={filesSolicitation}
              onSaveFile={onSaveFile}
              handleSave={handleSave}
              safetyComponentName={
                SecurityComponents.OffererSolicitationDataAnalysisDetail
              }
              safetyObjectName={
                OffererSolicitationDataAnalysisDetailSecObjects.ProposalDataAnalysisSolicitationButton
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
    <Grid container spacing={3} width={'fit-content'}>
      <Grid item xs={12}>
        {renderByActualState()}
      </Grid>
    </Grid>
  );
};

export default OffererSolicitationDataAnalysisDetail;
