import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Grid, Typography } from '@mui/material';

import { ControlledTextFieldFilled } from 'components/forms';

import { CompanyBasePatrimonialStatementFields } from 'types/company/companyFinanceInformationData';
import { grey } from '@mui/material/colors';
import CompanyYearFieldVariation from '../../components/CompanyYearFieldVariation';

interface CompanyPatrimonialStatementEditPassiveNotCurrentProps {
  nameBase: string;
}

function CompanyPatrimonialStatementEditPassiveNotCurrent({
  nameBase,
}: CompanyPatrimonialStatementEditPassiveNotCurrentProps) {
  const { control, setValue, watch } = useFormContext();
  const watchCommercialDebt = watch(
    `${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentCommercialDebt}`,
  );
  /*const watchLoans = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentLoans}`);
    const watchRemunerationsSocialCharges = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentRemunerationsSocialCharges}`);
    const watchFiscalCharges = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentFiscalCharges}`);
    const watchCustomerAdvances = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentCustomerAdvances}`);
    const watchDividendsPayable = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentDividendsPayable}`);
    const watchOtherDebts = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentOtherDebts}`);
    const watchProvisions = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentProvisions}`);*/

  const watchLastCommercialDebt = watch(
    `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentCommercialDebt}`,
  );
  /*const watchLastLoans = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentLoans}`);
    const watchLastRemunerationsSocialCharges = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentRemunerationsSocialCharges}`);
    const watchLastFiscalCharges = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentFiscalCharges}`);
    const watchLastCustomerAdvances = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentCustomerAdvances}`);
    const watchLastDividendsPayable = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentDividendsPayable}`);
    const watchLastOtherDebts = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentOtherDebts}`);
    const watchLastProvisions = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentProvisions}`);*/

  const updateTotalPassiveNotCurrent = () => {
    /*const newTotal : number =
            parseFloat(watchCommercialDebt || "0") + parseFloat(watchLoans || "0") + parseFloat(watchRemunerationsSocialCharges || "0") +
            parseFloat(watchFiscalCharges || "0") + parseFloat(watchCustomerAdvances || "0") + parseFloat(watchDividendsPayable || "0") +
            parseFloat(watchOtherDebts || "0") + parseFloat(watchProvisions || "0")

        setValue(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentTotal}`, newTotal);*/

    setValue(
      `${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentTotal}`,
      parseFloat(watchCommercialDebt || '0'),
      { shouldDirty: true }
    );
  };

  const updateLastTotalPassiveNotCurrent = () => {
    /*const newTotal : number =
            parseFloat(watchLastCommercialDebt || "0") + parseFloat(watchLastLoans || "0") + parseFloat(watchLastRemunerationsSocialCharges || "0") +
            parseFloat(watchLastFiscalCharges || "0") + parseFloat(watchLastCustomerAdvances || "0") + parseFloat(watchLastDividendsPayable || "0") +
            parseFloat(watchLastOtherDebts || "0") + parseFloat(watchLastProvisions || "0")

        setValue(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentTotal}`, newTotal);*/

    setValue(
      `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentTotal}`,
      parseFloat(watchLastCommercialDebt || '0'),
      { shouldDirty: true }
    );
  };

  const handleFocus = (e: any) => e.target.select();

  /*
        useEffect(() => {
            updateTotalPassiveNotCurrent()
        }, [watchCommercialDebt, watchLoans, watchRemunerationsSocialCharges, watchFiscalCharges, watchCustomerAdvances, watchDividendsPayable, watchOtherDebts, watchProvisions])
    
        useEffect(() => {
            updateLastTotalPassiveNotCurrent()
        }, [watchLastCommercialDebt, watchLastLoans, watchLastRemunerationsSocialCharges, watchLastFiscalCharges, watchLastCustomerAdvances, watchLastDividendsPayable, watchLastOtherDebts, watchLastProvisions])
     */

  useEffect(() => {
    updateTotalPassiveNotCurrent();
  }, [watchCommercialDebt]);

  useEffect(() => {
    updateLastTotalPassiveNotCurrent();
  }, [watchLastCommercialDebt]);

  return (
    <Grid container spacing={1} mt={2}>
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
            Deudas Comerciales
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentCommercialDebt}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label={''}
            control={control}
            name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentCommercialDebt}`}
            currency
            onFocus={handleFocus}
            textAlign="right"
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyYearFieldVariation
            nameBase={nameBase}
            field={
              CompanyBasePatrimonialStatementFields.PassiveNotCurrentCommercialDebt
            }
          />
        </Grid>
      </Grid>
      {/*
                
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Préstamos</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentLoans}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentLoans}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveNotCurrentLoans}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Remuneraciones/Cargas Sociales</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentRemunerationsSocialCharges}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentRemunerationsSocialCharges}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveNotCurrentRemunerationsSocialCharges}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Cargas Fiscales</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentFiscalCharges}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentFiscalCharges}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveNotCurrentFiscalCharges}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Anticipos de Clientes</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentCustomerAdvances}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentCustomerAdvances}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveNotCurrentCustomerAdvances}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Dividendos a Pagar</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentDividendsPayable}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentDividendsPayable}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveNotCurrentDividendsPayable}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Otras Deudas</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentOtherDebts}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentOtherDebts}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveNotCurrentOtherDebts}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Previsiones</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentProvisions}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentProvisions}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveNotCurrentProvisions}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14} fontWeight={600}>Subtotal corriente</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentTotal}`}
                                                       currency
                                                       disabled={true}
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveNotCurrentTotal}`}
                                                       currency
                                                       disabled={true}
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveNotCurrentTotal}/>
                        </Grid>
                    </Grid>
                 */}
    </Grid>
  );
}

export default CompanyPatrimonialStatementEditPassiveNotCurrent;
