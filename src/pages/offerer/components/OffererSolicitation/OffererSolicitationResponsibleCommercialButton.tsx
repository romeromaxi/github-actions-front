import React, { useState } from 'react';
import { Button } from '@mui/material';
import { DialogAlert } from 'components/dialog';
import useAxios from 'hooks/useAxios';
import { useAction } from 'hooks/useAction';
import { HttpSolicitation } from 'http/index';
import { userStorage } from 'util/localStorage/userStorage';
import { EntityWithIdFields } from 'types/baseEntities';
import { SolicitationViewDTOFields } from 'types/solicitations/solicitationData';
import {useSolicitation} from "../../../../hooks/contexts/SolicitationsContext";

interface OffererSolicitationResponsibleCommercialButtonProps {
  disabled?: boolean;
}

function OffererSolicitationResponsibleCommercialButton({
  disabled,
}: OffererSolicitationResponsibleCommercialButtonProps) {
  const { solicitation } = useSolicitation();
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();

  const solicitationId = solicitation?.[EntityWithIdFields.Id] || 0;
  const offererId = solicitation?.[SolicitationViewDTOFields.OffererId] || 0;
  const responsibleUserId =
    solicitation?.[SolicitationViewDTOFields.CommercialResponsibleUserId];
  const userId = userStorage.getUserId() || 0;

  const [assignDialog, setAssignDialog] = useState<boolean>(false);

  const showSuccessMessage = () => {
    snackbarSuccess('La solicitud fue asignada con exito');
    setAssignDialog(false);
    window.location.reload();
  };

  const handleAssign = () =>
    fetchData(
      () =>
        HttpSolicitation.assignCommercialResponsible(offererId, solicitationId),
      true,
    ).then(showSuccessMessage);

  const showAssingResponsibleDialog = () => setAssignDialog(true);

  const closeAssingResponsibleDialog = () => setAssignDialog(false);

  return (
    <>
      {!!userId && userId !== responsibleUserId && (
        <Button
          variant={'contained'}
          size={'small'}
          onClick={showAssingResponsibleDialog}
          disabled={disabled}
        >
          Asignar Comercial
        </Button>
      )}

      <DialogAlert
        open={assignDialog}
        textContent={`¿Estás seguro que querés asignarte la solicitud #${solicitationId}?`}
        onClose={closeAssingResponsibleDialog}
        onConfirm={handleAssign}
        hideTitle
      />
    </>
  );
}

export default OffererSolicitationResponsibleCommercialButton;
