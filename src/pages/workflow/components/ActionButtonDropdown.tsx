import React, { useEffect, useState } from 'react';
import { PublishedWithChangesTwoTone } from '@mui/icons-material';
import { ButtonDropdown, MenuItemDropdown } from 'components/buttons/Buttons';
import { Skeleton } from '@mui/lab';
import { HttpAction } from 'http/index';
import {
  ActionExecute,
  ActionExecuteFields,
  ActionFields,
  ActionView,
} from 'types/workflow/actionData';
import { DialogAlert } from 'components/dialog';
import useAxios from 'hooks/useAxios';
import { EntityWithIdFields } from 'types/baseEntities';
import { useAction } from 'hooks/useAction';
import { DialogAlertObservations } from 'components/dialog/DialogAlertObservations';
import { ApprovalActionTypes } from 'types/workflow/actionEnums';

interface ActionButtonDropdownProps {
  stageId: number;
  messageId: number;
}

function ActionButtonDropdown({
  stageId,
  messageId,
}: ActionButtonDropdownProps) {
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();

  const [menuItems, setMenuItems] = useState<MenuItemDropdown[]>();
  const [actionToExecuted, setActionToExecuted] = useState<ActionView>();

  const onCancelExecute = () => setActionToExecuted(undefined);

  const onConfirmExecute = (observations: string | undefined = undefined) => {
    if (!!actionToExecuted) {
      const dataExecute: ActionExecute = {
        [ActionExecuteFields.MessageId]: messageId,
        [ActionExecuteFields.WorkflowVariables]: [],
        [ActionExecuteFields.Observations]: observations,
      } as ActionExecute;
      fetchData(
        () =>
          HttpAction.executeAction(
            actionToExecuted[EntityWithIdFields.Id],
            dataExecute,
          ),
        true,
      ).then(() => {
        snackbarSuccess(
          `La acción de ${actionToExecuted[ActionFields.ActionName]} se ha ejecutado correctamente!`,
        );
        window.location.reload();
      });
    }
  };

  useEffect(() => {
    setMenuItems(undefined);
    HttpAction.getActionsByCurrentStage(stageId).then(
      (actions: ActionView[]) => {
        let items: MenuItemDropdown[] = actions
          .filter((x) => !x[ActionFields.IsInternalAction])
          .map((x) => {
            return {
              label: x[ActionFields.ActionName],
              onClick: () => setActionToExecuted(x),
            } as MenuItemDropdown;
          });

        setMenuItems(items);
      },
    );
  }, [stageId]);

  return (
    <>
      {menuItems ? (
        menuItems.length ? (
          <ButtonDropdown
            label={'Acciones'}
            startIcon={<PublishedWithChangesTwoTone />}
            items={menuItems}
            color={'inherit'}
            size={'small'}
          />
        ) : (
          <></>
        )
      ) : (
        <Skeleton width={'7rem'} />
      )}

      {actionToExecuted ? (
        actionToExecuted[ActionFields.TypeApprovalActionCode] ==
        ApprovalActionTypes.RequiresComments ? (
          <DialogAlertObservations
            open={!!actionToExecuted}
            onClose={onCancelExecute}
            onConfirm={onConfirmExecute}
            textAlert={`Por favor, complete las observaciones relacionadas a la ejecución de la acción de ${actionToExecuted[ActionFields.ActionName]}`}
          />
        ) : (
          <DialogAlert
            open={!!actionToExecuted}
            onClose={onCancelExecute}
            onConfirm={() => onConfirmExecute('')}
            textContent={`Está seguro que desea ejecutar la acción de ${actionToExecuted[ActionFields.ActionName]}?`}
          />
        )
      ) : (
        <></>
      )}
    </>
  );
}

export default ActionButtonDropdown;
