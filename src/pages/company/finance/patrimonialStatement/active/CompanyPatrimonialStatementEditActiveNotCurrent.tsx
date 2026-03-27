import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Grid, Typography } from '@mui/material';

import { ControlledTextFieldFilled } from 'components/forms';
import { CompanyBasePatrimonialStatementFields } from 'types/company/companyFinanceInformationData';
import { grey } from '@mui/material/colors';
import CompanyYearFieldVariation from '../../components/CompanyYearFieldVariation';

interface CompanyPatrimonialStatementEditActiveNotCurrentProps {
  nameBase: string;
}

function CompanyPatrimonialStatementEditActiveNotCurrent({
  nameBase,
}: CompanyPatrimonialStatementEditActiveNotCurrentProps) {
  const { control, setValue, watch } = useFormContext();
  const watchSalesReceivables = watch(
    `${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentSalesReceivables}`,
  );
  /*const watchOtherReceivables = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentOtherReceivables}`);
    const watchExchangeThing = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentExchangeThing}`);
    const watchThingOfUse = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentThingOfUse}`);
    const watchInvestments = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentInvestments}`);
    const watchIntangibles = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentIntangibles}`);
    const watchDeferredTaxes = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentDeferredTaxes}`);
    const watchPermanentParticipations = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentPermanentParticipations}`);
    const watchOthers = watch(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentOthers}`);*/
  const watchLastSalesReceivables = watch(
    `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentSalesReceivables}`,
  );
  /*const watchLastOtherReceivables = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentOtherReceivables}`);
    const watchLastExchangeThing = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentExchangeThing}`);
    const watchLastThingOfUse = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentThingOfUse}`);
    const watchLastInvestments = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentInvestments}`);
    const watchLastIntangibles = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentIntangibles}`);
    const watchLastDeferredTaxes = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentDeferredTaxes}`);
    const watchLastPermanentParticipations = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentPermanentParticipations}`);
    const watchLastOthers = watch(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentOthers}`);*/
  const updateTotalActiveNotCurrent = () => {
    /*const newTotal : number =
            parseFloat(watchSalesReceivables || "0") + parseFloat(watchOtherReceivables || "0") + parseFloat(watchExchangeThing || "0") +
            parseFloat(watchThingOfUse || "0") + parseFloat(watchInvestments || "0") + parseFloat(watchIntangibles || "0") +
            parseFloat(watchDeferredTaxes || "0") + parseFloat(watchPermanentParticipations || "0") + parseFloat(watchOthers || "0")
        
        setValue(`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentTotal}`, newTotal);*/

    setValue(
      `${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentTotal}`,
      parseFloat(watchSalesReceivables || '0'),
      { shouldDirty: true }
    );
  };

  const updateLastActiveNotCurrent = () => {
    /*const newTotal : number =
            parseFloat(watchLastSalesReceivables || "0") + parseFloat(watchLastOtherReceivables || "0") + parseFloat(watchLastExchangeThing || "0") +
            parseFloat(watchLastThingOfUse || "0") + parseFloat(watchLastInvestments || "0") + parseFloat(watchLastIntangibles || "0") +
            parseFloat(watchLastDeferredTaxes || "0") + parseFloat(watchLastPermanentParticipations || "0") + parseFloat(watchLastOthers || "0")

        setValue(`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentTotal}`, newTotal);*/

    setValue(
      `${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentTotal}`,
      parseFloat(watchLastSalesReceivables || '0'),
      { shouldDirty: true }
    );
  };
  const handleFocus = (e: any) => e.target.select();

  /*useEffect(() => {
        updateTotalActiveNotCurrent()
    }, [watchSalesReceivables, watchOtherReceivables, watchExchangeThing, watchThingOfUse, watchInvestments, watchIntangibles, watchDeferredTaxes, watchPermanentParticipations, watchOthers])
    
    useEffect(() => {
        updateLastActiveNotCurrent()
    }, [watchLastSalesReceivables, watchLastOtherReceivables, watchLastExchangeThing,
        watchLastThingOfUse, watchLastInvestments, watchLastIntangibles,
        watchLastDeferredTaxes, watchLastPermanentParticipations, watchLastOthers
    ])*/

  useEffect(() => {
    updateTotalActiveNotCurrent();
  }, [watchSalesReceivables]);

  useEffect(() => {
    updateLastActiveNotCurrent();
  }, [watchLastSalesReceivables]);

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
            Subtotal Activo No corriente
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentSalesReceivables}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label={''}
            control={control}
            name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentSalesReceivables}`}
            currency
            onFocus={handleFocus}
            textAlign="right"
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyYearFieldVariation
            nameBase={nameBase}
            field={
              CompanyBasePatrimonialStatementFields.ActiveNotCurrentSalesReceivables
            }
          />
        </Grid>
      </Grid>
      {/*
                
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Otros Créditos</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentOtherReceivables}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentOtherReceivables}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveNotCurrentOtherReceivables}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Bienes de Cambio</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentExchangeThing}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentExchangeThing}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveNotCurrentExchangeThing}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Bienes de Uso</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentThingOfUse}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentThingOfUse}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveNotCurrentThingOfUse}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Inversiones</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentInvestments}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentInvestments}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveNotCurrentInvestments}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Activos Intangibles</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentIntangibles}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentIntangibles}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveNotCurrentIntangibles}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Impuestos Diferidos</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentDeferredTaxes}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentDeferredTaxes}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveNotCurrentDeferredTaxes}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Participaciones Permanentes en Sociedades</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentPermanentParticipations}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentPermanentParticipations}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveNotCurrentPermanentParticipations}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14}>Otros Activos</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentOthers}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label={""}
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentOthers}`}
                                                       currency
                                                       onFocus={handleFocus}
                                                       textAlign='right'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveNotCurrentOthers}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems={'center'} spacing={2}>
                        <Grid item xs={4}>
                            <Typography color={grey[600]} fontSize={14} fontWeight={600}>Subtotal No corriente</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentTotal}`}
                                                       currency
                                                       disabled={true}
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextFieldFilled label=""
                                                       control={control}
                                                       name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveNotCurrentTotal}`}
                                                       currency
                                                       disabled={true}
                                                       onFocus={handleFocus}
                                                       textAlign={'right'}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <CompanyYearFieldVariation nameBase={nameBase} field={CompanyBasePatrimonialStatementFields.ActiveNotCurrentTotal}/>
                        </Grid>
                    </Grid>
                 */}
    </Grid>
  );
}

export default CompanyPatrimonialStatementEditActiveNotCurrent;
