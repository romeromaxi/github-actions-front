import React, { Fragment, useContext } from 'react';
import { InternalUserNewContext } from './InternalUserNewDrawer';
import { NosisMainDataResponseFields } from '../../../types/person/personData';
import ConfirmationCuit from '../../../components/text/ConfirmationCuit';
import { LoaderBlockUI } from "../../../components/loader";

function InternalUserNewConfirmData() {
  const {
    confirmedMainData,
    setConfirmedMainData,
    nosisMainData,
    setNosisMainData,
    loadingNosis,
  } = useContext(InternalUserNewContext);

  const onCuitIncorrect = () => setNosisMainData(undefined);

  const onCuitCorrect = () => setConfirmedMainData(true);

  if (!!nosisMainData && confirmedMainData && loadingNosis) {
    return (
      <LoaderBlockUI />
    );
  }

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

export default InternalUserNewConfirmData;

