import { Alert, AlertTitle, Box, Grid, Skeleton, Stack } from '@mui/material';
import { useProductLineDetail } from '../ProductLineDetailContext';
import React from 'react';
import {
  ProductLineApprovalFields,
  ProductLineApprovalUpdate,
  ProductLineApprovalView,
} from 'types/lines/productLineApprovalData';
import { useAction } from 'hooks/useAction';
import useAxios from 'hooks/useAxios';
import { ActionsTypes } from 'types/workflow/actionEnums';
import { ActionExecute, ActionExecuteFields } from 'types/workflow/actionData';
import { HttpAction, HttpProductLineApproval } from 'http/index';
import { BaseRequestFields } from 'types/baseEntities';
import {
  ProductLineApprovalResultType,
  ProductLineStatesType,
} from 'types/lines/productLineEnums';
import ProductLineDetailApprovalAnalysisDetail from './ProductLineDetailApprovalAnalysisDetail';
import { useFormContext } from 'react-hook-form';
import {
  ProductLineFields,
  ProductLineFormData,
} from 'types/lines/productLineData';
import { ProductLineDetailApprovalPublicationResultConfirm } from './ProductLineDetailApprovalPublicationResult';

interface ProductLineDetailApprovalAnalysisProps {
  loading: boolean;
  actualApproval?: ProductLineApprovalView;
}

function ProductLineDetailApprovalAnalysis({
  loading,
  actualApproval,
}: ProductLineDetailApprovalAnalysisProps) {
  const { lineId, messageId, offerer } = useProductLineDetail();
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();
  const methods = useFormContext<ProductLineFormData>();
  const lineState = methods.watch(ProductLineFields.ProductLineStatusCode);
  const lineInProcess = (lineState === ProductLineStatesType.Created) || (lineState === ProductLineStatesType.PublishedInModification);
  const showForm = [
    ProductLineStatesType.PublicationRequest,
    ProductLineStatesType.ApprovedPublication,
    ProductLineStatesType.Published,
  ].includes(lineState);

  const executeActionWorkflow = (action: ActionsTypes) => {
    const dataExecute: ActionExecute = {
      [ActionExecuteFields.MessageId]: messageId,
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

    const approvalUpdate: ProductLineApprovalUpdate = {
      [ProductLineApprovalFields.Justification]: justification,
      [ProductLineApprovalFields.ProductLineApprovalResultCode]: approvalId,
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    };

    fetchData(
      () => HttpProductLineApproval.setApprovalResponse(lineId, approvalUpdate),
      true,
    ).then(() => {
      let isApprove: boolean =
        approvalId === ProductLineApprovalResultType.Approved;
      executeActionWorkflow(
        isApprove
          ? ActionsTypes.ProductLineApprove
          : ActionsTypes.ProductLineReturnToAdmin,
      );
    });
  };

  return (
    <Grid container spacing={1}>
      {!actualApproval ? (
        !lineInProcess ? (
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
              <Skeleton sx={{ width: '100%' }} />
            </Stack>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Box sx={{ width: '100%' }}>
              <Alert severity="info">
                Aún no se solicitó la publicación de la línea.
              </Alert>
            </Box>
          </Grid>
        )
      ) : (
        <ProductLineDetailApprovalAnalysisComponent
          actualApproval={actualApproval}
          offerer={offerer}
          handleContinue={handleContinue}
        />
      )}
    </Grid>
  );
}

interface ProductLineDetailApprovalAnalysisComponentProps {
  actualApproval: ProductLineApprovalView;
  offerer: boolean;
  handleContinue: (justification: string, approval: string) => void;
}

function ProductLineDetailApprovalAnalysisComponent({
  actualApproval,
  offerer,
  handleContinue,
}: ProductLineDetailApprovalAnalysisComponentProps) {
  const approvalResultCode =
    actualApproval[ProductLineApprovalFields.ProductLineApprovalResultCode];
  const positiveResult =
    approvalResultCode === ProductLineApprovalResultType.Approved;
  const negativeResult =
    approvalResultCode === ProductLineApprovalResultType.Rejected;

  return positiveResult ? (
    <ProductLineDetailApprovalPublicationResultConfirm
      approval={actualApproval}
    />
  ) : negativeResult ? (
    <Grid item xs={12}>
      <Alert color={'warning'} severity={'warning'}>
        <AlertTitle>LUC sugiere modificaciones a la publicación</AlertTitle>
        Revisá las consideraciones en el historial de aprobaciones para saber qué modificar antes de solicitar la publicación nuevamente.
      </Alert>
    </Grid>
  ) : offerer ? (
    <Grid item xs={12}>
      <Box sx={{ width: '100%' }}>
        <Alert severity="info">
          La línea se encuentra en proceso de aprobación
        </Alert>
      </Box>
    </Grid>
  ) : (
    <ProductLineDetailApprovalAnalysisDetail
      actualApproval={actualApproval}
      handleContinue={handleContinue}
    />
  );
}

export default ProductLineDetailApprovalAnalysis;
