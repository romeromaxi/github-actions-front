import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Grid, Typography } from '@mui/material';

import { ControlledTextFieldFilled } from 'components/forms';

import { CompanyBasePatrimonialStatementFields } from 'types/company/companyFinanceInformationData';
import { grey } from '@mui/material/colors';
import CompanyYearFieldVariation from '../../components/CompanyYearFieldVariation';

interface CompanyPatrimonialStatementEditActiveCurrentProps {
  nameBase: string;
}

function CompanyPatrimonialStatementEditActiveCurrent({
  nameBase,
}: CompanyPatrimonialStatementEditActiveCurrentProps) {
  const { control, setValue, watch } = useFormContext();
  const watchCurrentCashBanks = watch(
    `${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentCashBanks}`,
  );
  /*const watchInvestments = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentInvestments}`);
    const watchOtherReceivables = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentOtherReceivables}`);
    const watchExchangeThing = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentExchangeThing}`);
    const watchOthers = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentOthers}`);*/
  const watchLastCashBanks = watch(
    `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentCashBanks}`,
  );
  /*const watchLastInvestments = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentInvestments}`);
    const watchLastOtherReceivables = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentOtherReceivables}`);
    const watchLastExchangeThing = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentExchangeThing}`);
    const watchLastOthers = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentOthers}`);*/

  const updateTotalActiveCurrent = () => {
    /*const newTotal : number = 
            parseFloat(watchCurrentCashBanks || "0") + parseFloat(watchInvestments || "0") + parseFloat(watchOtherReceivables || "0") + 
            parseFloat(watchExchangeThing || "0") + parseFloat(watchOthers || "0")
        
        setValue(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentTotal}`, newTotal);*/

    setValue(
      `${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentTotal}`,
      parseFloat(watchCurrentCashBanks || '0'),
      { shouldDirty: true }
    );
  };

  const updateLastTotalActive = () => {
    /*const newTotal : number =
            parseFloat(watchLastCashBanks || "0") + parseFloat(watchLastInvestments || "0") + parseFloat(watchLastOtherReceivables || "0") +
            parseFloat(watchLastExchangeThing || "0") + parseFloat(watchLastOthers || "0")

        setValue(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentTotal}`, newTotal);*/

    setValue(
      `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentTotal}`,
      parseFloat(watchLastCashBanks || '0'),
      { shouldDirty: true }
    );
  };

  const handleFocus = (e: any) => e.target.select();

  /*
    useEffect(() => {
        updateTotalActiveCurrent()
    }, [watchCurrentCashBanks, watchInvestments, watchOtherReceivables, watchExchangeThing, watchOthers])
    
    useEffect(() => {
        updateLastTotalActive()
    }, [watchLastCashBanks, watchLastInvestments, watchLastOtherReceivables, watchLastExchangeThing, watchLastOthers])
     */

  useEffect(() => {
    updateTotalActiveCurrent();
  }, [watchCurrentCashBanks]);

  useEffect(() => {
    updateLastTotalActive();
  }, [watchLastCashBanks]);

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
            Subtotal Activo Corriente
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentCashBanks}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label={''}
            control={control}
            name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentCashBanks}`}
            currency
            onFocus={handleFocus}
            textAlign="right"
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyYearFieldVariation
            nameBase={nameBase}
            field={CompanyBasePatrimonialStatementFields.ActiveCurrentCashBanks}
          />
        </Grid>
      </Grid>
      {/*
                
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Inversiones</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentInvestments}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentInvestments}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveCurrentInvestments}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Otros Créditos</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentOtherReceivables}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentOtherReceivables}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveCurrentOtherReceivables}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Bienes de Cambio</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentExchangeThing}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentExchangeThing}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveCurrentExchangeThing}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Otros Activos</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentOthers}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentOthers}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveCurrentOthers}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                            <Grid item xs={4}>
                                <Typography color={grey[600]} fontSize={14} fontWeight={600}>Subtotal corriente</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <ControlledTextFieldFilled label=""
                                                           control={control}
                                                           name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveCurrentTotal}`}
                                                           currency
                                                           disabled={true}
                                                           onFocus={handleFocus}
                                                           textAlign={'right'}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <ControlledTextFieldFilled label=""
                                                           control={control}
                                                           name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveCurrentTotal}`}
                                                           currency
                                                           disabled={true}
                                                           onFocus={handleFocus}
                                                           textAlign={'right'}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveCurrentTotal}/>
                            </Grid>
                        </Grid>
                 */}
    </Grid>
  );
}

export default CompanyPatrimonialStatementEditActiveCurrent;
