import React, {useContext} from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {SendButton} from 'components/buttons/Buttons';

import { RequiredPositiveNumberSchema } from 'util/validation/validationSchemas';

import { ControlledTextFieldFilled } from 'components/forms';
import DrawerBase from "../../../components/misc/DrawerBase";
import {BalancesContext} from "../../../hooks/contexts/BalancesContext";
import {FinancialYearFields, FinancialYearInsert} from "../../../types/general/generalFinanceData";

interface FinancialDrawerNewProps {
  open: boolean;
  onCloseDrawer: () => void;
  onAfterSubmit: (year:number) => void;
  customHandleNew?: (data: FinancialYearInsert) => void;
}

function FinancialDrawerNew(props: FinancialDrawerNewProps) {
  const { handleNew } = useContext(BalancesContext)

  const newCompanyFinancialYearSchema = yup.object().shape({
    [FinancialYearFields.Year]: RequiredPositiveNumberSchema,
  });

  const { control, reset, handleSubmit } = useForm<FinancialYearInsert>({
    resolver: yupResolver(newCompanyFinancialYearSchema),
  });

  const onCloseSubmit = () => {
    reset({
      [FinancialYearFields.Year]: undefined,
    });
    props.onCloseDrawer();
  };

  const onHandleSubmit = (data: FinancialYearInsert) => {
    props.customHandleNew ? props.customHandleNew(data) : handleNew(data)
    onCloseSubmit()
    props.onAfterSubmit(data[FinancialYearFields.Year])
  };

  return (
    <DrawerBase show={props.open} 
                onCloseDrawer={onCloseSubmit} 
                title={'Nuevo estado contable'}
                action={
                  <SendButton form='new-financial-year-drawer-form'
                              type='submit'
                              id={"entity-financial-year-drawer-new-btn"}
                              onClick={(e) => e.stopPropagation()}
                  >
                    Crear
                  </SendButton>
                }
                aboveDialogs
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onHandleSubmit)(e)
      }} id={'new-financial-year-drawer-form'}>
        <ControlledTextFieldFilled
          control={control}
          name={FinancialYearFields.Year}
          label="Año del ejercicio"
          helperText={'Formato YYYY'}
        />
      </form>
    </DrawerBase>
  );
}

export default FinancialDrawerNew;
