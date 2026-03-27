import React, { useState } from 'react';
import { Button } from '@mui/material';
import { EntityWithIdFields } from 'types/baseEntities';
import { useAction } from 'hooks/useAction';
import { HttpAction, HttpSolicitation } from 'http/index';
import { SolicitationViewDTOFields } from 'types/solicitations/solicitationData';
import useAxios from 'hooks/useAxios';
import {
  ActionExecute,
  ActionExecuteFields,
  VariableWorkflow,
  VariableWorkflowFields,
} from 'types/workflow/actionData';
import { DialogAlert } from '../../../../components/dialog';
import { userStorage } from '../../../../util/localStorage/userStorage';
import {useSolicitation} from "../../../../hooks/contexts/SolicitationsContext";

interface OffererSolicitationResponsibleButtonProps {
  actionId: number;
  disabled?: boolean;
}

const OffererSolicitationResponsibleButton = ({
  actionId,
  disabled,
}: OffererSolicitationResponsibleButtonProps) => {
  const { solicitation } = useSolicitation();
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();

  const solicitationId = solicitation?.[EntityWithIdFields.Id] || 0;
  const offererId = solicitation?.[SolicitationViewDTOFields.OffererId] || 0;
  const messageId = solicitation?.[SolicitationViewDTOFields.MessageId] || 0;
  const responsibleUserId =
    solicitation?.[SolicitationViewDTOFields.StageResponsibleUserId];
  const userId = userStorage.getUserId() ?? 0;
  const isNewSolicitation = !responsibleUserId;

  const [assignDialog, setAssignDialog] = useState<boolean>(false);

  const showSuccessMessage = () => {
    snackbarSuccess('La solicitud fue asignada con exito');
    setAssignDialog(false);
    window.location.reload();
  };

  const executeActionWorkflow = () => {
    const dataExecute: ActionExecute = {
      [ActionExecuteFields.MessageId]: messageId,
      [ActionExecuteFields.WorkflowVariables]: [
        {
          [VariableWorkflowFields.Name]: 'intIdUsuarioResponsable',
          [VariableWorkflowFields.IntegerValue]: userId,
        } as VariableWorkflow,
      ],
      [ActionExecuteFields.Observations]: '',
    } as ActionExecute;

    fetchData(() => HttpAction.executeAction(actionId, dataExecute), true).then(
      showSuccessMessage,
    );
  };

  const showAssingResponsibleDialog = () => setAssignDialog(true);

  const closeAssingResponsibleDialog = () => setAssignDialog(false);

  return (
    <>
      {!disabled && (isNewSolicitation || responsibleUserId !== userId) && (
        <Button
          variant={'contained'}
          size={'small'}
          onClick={showAssingResponsibleDialog}
        >
          Asignarme Solicitud
        </Button>
      )}
      <DialogAlert
        onClose={closeAssingResponsibleDialog}
        open={assignDialog}
        textContent={`¿Estás seguro que querés asignarte la solicitud #${solicitationId}?`}
        onConfirm={executeActionWorkflow}
        hideTitle
      />
      {/*
                <OffererSolicitationResponsibleDialog open={assignDialog}
                                                      solicitationId={solicitationId}
                                                      offererId={offererId}
                                                      onClose={closeAssingResponsibleDialog}
                                                      onSubmit={handleAssign}
                />
                 */}
    </>
  );
};

export default OffererSolicitationResponsibleButton;
