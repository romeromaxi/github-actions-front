import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Link,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ReplyIcon from '@mui/icons-material/Reply';

import { SafetyGridComponent } from 'components/security';
import { SolicitationApprovalResultViewDTOFields } from 'types/solicitations/solicitationApprovalData';
import { EntityWithIdAndDescriptionFields } from 'types/baseEntities';
import {
  ProductLineApprovalFields,
  ProductLineApprovalResultView,
  ProductLineApprovalView,
} from 'types/lines/productLineApprovalData';
import { HttpCacheProductLine } from 'http/cache/httpProductLine';
import { useProductLineDetail } from '../ProductLineDetailContext';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { RequiredStringSchema } from '../../../util/validation/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { ControlledTextFieldFilled } from '../../../components/forms';
import HelperInputText from '../../../components/text/HelperInputText';
import { ProductLineApprovalResultType } from '../../../types/lines/productLineEnums';

interface ProductLineDetailApprovalAnalysisDetailProps {
  actualApproval: ProductLineApprovalView;
  handleContinue: (justification: string, approval: string) => void;
}

enum ApprovalAnalysisFormFields {
  ApprovalResult = 'approvalResult',
  Justification = 'justification',
}

interface ApprovalAnalysisForm {
  [ApprovalAnalysisFormFields.ApprovalResult]: string;
  [ApprovalAnalysisFormFields.Justification]: string;
}

function ProductLineDetailApprovalAnalysisDetail({
  actualApproval,
  handleContinue,
}: ProductLineDetailApprovalAnalysisDetailProps) {
  const { allowEditWorkflow } = useProductLineDetail();

  const [approvalResults, setApprovalResults] =
    useState<ProductLineApprovalResultView[]>();

  const approvalAnalysisSchema = yup.object().shape({
    [ApprovalAnalysisFormFields.ApprovalResult]: RequiredStringSchema,
    [ApprovalAnalysisFormFields.Justification]: RequiredStringSchema,
  });
  const methods = useForm<ApprovalAnalysisForm>({
    defaultValues: {
      [ApprovalAnalysisFormFields.ApprovalResult]: '',
      [ApprovalAnalysisFormFields.Justification]:
        actualApproval[
          ProductLineApprovalFields.ProductLineApprovalResultCode
        ] !== ProductLineApprovalResultType.Pendant
          ? actualApproval[ProductLineApprovalFields.Justification]
          : '',
    },
    resolver: yupResolver(approvalAnalysisSchema),
  });
  const watchApprovalResult = methods.watch(
    ApprovalAnalysisFormFields.ApprovalResult,
  );
  const { error: errorApprovalResult } = methods.getFieldState(
    ApprovalAnalysisFormFields.ApprovalResult,
    methods.formState,
  );

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    approvalState: string,
  ) => {
    methods.clearErrors(ApprovalAnalysisFormFields.ApprovalResult);
    methods.setValue(ApprovalAnalysisFormFields.ApprovalResult, approvalState);
  };

  const onSubmit = (data: ApprovalAnalysisForm) =>
    handleContinue(
      data[ApprovalAnalysisFormFields.Justification],
      data[ApprovalAnalysisFormFields.ApprovalResult],
    );

  useEffect(() => {
    HttpCacheProductLine.getApprovalResults().then((response) =>
      setApprovalResults(response.reverse()),
    );
  }, []);

  return (
    <Grid item xs={12} container spacing={1}>
      <Grid item xs={12}>
        <Typography fontSize={21} fontWeight={600}>
          Aprobación de la Publicación de la línea
        </Typography>
      </Grid>
      <Grid item xs={12} mb={3}>
        <Typography fontSize={13} fontWeight={500} color={'#A1A5B7 !important'}>
          Si tiene dudas sobre la aprobación de esta línea puede consultar la{' '}
          <Link underline={'none'}>Guia de resultados</Link>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography fontSize={21} fontWeight={600}>
          Confirmación
        </Typography>
      </Grid>
      <SafetyGridComponent
        componentName={'safetyComponentName'}
        objectName={'safetyObjectName'}
        item
        xs={12}
        mb={2}
      >
        <ToggleButtonGroup
          color={'primary'}
          value={
            allowEditWorkflow
              ? watchApprovalResult
              : actualApproval[
                  ProductLineApprovalFields.ProductLineApprovalResultCode
                ]
          }
          exclusive
          onChange={handleChange}
          aria-label={'Aprobacion'}
          size={'large'}
          fullWidth
          disabled={!allowEditWorkflow}
        >
          {!!approvalResults &&
            approvalResults.length !== 0 &&
            approvalResults.map((state) => (
              <ToggleButton
                value={state[EntityWithIdAndDescriptionFields.Id]}
                color={
                  state[EntityWithIdAndDescriptionFields.Id] === 2
                    ? 'success'
                    : 'error'
                }
              >
                <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                  <Stack spacing={0.5}>
                    <Typography fontSize={17} fontWeight={700}>
                      {state[EntityWithIdAndDescriptionFields.Description]}
                    </Typography>
                    <Typography
                      fontSize={10}
                      fontWeight={600}
                      color={'#A1A5B7 !important'}
                    >
                      {state[SolicitationApprovalResultViewDTOFields.Detail]}
                    </Typography>
                  </Stack>
                  {state[EntityWithIdAndDescriptionFields.Id] === 2 ? (
                    <CheckIcon fontSize={'small'} />
                  ) : (
                    <ReplyIcon fontSize={'small'} />
                  )}
                </Stack>
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      </SafetyGridComponent>
      {!!errorApprovalResult && !!errorApprovalResult.message && (
        <Grid item xs={12} mt={'-15px'}>
          <HelperInputText text={errorApprovalResult.message} error />
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography fontSize={16} fontWeight={700} color={'#A1A5B7 !important'}>
          Consideraciones de uso interno
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ControlledTextFieldFilled
          control={methods.control}
          name={ApprovalAnalysisFormFields.Justification}
          multiline
          rows={5}
          disabled={!allowEditWorkflow}
        />
      </Grid>

      {allowEditWorkflow && (
        <Grid item xs={12}>
          <Stack direction={'row'} justifyContent={'flex-end'}>
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={methods.handleSubmit(onSubmit)}
            >
              Continuar
            </Button>
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}

export default ProductLineDetailApprovalAnalysisDetail;
