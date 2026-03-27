import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Grid, Typography } from '@mui/material';


import { CompanyBasePatrimonialStatementFields } from 'types/company/companyFinanceInformationData';
import { grey } from '@mui/material/colors';
import { ControlledTextFieldFilled } from '../../../../../components/forms';
import CompanyYearFieldVariation from '../../components/CompanyYearFieldVariation';
import CompanyFinancialSectionTitle from '../../components/CompanyFinancialSectionTitle';

interface CompanyPatrimonialStatementEditNetPatrimonyProps {
  nameBase: string;
}

function CompanyPatrimonialStatementEditNetPatrimony({
  nameBase,
}: CompanyPatrimonialStatementEditNetPatrimonyProps) {
  const { control, watch, setValue } = useFormContext();

  const watchActive = watch(
    `${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveTotal}`,
  );
  const watchPassive = watch(
    `${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveTotal}`,
  );
  const watchLastActive = watch(
    `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveTotal}`,
  );
  const watchLastPassive = watch(
    `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveTotal}`,
  );

  const updateCurrentNetPatrimony = () => {
    const total: number =
      parseFloat(watchActive || '0') - parseFloat(watchPassive || '0');
    setValue(
      `${nameBase}.${CompanyBasePatrimonialStatementFields.NetPatrimonyTotal}`,
      total,
      { shouldDirty: true }
    );
  };

  const updateLastNetPatrimony = () => {
    const total: number =
      parseFloat(watchLastActive || '0') - parseFloat(watchLastPassive || '0');
    setValue(
      `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.NetPatrimonyTotal}`,
      total,
      { shouldDirty: true }
    );
  };

  useEffect(() => {
    updateCurrentNetPatrimony();
  }, [watchActive, watchPassive]);

  useEffect(() => {
    updateLastNetPatrimony();
  }, [watchLastActive, watchLastPassive]);

  return (
    <>
      <Grid container mt={2}>
        <Grid item xs={12}>
          <CompanyFinancialSectionTitle title={'Patrimonio Neto'} />
        </Grid>
        <Grid item xs={12} container alignItems={'center'} mb={1}>
          <Grid item xs={4}></Grid>
          <Grid item xs={3}>
            <Typography color={grey[600]} fontSize={18} textAlign={'center'}>
              Año actual
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography color={grey[600]} fontSize={18} textAlign={'center'}>
              Año pasado
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography color={grey[600]} fontSize={18} textAlign={'center'}>
              Variación
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={2} alignItems={'center'}>
          <Grid item xs={4}>
            <Typography color={grey[600]} fontSize={16} fontWeight={600}>
              Total
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <ControlledTextFieldFilled
              label=""
              control={control}
              name={`${nameBase}.${CompanyBasePatrimonialStatementFields.NetPatrimonyTotal}`}
              currency
              disabled={true}
              textAlign={'right'}
            />
          </Grid>
          <Grid item xs={3}>
            <ControlledTextFieldFilled
              label=""
              control={control}
              name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.NetPatrimonyTotal}`}
              currency
              disabled={true}
              textAlign={'right'}
            />
          </Grid>
          <Grid item xs={2}>
            <CompanyYearFieldVariation
              nameBase={nameBase}
              field={CompanyBasePatrimonialStatementFields.NetPatrimonyTotal}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default CompanyPatrimonialStatementEditNetPatrimony;
