import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, Stack } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { ControlledTextFieldFilled } from 'components/forms';
import { DefaultStylesButton } from 'components/buttons/Buttons';

import { NewOffererContext } from './NewOffererDrawer';

import { HttpPersonNosis } from 'http/index';
import { RequiredCuitSchema } from 'util/validation/validationSchemas';
import { PersonTypes } from 'types/person/personEnums';
import { NosisMainDataResponseFields } from 'types/person/personData';

import NewOffererAfipDataStyles from './NewOffererAfipData.styles';
import { DisclaimerNosis } from 'components/text/DisclaimerNosis';
import {ModuleCodes} from "../../../types/general/generalEnums";

enum NewOffererFields {
  CUIT = 'cuit',
}

type NewOffererData = {
  [NewOffererFields.CUIT]: string;
};

function NewOffererAfipData() {
  const classes = NewOffererAfipDataStyles();

  const [error, setError] = useState<string>();
  const { confirmedMainData, setLoading, nosisMainData, setNosisMainData } =
    useContext(NewOffererContext);

  const newPersonSchema = yup.object().shape({
    [NewOffererFields.CUIT]: RequiredCuitSchema,
  });
  const { control, getValues, handleSubmit } = useForm<NewOffererData>({
    resolver: yupResolver(newPersonSchema),
  });

  const onSubmit = (data: NewOffererData) => {
    setError(undefined);
    setLoading(true);

    HttpPersonNosis.synchronizeWithNosisMainData(data[NewOffererFields.CUIT], ModuleCodes.UserRegistration)
      .then((nosisData) => {
        if (nosisData[NosisMainDataResponseFields.Valid]) {
          if (
            nosisData[NosisMainDataResponseFields.PersonTypeCode] ===
            PersonTypes.Legal
          )
            setNosisMainData(nosisData);
          else setError(`El CUIT no debe pertenecer a una persona humana.`);
        } else
          setError(`El CUIT: ${getValues(NewOffererFields.CUIT)} no existe.`);

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(`El CUIT: ${getValues(NewOffererFields.CUIT)} no existe.`);
      });
  };

  return (
    <form id="assignNewRoleAfipData-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        mt={2}
      >
        {error && (
          <Alert severity={'error'}>
            {`${error} \n
                            Por favor ingréselo nuevamente`}
          </Alert>
        )}

        <ControlledTextFieldFilled
          label="CUIT"
          control={control}
          name={NewOffererFields.CUIT}
          fullWidth
          disabled={!!nosisMainData && !confirmedMainData}
          className={clsx('', {
            [classes.opacity]: !!nosisMainData,
          })}
        />

        <DisclaimerNosis opacity={!!nosisMainData} />

        {!nosisMainData && (
          <DefaultStylesButton
            type="submit"
            form="assignNewRoleAfipData-form"
            endIcon={<KeyboardDoubleArrowRightIcon />}
          >
            Enviar
          </DefaultStylesButton>
        )}
      </Stack>
    </form>
  );
}

export default NewOffererAfipData;
