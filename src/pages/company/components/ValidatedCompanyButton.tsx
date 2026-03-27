import React, { Fragment, useState } from 'react';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { Chip, Stack } from '@mui/material';
import { ValidationStatesType } from 'types/person/personEnums';
import { ConfirmButton } from 'components/buttons/Buttons';
import CompanyAfipFormDrawer from './CompanyAfipFormDrawer';
import { useAction } from 'hooks/useAction';
import { EntityWithIdFields } from 'types/baseEntities';

interface ValidatedCompanyButtonProps {
  company: CompanyViewDTO;
  reload: () => void;
}

function ValidatedCompanyButton({
  company,
  reload,
}: ValidatedCompanyButtonProps) {
  const { snackbarSuccess } = useAction();
  const [showValidate, setShowValidate] = useState<boolean>(false);

  const onValidate = () => setShowValidate(true);

  const onCancelValidate = () => setShowValidate(false);

  const onConfirmValidate = () => {
    onCancelValidate();
    reload();
    snackbarSuccess('La validación se envió correctamente');
  };

  const renderElement = () => {
    switch (company[CompanyViewDTOFields.CompanyStateCode]) {
      case ValidationStatesType.CreatedWithoutConfirmation:
      case ValidationStatesType.Returned:
        return (
          <ConfirmButton onClick={onValidate} size="small">
            Validar relación
          </ConfirmButton>
        );

      case ValidationStatesType.PendingValidation:
        return (
          <Chip color="warning" label="Validación a confirmar" size={'small'} />
        );

      case ValidationStatesType.Validated:
        return <Chip color="success" label="Empresa validada" size={'small'} />;

      default:
        return <div></div>;
    }
  };

  return (
    <Fragment>
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        {renderElement()}
      </Stack>

      <CompanyAfipFormDrawer
        companyId={company[EntityWithIdFields.Id]}
        companyName={company[CompanyViewDTOFields.BusinessName]}
        show={showValidate}
        onClose={onCancelValidate}
        onConfirmed={onConfirmValidate}
        inProcess={false}
      />
    </Fragment>
  );
}

export default ValidatedCompanyButton;
