import React, { useContext } from 'react';
import { Stack, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

import { DataWithLabelPrimary } from 'components/misc/DataWithLabel';
import { DefaultStylesButton } from 'components/buttons/Buttons';

import { NosisMainDataResponseFields } from 'types/person/personData';

import { NewOffererContext } from './NewOffererDrawer';

import NewOffererConfirmDataStyles, {
  MainDataToConfirmedLabelProps,
  MainDataToConfirmedDataProps,
} from './NewOffererConfirmData.styles';

function NewOffererUserConfirmData() {
  const classes = NewOffererConfirmDataStyles();
  const {
    confirmedUserData,
    setConfirmedUserData,
    nosisUserData,
    setNosisUserData,
  } = useContext(NewOffererContext);

  const onCuitIncorrect = () => setNosisUserData(undefined);

  const onCuitCorrect = () => setConfirmedUserData(true);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
    >
      {!!nosisUserData && !confirmedUserData && (
        <>
          <Typography variant="h4" className={classes.confirmationCUIT}>
            Confirmación de CUIT:
          </Typography>

          <Typography component="span" className={classes.description}>
            El CUIT
            <Typography component="span" className={classes.descriptionCUIT}>
              {` ${nosisUserData[NosisMainDataResponseFields.Identification]} `}
            </Typography>
            pertenece a:
          </Typography>

          {nosisUserData && (
            <DataWithLabelPrimary
              label="Razón Social"
              data={nosisUserData[NosisMainDataResponseFields.BusinessName]}
              rowDirection
              labelProps={MainDataToConfirmedLabelProps}
              dataProps={MainDataToConfirmedDataProps}
            />
          )}

          <Stack direction="row" justifyContent="space-around" spacing={7}>
            <DefaultStylesButton
              startIcon={<MarkEmailReadOutlinedIcon />}
              onClick={onCuitCorrect}
            >
              Confirmar CUIT
            </DefaultStylesButton>
            
            <DefaultStylesButton
                startIcon={<EditOutlinedIcon />}
                onClick={onCuitIncorrect}
            >
              CUIT Incorrecto
            </DefaultStylesButton>
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default NewOffererUserConfirmData;
