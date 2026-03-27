import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Divider, Grid, Typography } from '@mui/material';

import { ControlledTextFieldFilled } from 'components/forms';
import { CompanyIncomeStatementFields } from 'types/company/companyFinanceInformationData';
import { grey } from '@mui/material/colors';
import CompanyIncomeFieldVariation from './CompanyIncomeFieldVariation';

interface CompanyIncomeStatementEditEgressProps {
  nameBase: string;
}

function CompanyIncomeStatementEditEgress({
  nameBase,
}: CompanyIncomeStatementEditEgressProps) {
  const { control, setValue, watch } = useFormContext();

  const watchCMV = watch(
    `${nameBase}.${CompanyIncomeStatementFields.EgressCMV}`,
  );
  const watchExpenseAdministrative = watch(
    `${nameBase}.${CompanyIncomeStatementFields.EgressExpenseAdministrative}`,
  );
  const watchExpenseManufacturing = watch(
    `${nameBase}.${CompanyIncomeStatementFields.EgressExpenseManufacturing}`,
  );
  const watchExpenseMarketing = watch(
    `${nameBase}.${CompanyIncomeStatementFields.EgressExpenseMarketing}`,
  );
  const watchExpenseFinancial = watch(
    `${nameBase}.${CompanyIncomeStatementFields.EgressExpenseFinancial}`,
  );
  const watchOtherIncomeExpenses = watch(
    `${nameBase}.${CompanyIncomeStatementFields.EgressOtherIncomeExpenses}`,
  );
  const watchATP = watch(
    `${nameBase}.${CompanyIncomeStatementFields.EgressATP}`,
  );
  const watchResultsSalesThingOfUse = watch(
    `${nameBase}.${CompanyIncomeStatementFields.EgressResultsSalesThingOfUse}`,
  );
  const watchRECPAM = watch(
    `${nameBase}.${CompanyIncomeStatementFields.EgressRECPAM}`,
  );

  const watchLastCMV = watch(
    `${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressCMV}`,
  );
  const watchLastExpenseAdministrative = watch(
    `${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressExpenseAdministrative}`,
  );
  const watchLastExpenseManufacturing = watch(
    `${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressExpenseManufacturing}`,
  );
  const watchLastExpenseMarketing = watch(
    `${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressExpenseMarketing}`,
  );
  const watchLastExpenseFinancial = watch(
    `${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressExpenseFinancial}`,
  );
  const watchLastOtherIncomeExpenses = watch(
    `${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressOtherIncomeExpenses}`,
  );
  const watchLastATP = watch(
    `${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressATP}`,
  );
  const watchLastResultsSalesThingOfUse = watch(
    `${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressResultsSalesThingOfUse}`,
  );
  const watchLastRECPAM = watch(
    `${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressRECPAM}`,
  );

  const updateTotalEgressCurrent = () => {
    const newTotal: number =
      parseFloat(watchCMV) +
      parseFloat(watchExpenseAdministrative || '0') +
      parseFloat(watchExpenseManufacturing || '0') +
      parseFloat(watchExpenseMarketing || '0') +
      parseFloat(watchExpenseFinancial || '0') +
      parseFloat(watchOtherIncomeExpenses || '0') +
      parseFloat(watchATP || '0') +
      parseFloat(watchResultsSalesThingOfUse || '0') +
      parseFloat(watchRECPAM || '0');

    setValue(
      `${nameBase}.${CompanyIncomeStatementFields.EgressTotal}`,
      newTotal,
      { shouldDirty: true }
    );
  };

  const updateLastTotalEgressCurrent = () => {
    const newTotal: number =
      parseFloat(watchLastCMV) +
      parseFloat(watchLastExpenseAdministrative || '0') +
      parseFloat(watchLastExpenseManufacturing || '0') +
      parseFloat(watchLastExpenseMarketing || '0') +
      parseFloat(watchLastExpenseFinancial || '0') +
      parseFloat(watchLastOtherIncomeExpenses || '0') +
      parseFloat(watchLastATP || '0') +
      parseFloat(watchLastResultsSalesThingOfUse || '0') +
      parseFloat(watchLastRECPAM || '0');

    setValue(
      `${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressTotal}`,
      newTotal,
      { shouldDirty: true }
    );
  };

  const handleFocus = (e: any) => e.target.select();

  useEffect(() => {
    updateTotalEgressCurrent();
  }, [
    watchCMV,
    watchExpenseAdministrative,
    watchExpenseManufacturing,
    watchExpenseMarketing,
    watchExpenseFinancial,
    watchOtherIncomeExpenses,
    watchATP,
    watchResultsSalesThingOfUse,
    watchRECPAM,
  ]);

  useEffect(() => {
    updateLastTotalEgressCurrent();
  }, [
    watchLastCMV,
    watchLastExpenseAdministrative,
    watchLastExpenseManufacturing,
    watchLastExpenseMarketing,
    watchLastExpenseFinancial,
    watchLastOtherIncomeExpenses,
    watchLastATP,
    watchLastResultsSalesThingOfUse,
    watchLastRECPAM,
  ]);

  return (
    <Grid container spacing={2} mt={2} justifyContent={'center'}>
      <Grid item xs={12} container alignItems={'center'}>
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
        <Grid item xs={12} container alignItems={'center'} spacing={2}>
          <Grid item xs={4}>
            <Typography color={grey[600]} fontSize={14}>
              CMV
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <ControlledTextFieldFilled
              label=""
              control={control}
              name={`${nameBase}.${CompanyIncomeStatementFields.EgressCMV}`}
              currency
              onFocus={handleFocus}
              textAlign={'right'}
            />
          </Grid>
          <Grid item xs={3}>
            <ControlledTextFieldFilled
              label=""
              control={control}
              name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressCMV}`}
              currency
              onFocus={handleFocus}
              textAlign={'right'}
            />
          </Grid>
          <Grid item xs={2}>
            <CompanyIncomeFieldVariation
              nameBase={nameBase}
              field={CompanyIncomeStatementFields.EgressCMV}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={14}>
            Gastos de administración
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.EgressExpenseAdministrative}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressExpenseAdministrative}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.EgressExpenseAdministrative}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={14}>
            Gastos de fabricación
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.EgressExpenseManufacturing}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressExpenseManufacturing}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.EgressExpenseManufacturing}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={14}>
            Gastos de comercialización
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.EgressExpenseMarketing}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressExpenseMarketing}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.EgressExpenseMarketing}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={14}>
            Gastos financieros
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.EgressExpenseFinancial}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressExpenseFinancial}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.EgressExpenseFinancial}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={14}>
            Otros Ingresos/Egresos
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.EgressOtherIncomeExpenses}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressOtherIncomeExpenses}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.EgressOtherIncomeExpenses}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={14}>
            ATP
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.EgressATP}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressATP}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.EgressATP}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={14}>
            Resul. Venta Bienes de Uso
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.EgressResultsSalesThingOfUse}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressResultsSalesThingOfUse}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.EgressResultsSalesThingOfUse}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={14}>
            RECPAM
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.EgressRECPAM}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressRECPAM}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.EgressRECPAM}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={14} fontWeight={600}>
            Subtotal
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.EgressTotal}`}
            currency
            disabled={true}
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.EgressTotal}`}
            currency
            disabled={true}
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.EgressTotal}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CompanyIncomeStatementEditEgress;
