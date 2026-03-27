import React, { useContext } from 'react';
import { Grid } from '@mui/material';

import ConfirmationCuit from 'components/text/ConfirmationCuit';

import { PersonFields } from 'types/person/personData';
import { NewRelatedPersonContext } from './NewRelatedPersonDialog';

function NewRelatedPersonConfirmData() {
  const {
    personData,
    setPersonData,
    confirmedPersonData,
    setConfirmedPersonData,
  } = useContext(NewRelatedPersonContext);

  const onCuitIncorrect = () => setPersonData(undefined);

  const onCuitCorrect = () => setConfirmedPersonData(true);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        {!!personData && !confirmedPersonData && (
          <ConfirmationCuit
            cuit={personData[PersonFields.CUIT]}
            legalName={personData[PersonFields.LegalName]}
            onCuitCorrect={onCuitCorrect}
            onCuitIncorrect={onCuitIncorrect}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default NewRelatedPersonConfirmData;
