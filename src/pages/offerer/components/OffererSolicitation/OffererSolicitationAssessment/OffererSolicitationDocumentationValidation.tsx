import {
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import { Alert, Box, Grid, Skeleton, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { HttpSolicitationDocumentationAnalysis } from 'http/solicitations/httpSolicitationDocumentationAnalysis';
import { BaseRequestFields, EntityWithIdFields } from 'types/baseEntities';
import { SolicitationDocumentationAnalysisViewDTO } from 'types/solicitations/solicitationDocumentationAnalysisData';
import {
  SolicitationApprovalResultType,
  SolicitationOffererStatusType,
} from 'types/solicitations/solicitationEnums';
import { SolicitationApprovalResultViewDTO } from 'types/solicitations/solicitationApprovalData';
import {
  SolicitationDocumentationApprovalUpdateDTO,
  SolicitationDocumentationApprovalUpdateDTOFields,
  SolicitationDocumentationApprovalViewDTO,
} from 'types/solicitations/solicitationDocumentationApprovalData';
import { HttpSolicitationDocumentationApproval } from 'http/solicitations/httpSolicitationDocumentationApproval';
import { HttpAction, HttpCacheSolicitation } from 'http/index';
import { useAction } from 'hooks/useAction';
import OffererSolicitationAssessmentApprovalDetail from './OffererSolicitationAssessmentApprovalDetail';
import {
  OffererSolicitationDocumentationValidationSecObjects,
  SecurityComponents,
} from 'types/security';
import { ActionExecute, ActionExecuteFields } from 'types/workflow/actionData';
import useAxios from 'hooks/useAxios';
import { ActionsTypes } from 'types/workflow/actionEnums';

interface OffererSolicitationDocumentationValidationProps {
  solicitation: SolicitationViewDTO;
  actualState: number;
}

const OffererSolicitationDocumentationValidation = ({
  solicitation,
  actualState,
}: OffererSolicitationDocumentationValidationProps) => {
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();

  const [analysis, setAnalysis] =
    useState<SolicitationDocumentationAnalysisViewDTO>();
  const [loading, setLoading] = useState<boolean>(true);
  const [validation, setValidation] =
    useState<SolicitationDocumentationApprovalViewDTO>();
  const [approvalResults, setApprovalResults] = useState<
    SolicitationApprovalResultViewDTO[]
  >([]);

  const viewState: boolean =
    actualState === SolicitationOffererStatusType.PrequalificationReceived;

  const executeActionWorkflow = (action: ActionsTypes) => {
    const dataExecute: ActionExecute = {
      [ActionExecuteFields.MessageId]:
        solicitation[SolicitationViewDTOFields.MessageId],
      [ActionExecuteFields.WorkflowVariables]: [],
      [ActionExecuteFields.Observations]: '',
    } as ActionExecute;

    fetchData(() => HttpAction.executeAction(action, dataExecute), true).then(
      () => {
        snackbarSuccess('La aprobación se envió correctamente');
        window.location.reload();
      },
    );
  };

  const handleContinue = (justification: string, approvalState: string) => {
    const approvalId: number = parseInt(approvalState);

    const approvalUpdate: SolicitationDocumentationApprovalUpdateDTO = {
      [SolicitationDocumentationApprovalUpdateDTOFields.Justification]:
        justification,
      [SolicitationDocumentationApprovalUpdateDTOFields.SolicitationApprovalResultCode]:
        approvalId,
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    };

    fetchData(
      () =>
        HttpSolicitationDocumentationApproval.setApprovalResponse(
          solicitation[EntityWithIdFields.Id],
          approvalUpdate,
        ),
      true,
    ).then(() => {
      let isApprove: boolean =
        approvalId === SolicitationApprovalResultType.Approved;
      executeActionWorkflow(
        isApprove
          ? ActionsTypes.ApprovePrequalificationAnalysis
          : ActionsTypes.ReturnToPrequalificationAnalysis,
      );
    });

    /*HttpSolicitationDocumentationApproval.setApprovalResponse(solicitation[EntityWithIdFields.Id], approvalUpdate).then(() => {
            window.location.reload()
        }).catch(() => snackbarError("Ocurrió un error"))*/
  };

  useEffect(() => {
    HttpSolicitationDocumentationAnalysis.getActualBySolicitationId(
      solicitation[EntityWithIdFields.Id],
    ).then((res) => {
      setAnalysis(res);
    });

    HttpSolicitationDocumentationApproval.getActualBySolicitationId(
      solicitation[EntityWithIdFields.Id],
    ).then((res) => {
      setValidation(res);
      setLoading(false);
    });

    HttpCacheSolicitation.getApprovalResults().then((res) =>
      setApprovalResults(res.reverse()),
    );
  }, []);

  return (
    <Grid container spacing={1}>
      {actualState === SolicitationOffererStatusType.PrequalificationApproval ||
      viewState ? (
        <Grid item xs={12}>
          {loading ? (
            <Stack spacing={1}>
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
            </Stack>
          ) : (
            <OffererSolicitationAssessmentApprovalDetail
              viewState={viewState}
              approvalResults={approvalResults}
              data={false}
              docAnalysis={analysis && analysis}
              docApproval={validation && validation}
              handleContinue={handleContinue}
              safetyComponentName={
                SecurityComponents.OffererSolicitationDocumentationValidation
              }
              safetyObjectName={
                OffererSolicitationDocumentationValidationSecObjects.ApproveDocumentationAnalysisSolicitationButton
              }
            />
          )}
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Box sx={{ width: '100%' }}>
            <Alert severity="info">
              La solicitud aún no se encuentra en estado de aprobación
            </Alert>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default OffererSolicitationDocumentationValidation;
