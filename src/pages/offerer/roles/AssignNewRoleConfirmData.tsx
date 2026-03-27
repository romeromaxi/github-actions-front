import React, { useContext } from 'react';
import { Grid } from '@mui/material';

import { AssignNewRoleContext } from './AssignNewOffererRoleDrawer';
import ConfirmationCuit from 'components/text/ConfirmationCuit';
import { NosisMainDataResponseFields } from 'types/person/personData';

function AssignNewRoleConfirmData() {
  const {
    confirmedMainData,
    setConfirmedMainData,
    nosisMainData,
    setNosisMainData,
  } = useContext(AssignNewRoleContext);

  const onCuitIncorrect = () => setNosisMainData(undefined);

  const onCuitCorrect = () => setConfirmedMainData(true);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        {!!nosisMainData && !confirmedMainData && (
          <ConfirmationCuit
            cuit={nosisMainData[NosisMainDataResponseFields.Identification]}
            legalName={nosisMainData[NosisMainDataResponseFields.BusinessName]}
            onCuitCorrect={onCuitCorrect}
            onCuitIncorrect={onCuitIncorrect}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default AssignNewRoleConfirmData;
