import React, {useMemo, useState} from "react";
import {Button} from "@mui/material";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import useSecurityObject from "hooks/useSecurityObject";
import {OffererSolicitationNavHeaderSecObjects, SecurityComponents} from "types/security";
import {SolicitationFlagsFields, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {userStorage} from "util/localStorage/userStorage";
import {useAction} from "hooks/useAction";
import {DialogAlert} from "components/dialog";
import {
  ActionExecute,
  ActionExecuteFields,
  VariableWorkflow,
  VariableWorkflowFields
} from "types/workflow/actionData";
import {HttpAction, HttpSolicitation} from "http/index";
import useAxios from "hooks/useAxios";
import {EntityWithIdFields} from "types/baseEntities";
import OffererSolicitationAssignmentDialog from "./OffererSolicitationAssignmentDialog";

interface OffererSolicitationAssignmentButtonProps {
  responsibleActionId?: number,
}

function OffererSolicitationAssignmentButton({responsibleActionId}: OffererSolicitationAssignmentButtonProps) {
  const userId = userStorage.getUserId() || 0;
  const {snackbarSuccess} = useAction();
  const {fetchData, fetchAllData} = useAxios();
  const {hasWriteWorkflowPermission} = useSecurityObject();
  const {permissionWorkflowCode, message, solicitation, flags, getSolicitation} = useSolicitation();
  const messageId = message?.[EntityWithIdFields.Id] || 0;
  const solicitationId = solicitation?.[EntityWithIdFields.Id] || 0;
  const offererId = solicitation?.[SolicitationViewDTOFields.OffererId] || 0;
  const responsibleUserId = solicitation?.[SolicitationViewDTOFields.StageResponsibleUserId] || 0;
  const responsibleCommercialUserId = solicitation?.[SolicitationViewDTOFields.CommercialResponsibleUserId] || 0;
  
  const allowStageResponsible = useMemo(() => (
      hasWriteWorkflowPermission(
          permissionWorkflowCode,
          SecurityComponents.OffererSolicitationNavHeader,
          OffererSolicitationNavHeaderSecObjects.AssignmentSolicitationButton
      ) &&
      !!responsibleActionId &&
      responsibleUserId !== userId &&
      !!messageId
  ), [permissionWorkflowCode, responsibleActionId, responsibleUserId, userId, messageId]);

  const allowCommercialResponsible = useMemo(() => (
      hasWriteWorkflowPermission(
          permissionWorkflowCode,
          SecurityComponents.OffererSolicitationNavHeader,
          OffererSolicitationNavHeaderSecObjects.AssignmentResponsibleCommercialSolicitationButton
      ) &&
      flags && flags[SolicitationFlagsFields.SolicitationCommercialResponsibleAsignedAllowed] &&
      responsibleCommercialUserId !== userId
  ), [permissionWorkflowCode, flags, responsibleCommercialUserId, userId]);
    
  const [assignDialog, setAssignDialog] = useState<boolean>(false);

  const showAssingResponsibleDialog = () => setAssignDialog(true);

  const closeAssingResponsibleDialog = () => setAssignDialog(false);

  const showSuccessMessage = () => {
    snackbarSuccess('La solicitud fue asignada con exito');
    setAssignDialog(false);
    if (solicitationId) getSolicitation(solicitationId);
  };

  const actionWorkflowPromise = () => {
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

    return HttpAction.executeAction(responsibleActionId ?? 0, dataExecute);
  };
  
  const assignCommercialResponsiblePromise = () => 
    HttpSolicitation.assignCommercialResponsible(offererId, solicitationId);
  
  const onConfirmUniqueResponsible = () => {
    if (allowStageResponsible)
      fetchData(actionWorkflowPromise, true)
        .then(showSuccessMessage);
    else if (allowCommercialResponsible)
      fetchData(assignCommercialResponsiblePromise, true)
        .then(showSuccessMessage);
  }
  
  const onConfirmMultiple = (stage: boolean, commercial: boolean) => {
    if (!stage && !commercial) {
      closeAssingResponsibleDialog();
      return;
    }
    
    const promises = [];
    
    if (stage) promises.push(actionWorkflowPromise())
    
    if (commercial) promises.push(assignCommercialResponsiblePromise())

    fetchAllData(promises, true)
      .then(showSuccessMessage);
  }
  
  return (
    <React.Fragment>
      {
        (allowStageResponsible || allowCommercialResponsible) &&
          <Button variant={'contained'} size={'small'} 
                  onClick={showAssingResponsibleDialog}
          >
            Asignarme Solicitud
          </Button>
      }

      <DialogAlert
        onClose={closeAssingResponsibleDialog}
        open={assignDialog && (!allowStageResponsible || !allowCommercialResponsible)}
        textContent={`¿Estás seguro que querés asignarte la solicitud #${solicitationId}?`}
        onConfirm={onConfirmUniqueResponsible}
        hideTitle
      />
      
      <OffererSolicitationAssignmentDialog
        onClose={closeAssingResponsibleDialog}
        open={assignDialog && allowStageResponsible && !!allowCommercialResponsible}
        title={`Asignarme solicitud #${solicitationId}`}
        onConfirm={onConfirmMultiple}
      />
      
    </React.Fragment>
  )
}

export default OffererSolicitationAssignmentButton;