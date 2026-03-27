import React, {Fragment, useContext} from 'react';

import { NosisMainDataResponseFields } from 'types/person/personData';

import { AssignNewRoleContext } from './AssignNewRoleDrawer';

import ConfirmationCuit from 'components/text/ConfirmationCuit';

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
      <Fragment>
        {!!nosisMainData && !confirmedMainData && (
          <ConfirmationCuit
            cuit={nosisMainData[NosisMainDataResponseFields.Identification]}
            legalName={nosisMainData[NosisMainDataResponseFields.BusinessName]}
            onCuitCorrect={onCuitCorrect}
            onCuitIncorrect={onCuitIncorrect}
          />
        )}
      </Fragment>
  );
}

export default AssignNewRoleConfirmData;
