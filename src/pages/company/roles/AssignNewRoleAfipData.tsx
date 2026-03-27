import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, Grid } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { DefaultStylesButton } from 'components/buttons/Buttons';

import { AssignNewRoleContext } from './AssignNewRoleDialog';

import { HttpPersonNosis } from 'http/index';
import { RequiredCuitSchema } from 'util/validation/validationSchemas';
import { PersonTypes } from 'types/person/personEnums';
import { NosisMainDataResponseFields } from 'types/person/personData';

import AssignNewRoleAfipDataStyles from './AssignNewRoleAfipData.styles';
import { DisclaimerNosis } from 'components/text/DisclaimerNosis';
import { ControlledTextFieldFilled } from 'components/forms';
import { useAction } from 'hooks/useAction';
import {ModuleCodes} from "../../../types/general/generalEnums";

enum AssignNewRoleFields {
  CUIT = 'cuit',
}

type AssignNewRoleData = {
  [AssignNewRoleFields.CUIT]: string;
};

function AssignNewRoleAfipData() {
  const classes = AssignNewRoleAfipDataStyles();
  const { showLoader, hideLoader } = useAction();

  const [error, setError] = useState<string>();
  const { confirmedMainData, nosisMainData, setNosisMainData } =
    useContext(AssignNewRoleContext);

  const newPersonSchema = yup.object().shape({
    [AssignNewRoleFields.CUIT]: RequiredCuitSchema,
  });
  const { control, getValues, handleSubmit } = useForm<AssignNewRoleData>({
    resolver: yupResolver(newPersonSchema),
  });

  const onSubmit = (data: AssignNewRoleData) => {
    setError(undefined);
    showLoader();

    HttpPersonNosis.synchronizeWithNosisMainData(data[AssignNewRoleFields.CUIT], ModuleCodes.CompanyRegistration)
      .then((nosisData) => {
        if (nosisData[NosisMainDataResponseFields.Valid]) {
          if (
            nosisData[NosisMainDataResponseFields.PersonTypeCode] ===
            PersonTypes.Physical
          )
            setNosisMainData(nosisData);
          else setError(`El CUIT no debe pertenecer a una persona jurídica.`);
        } else
          setError(
            `El CUIT: ${getValues(AssignNewRoleFields.CUIT)} no existe.`,
          );

        hideLoader();
      })
      .catch((error) => {
        hideLoader();
        setError(
          `Al parecer ha ocurrido un error, por favor intente nuevamente.`,
        );
      });
  };

  return (
    <form id="assignNewRoleAfipData-form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        {error && (
          <Grid item xs={12}>
            <Alert severity={'error'}>
              {`${error} \n
                                    Por favor ingréselo nuevamente`}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <ControlledTextFieldFilled
            label="CUIT"
            control={control}
            name={AssignNewRoleFields.CUIT}
            fullWidth
            disabled={!!nosisMainData && !confirmedMainData}
          />
        </Grid>

        <Grid item xs={12}>
          <DisclaimerNosis opacity={!!nosisMainData} />
        </Grid>

        <Grid item xs={12} textAlign={'end'}>
          {!nosisMainData && (
            <DefaultStylesButton
              type="submit"
              form="assignNewRoleAfipData-form"
              endIcon={<KeyboardDoubleArrowRightIcon />}
            >
              Enviar
            </DefaultStylesButton>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export default AssignNewRoleAfipData;
