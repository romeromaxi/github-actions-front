import React, { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { LoaderBlockUI } from 'components/loader';
import { SubTitle } from 'components/text/SubTitle';
import DrawerBase from 'components/misc/DrawerBase';
import {ControlledTextFieldFilled} from 'components/forms';
import { DefaultStylesButton } from 'components/buttons/Buttons';


import { HttpCompanyFinance } from 'http/index';
import { RequiredPositiveNumberSchema } from 'util/validation/validationSchemas';
import { useAction } from 'hooks/useAction';
import {FinancialYearFields, FinancialYearInsert} from "../../../types/general/generalFinanceData";

interface CompanyFinancialDrawerProps {
  show: boolean;
  companyId: number;
  onCloseDrawer: () => void;
  onFinishProcess: (newFinancialYear: number) => void;
}

function CompanyFinancialDrawer(props: CompanyFinancialDrawerProps) {
  const { snackbarError, snackbarSuccess } = useAction();
  const [isLoading, setLoading] = useState<boolean>(false);

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

  const onHandleSubmitClose = (newFinancialYear: number) => {
    setLoading(false);
    props.onFinishProcess(newFinancialYear);
    reset({
      [FinancialYearFields.Year]: undefined,
    });
    snackbarSuccess('El estado contable se ha creado con éxito');
  };

  const onHandleSubmit = (data: FinancialYearInsert) => {
    setLoading(true);

    HttpCompanyFinance.insert(props.companyId, data)
      .then(onHandleSubmitClose)
      .catch(() => {
        setLoading(false);
        snackbarError('Al parecer ha ocurrido un error.');
      });
  };

  return (
    <DrawerBase
      show={props.show}
      title="Ejercicio"
      onCloseDrawer={onCloseSubmit}
    >
      <SubTitle text="Año al que corresponde la carga:" />

      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          mt={2}
        >
          <ControlledTextFieldFilled
            control={control}
            name={FinancialYearFields.Year}
            label="Año Cierre"
          />

          <DefaultStylesButton
            type="submit"
            endIcon={<KeyboardDoubleArrowRightIcon />}
          >
            Cargar
          </DefaultStylesButton>
        </Stack>
      </form>

      {isLoading && <LoaderBlockUI />}
    </DrawerBase>
  );
}

export default CompanyFinancialDrawer;
