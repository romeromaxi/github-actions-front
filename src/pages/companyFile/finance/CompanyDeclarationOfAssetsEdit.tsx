import { useFormContext } from 'react-hook-form';
import { Card, CardContent, Divider, Grid, Skeleton } from '@mui/material';

import { CloseButton, SendButton } from 'components/buttons/Buttons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyDeclarationOfAssets } from 'types/company/companyFinanceInformationData';
import CompanyDeclarationOfAssetsEditFields from '../../company/finance/declarationAssets/CompanyDeclarationOfAssetsEditFields';
import { EntityWithIdFields } from 'types/baseEntities';

interface CompanyDeclarationOfAssetsEditProps {
  onSubmit: (data: CompanyDeclarationOfAssets) => void;
}

function CompanyDeclarationOfAssetsEdit(
  props: CompanyDeclarationOfAssetsEditProps,
) {
  const navigate = useNavigate();
  const { watch, handleSubmit } = useFormContext<CompanyDeclarationOfAssets>();

  const onHandleBackPage = () => navigate(-1);

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {watch(EntityWithIdFields.Id) ? (
              <CompanyDeclarationOfAssetsEditFields />
            ) : (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider variant="middle" />
          </Grid>

          <Grid item xs={12} textAlign="end">
            <CloseButton onClick={onHandleBackPage} sx={{ marginRight: 1 }}>
              Cancelar
            </CloseButton>
            <SendButton onClick={handleSubmit(props.onSubmit)}>
              Guardar
            </SendButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default CompanyDeclarationOfAssetsEdit;
