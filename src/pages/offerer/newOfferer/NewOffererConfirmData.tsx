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

function NewOffererConfirmData() {
  const classes = NewOffererConfirmDataStyles();
  const {
    confirmedMainData,
    setConfirmedMainData,
    nosisMainData,
    setNosisMainData,
  } = useContext(NewOffererContext);

  const onCuitIncorrect = () => setNosisMainData(undefined);

  const onCuitCorrect = () => setConfirmedMainData(true);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
    >
      {!!nosisMainData && !confirmedMainData && (
        <>
          <Typography variant="h4" className={classes.confirmationCUIT}>
            Confirmación de CUIT:
          </Typography>

          <Typography component="span" className={classes.description}>
            El CUIT
            <Typography component="span" className={classes.descriptionCUIT}>
              {` ${nosisMainData[NosisMainDataResponseFields.Identification]} `}
            </Typography>
            pertenece a:
          </Typography>

          {nosisMainData && (
            <>
              <DataWithLabelPrimary
                label="Razón Social"
                data={nosisMainData[NosisMainDataResponseFields.BusinessName]}
                rowDirection
                labelProps={MainDataToConfirmedLabelProps}
                dataProps={MainDataToConfirmedDataProps}
              />
            </>
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

export default NewOffererConfirmData;
