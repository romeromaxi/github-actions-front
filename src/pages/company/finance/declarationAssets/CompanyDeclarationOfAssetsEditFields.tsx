import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Divider, Grid, Stack } from '@mui/material';
import Section from 'components/cards/Section';
import {ControlledTextFieldFilled} from 'components/forms';
import { TotalFinancialYearText } from 'components/text/TotalFinancialYearText';

import { numberFormatter } from 'util/formatters/numberFormatter';
import { CompanyDeclarationOfAssetsFields } from 'types/company/companyFinanceInformationData';

function CompanyDeclarationOfAssetsEditFields() {
  const { control, setValue, watch } = useFormContext();

  const currency: string = '$';
  const watchCash = watch(CompanyDeclarationOfAssetsFields.Cash, 0);
  const watchBankCheckingSavingsAccounts = watch(
    CompanyDeclarationOfAssetsFields.BankCheckingSavingsAccounts,
    0,
  );
  const watchDepositTime = watch(
    CompanyDeclarationOfAssetsFields.DepositTime,
    0,
  );
  const watchCars = watch(CompanyDeclarationOfAssetsFields.Cars, 0);
  const watchLandApartments = watch(
    CompanyDeclarationOfAssetsFields.LandApartments,
    0,
  );
  const watchBankLoans = watch(CompanyDeclarationOfAssetsFields.BankLoans, 0);
  const watchSharesOfStock = watch(
    CompanyDeclarationOfAssetsFields.SharesOfStock,
    0,
  );
  const watchOtherAssets = watch(
    CompanyDeclarationOfAssetsFields.OtherAssets,
    0,
  );
  const watchOtherReceivables = watch(
    CompanyDeclarationOfAssetsFields.OtherReceivables,
    0,
  );
  const watchTotal = watch(CompanyDeclarationOfAssetsFields.Total, 0);

  const updateTotal = () => {
    const newTotal: number =
      parseFloat(watchCash) +
      parseFloat(watchBankCheckingSavingsAccounts) +
      parseFloat(watchDepositTime) +
      parseFloat(watchCars) +
      parseFloat(watchLandApartments) +
      parseFloat(watchBankLoans) +
      parseFloat(watchSharesOfStock) +
      parseFloat(watchOtherAssets) +
      parseFloat(watchOtherReceivables);
    setValue(CompanyDeclarationOfAssetsFields.Total, newTotal);
  };

  useEffect(() => {
    if (!watchCash) setValue(CompanyDeclarationOfAssetsFields.Cash, 0);

    updateTotal();
  }, [watchCash]);

  useEffect(() => {
    if (!watchBankCheckingSavingsAccounts)
      setValue(CompanyDeclarationOfAssetsFields.BankCheckingSavingsAccounts, 0);

    updateTotal();
  }, [watchBankCheckingSavingsAccounts]);

  useEffect(() => {
    if (!watchDepositTime)
      setValue(CompanyDeclarationOfAssetsFields.DepositTime, 0);

    updateTotal();
  }, [watchDepositTime]);

  useEffect(() => {
    if (!watchCars) setValue(CompanyDeclarationOfAssetsFields.Cars, 0);

    updateTotal();
  }, [watchCars]);

  useEffect(() => {
    if (!watchLandApartments)
      setValue(CompanyDeclarationOfAssetsFields.LandApartments, 0);

    updateTotal();
  }, [watchLandApartments]);

  useEffect(() => {
    if (!watchBankLoans)
      setValue(CompanyDeclarationOfAssetsFields.BankLoans, 0);

    updateTotal();
  }, [watchBankLoans]);

  useEffect(() => {
    if (!watchSharesOfStock)
      setValue(CompanyDeclarationOfAssetsFields.SharesOfStock, 0);

    updateTotal();
  }, [watchSharesOfStock]);

  useEffect(() => {
    if (!watchOtherAssets)
      setValue(CompanyDeclarationOfAssetsFields.OtherAssets, 0);

    updateTotal();
  }, [watchOtherAssets]);

  useEffect(() => {
    if (!watchOtherReceivables)
      setValue(CompanyDeclarationOfAssetsFields.OtherReceivables, 0);

    updateTotal();
  }, [watchOtherReceivables]);

  return (
    <Section title={'Bienes'}>
      <Stack spacing={2}>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label="Dinero en efectivo"
            control={control}
            name={CompanyDeclarationOfAssetsFields.Cash}
            fullWidth
            currency
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label="Bancos: Ctas. Ctes. / Cajas de Ahorro"
            control={control}
            name={CompanyDeclarationOfAssetsFields.BankCheckingSavingsAccounts}
            fullWidth
            currency
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label="Depósito a plazo fijo"
            control={control}
            name={CompanyDeclarationOfAssetsFields.DepositTime}
            fullWidth
            currency
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label="Rodados"
            control={control}
            name={CompanyDeclarationOfAssetsFields.Cars}
            fullWidth
            currency
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label="Terrenos y Departamentos"
            control={control}
            name={CompanyDeclarationOfAssetsFields.LandApartments}
            fullWidth
            currency
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label="Préstamos del banco"
            control={control}
            name={CompanyDeclarationOfAssetsFields.BankLoans}
            fullWidth
            currency
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label="Participaciones accionarias"
            control={control}
            name={CompanyDeclarationOfAssetsFields.SharesOfStock}
            fullWidth
            currency
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label="Otros Bienes"
            control={control}
            name={CompanyDeclarationOfAssetsFields.OtherAssets}
            fullWidth
            currency
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label="Otros Créditos"
            control={control}
            name={CompanyDeclarationOfAssetsFields.OtherReceivables}
            fullWidth
            currency
          />
        </Grid>

        <Divider />

        <Stack alignItems="flex-end">
          <TotalFinancialYearText
            label="Total"
            data={numberFormatter.toStringWithAmount(
              parseFloat(watchTotal),
              currency,
            )}
          />
        </Stack>
      </Stack>
    </Section>
  );
}

export default CompanyDeclarationOfAssetsEditFields;
