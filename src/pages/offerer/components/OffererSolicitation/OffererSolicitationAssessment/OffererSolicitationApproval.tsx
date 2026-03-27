import { Alert, Box, Grid, Skeleton, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  SolicitationApprovalResultViewDTO,
  SolicitationApprovalUpdateDTO,
  SolicitationApprovalUpdateDTOFields,
  SolicitationApprovalViewDTO,
} from '../../../../../types/solicitations/solicitationApprovalData';
import {
  BaseRequestFields,
  EntityWithIdFields,
} from '../../../../../types/baseEntities';
import { HttpAction, HttpCacheSolicitation } from '../../../../../http';
import { useAction } from '../../../../../hooks/useAction';
import {
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from '../../../../../types/solicitations/solicitationData';
import {
  SolicitationApprovalResultType,
  SolicitationOffererStatusType, SolicitationOffererTabs,
} from '../../../../../types/solicitations/solicitationEnums';
import { HttpSolicitationApproval } from '../../../../../http/solicitations/httpSolicitationApproval';
import { HttpSolicitationAnalysis } from '../../../../../http/solicitations/httpSolicitationAnalysis';
import { SolicitationAnalysisViewDTO } from '../../../../../types/solicitations/solicitationAnalysisData';
import OffererSolicitationAssessmentApprovalDetail from './OffererSolicitationAssessmentApprovalDetail';
import {
  OffererSolicitationApprovalSecObjects,
  SecurityComponents,
} from '../../../../../types/security';
import {
  ActionExecute,
  ActionExecuteFields,
} from '../../../../../types/workflow/actionData';
import useAxios from '../../../../../hooks/useAxios';
import { ActionsTypes } from '../../../../../types/workflow/actionEnums';
import {SolicitationHelper} from "../../../../../util/helpers/solicitationHelper";

interface OffererSolicitationApprovalProps {
  solicitation: SolicitationViewDTO;
  actualState: number;
  newWorkflow?: boolean;
}

const OffererSolicitationApproval = ({
  solicitation,
  actualState,
  newWorkflow = false
}: OffererSolicitationApprovalProps) => {
  const [approvalSituation, setApprovalSituation] =
    useState<SolicitationApprovalViewDTO>();
  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<SolicitationAnalysisViewDTO>();
  const [approvalResults, setApprovalResults] = useState<
    SolicitationApprovalResultViewDTO[]
  >([]);
  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();

  const viewState: boolean =
    actualState === SolicitationOffererStatusType.PrequalificationAnalyisis ||
    actualState === SolicitationOffererStatusType.PrequalificationApproval ||
    actualState === SolicitationOffererStatusType.PrequalificationReceived ||
    actualState === SolicitationOffererStatusType.Derivation ||
    actualState === SolicitationOffererStatusType.SolicitationSGRResponse ||
    actualState === SolicitationOffererStatusType.SolicitionPymeResponse ||
    actualState === SolicitationOffererStatusType.SolicitationResponseMatcher ||
    actualState === SolicitationOffererStatusType.SolicitationUnableDerivation;
  
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

    const approvalUpdate: SolicitationApprovalUpdateDTO = {
      [SolicitationApprovalUpdateDTOFields.Justification]: justification,
      [SolicitationApprovalUpdateDTOFields.SolicitationApprovalResultCode]:
        approvalId,
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    };

    fetchData(
      () =>
        HttpSolicitationApproval.setApprovalResponse(
          solicitation[EntityWithIdFields.Id],
          approvalUpdate,
        ),
      true,
    ).then(() => {
      let isApprove: boolean =
        approvalId === SolicitationApprovalResultType.Approved;
      executeActionWorkflow(
          !newWorkflow ?
                  isApprove
                    ? ActionsTypes.ApproveDataAnalysis
                    : ActionsTypes.ReturnToDataAnalysis
                :
                  isApprove
                      ? ActionsTypes.SolicitationApproveReception
                      : ActionsTypes.SolicitationRejectReception
      );
    });

    };

  useEffect(() => {
    HttpSolicitationApproval.getActualBySolicitationId(
      solicitation[EntityWithIdFields.Id],
    ).then((res) => {
      setApprovalSituation(res);
      setLoading(false);
    });

    HttpCacheSolicitation.getApprovalResults().then((res) =>
      setApprovalResults(res.reverse()),
    );

    HttpSolicitationAnalysis.getActualBySolicitationId(
      solicitation[EntityWithIdFields.Id],
    ).then((res) => {
      setAnalysis(res);
    });
  }, []);

  return (
    <Grid container spacing={1}>
      {actualState === SolicitationOffererStatusType.AnalysisApproval || actualState === SolicitationOffererStatusType.SolicitationReceptionApproval ||
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
              data
              dataApproval={approvalSituation}
              dataAnalysis={analysis}
              handleContinue={handleContinue}
              safetyComponentName={
                SecurityComponents.OffererSolicitationApproval
              }
              safetyObjectName={
                OffererSolicitationApprovalSecObjects.ApproveDataAnalysisSolicitationButton
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

export default OffererSolicitationApproval;
