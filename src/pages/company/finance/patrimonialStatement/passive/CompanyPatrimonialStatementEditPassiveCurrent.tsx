import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Grid, Typography } from '@mui/material';

import { ControlledTextFieldFilled } from 'components/forms';

import { CompanyBasePatrimonialStatementFields } from 'types/company/companyFinanceInformationData';
import { grey } from '@mui/material/colors';
import CompanyYearFieldVariation from '../../components/CompanyYearFieldVariation';

interface CompanyPatrimonialStatementEditPassiveCurrentProps {
  nameBase: string;
}

function CompanyPatrimonialStatementEditPassiveCurrent({
  nameBase,
}: CompanyPatrimonialStatementEditPassiveCurrentProps) {
  const { control, setValue, watch } = useFormContext();
  const watchCommercialDebt = watch(
    `${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentCommercialDebt}`,
  );
  /*const watchLoans = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentLoans}`);
    const watchRemunerationsSocialCharges = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentRemunerationsSocialCharges}`);
    const watchFiscalCharges = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentFiscalCharges}`);
    const watchCustomerAdvances = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentCustomerAdvances}`);
    const watchDividendsPayable = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentDividendsPayable}`);
    const watchOtherDebts = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentOtherDebts}`);
    const watchProvisions = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentProvisions}`);*/
  const watchLastCommercialDebt = watch(
    `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentCommercialDebt}`,
  );
  /*const watchLastLoans = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentLoans}`);
    const watchLastRemunerationsSocialCharges = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentRemunerationsSocialCharges}`);
    const watchLastFiscalCharges = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentFiscalCharges}`);
    const watchLastCustomerAdvances = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentCustomerAdvances}`);
    const watchLastDividendsPayable = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentDividendsPayable}`);
    const watchLastOtherDebts = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentOtherDebts}`);
    const watchLastProvisions = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentProvisions}`);*/

  const updateTotalPassiveCurrent = () => {
    /*const newTotal : number = 
            parseFloat(watchCommercialDebt || "0") + parseFloat(watchLoans || "0") + parseFloat(watchRemunerationsSocialCharges || "0") +
            parseFloat(watchFiscalCharges || "0") + parseFloat(watchCustomerAdvances || "0") + parseFloat(watchDividendsPayable || "0") +
            parseFloat(watchOtherDebts || "0") + parseFloat(watchProvisions || "0")
        
        setValue(`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentTotal}`, newTotal);*/

    setValue(
      `${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentTotal}`,
      parseFloat(watchCommercialDebt || '0'),
      { shouldDirty: true }
    );
  };

  const updateLastTotalPassiveCurrent = () => {
    /*const newTotal : number =
            parseFloat(watchLastCommercialDebt || "0") + parseFloat(watchLastLoans || "0") + parseFloat(watchLastRemunerationsSocialCharges || "0") +
            parseFloat(watchLastFiscalCharges || "0") + parseFloat(watchLastCustomerAdvances || "0") + parseFloat(watchLastDividendsPayable || "0") +
            parseFloat(watchLastOtherDebts || "0") + parseFloat(watchLastProvisions || "0")

        setValue(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentTotal}`, newTotal);*/

    setValue(
      `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentTotal}`,
      parseFloat(watchLastCommercialDebt || '0'),
      { shouldDirty: true }
    );
  };

  const handleFocus = (e: any) => e.target.select();

  /*
    useEffect(() => {
        updateTotalPassiveCurrent()
    }, [watchCommercialDebt, watchLoans, watchRemunerationsSocialCharges, watchFiscalCharges, watchCustomerAdvances, watchDividendsPayable, watchOtherDebts, watchProvisions])

    useEffect(() => {
        updateLastTotalPassiveCurrent()
    }, [watchLastCommercialDebt, watchLastLoans, watchLastRemunerationsSocialCharges, watchLastFiscalCharges, watchLastCustomerAdvances, watchLastDividendsPayable, watchLastOtherDebts, watchLastProvisions])
     */

  useEffect(() => {
    updateTotalPassiveCurrent();
  }, [watchCommercialDebt]);

  useEffect(() => {
    updateLastTotalPassiveCurrent();
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
            Subtotal Pasivo Corriente
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentCommercialDebt}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label={''}
            control={control}
            name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentCommercialDebt}`}
            currency
            onFocus={handleFocus}
            textAlign="right"
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyYearFieldVariation
            nameBase={nameBase}
            field={
              CompanyBasePatrimonialStatementFields.PassiveCurrentCommercialDebt
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
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentLoans}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentLoans}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveCurrentLoans}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Remun./Cargas Soc.</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentRemunerationsSocialCharges}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentRemunerationsSocialCharges}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveCurrentRemunerationsSocialCharges}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Cargas Fiscales</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentFiscalCharges}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentFiscalCharges}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveCurrentFiscalCharges}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Anticipos de Clientes</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentCustomerAdvances}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentCustomerAdvances}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveCurrentCustomerAdvances}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Dividendos a Pagar</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentDividendsPayable}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentDividendsPayable}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveCurrentDividendsPayable}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Otras Deudas</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentOtherDebts}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentOtherDebts}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveCurrentOtherDebts}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Previsiones</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentProvisions}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentProvisions}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveCurrentProvisions}/>
                        </Grid>
                        <Grid item xs={12} container alignItems={'center'} spacing={2}>
                            <Grid item xs={4}>
                                <Typography color={grey[600]} fontSize={14} fontWeight={600}>Subtotal corriente</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <ControlledTextFieldFilled label=""
                                                           control={control}
                                                           name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveCurrentTotal}`}
                                                           currency
                                                           disabled={true}
                                                           onFocus={handleFocus}
                                                           textAlign={'right'}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <ControlledTextFieldFilled label=""
                                                           control={control}
                                                           name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveCurrentTotal}`}
                                                           currency
                                                           disabled={true}
                                                           onFocus={handleFocus}
                                                           textAlign={'right'}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.PassiveCurrentTotal}/>
                            </Grid>
                        </Grid>
                    </Grid>
                 */}
    </Grid>
  );
}

export default CompanyPatrimonialStatementEditPassiveCurrent;
