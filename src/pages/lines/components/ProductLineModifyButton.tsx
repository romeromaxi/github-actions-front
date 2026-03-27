import React, { useState } from 'react';
import { Button } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import useAxios from 'hooks/useAxios';
import { DialogAlert } from 'components/dialog';
import { HttpAction, HttpProductLine } from 'http/index';
import { ActionExecute, ActionExecuteFields } from 'types/workflow/actionData';

interface ProductLineModifyButtonProps {
  lineId: number;
  messageId: number;
}

function ProductLineModifyButton({
  lineId,
  messageId,
}: ProductLineModifyButtonProps) {
  const { fetchData } = useAxios();

  const [showEditConfirmationDialog, setShowEditConfirmationDialog] =
    useState<boolean>(false);

  const onShowAlertEditConfirmation = () => setShowEditConfirmationDialog(true);

  const onCloseAlertEditConfirmation = () =>
    setShowEditConfirmationDialog(false);

  const onSubmitAlertEditConfirmation = () => {
    if (messageId) {
      const dataExecute: ActionExecute = {
        [ActionExecuteFields.MessageId]: messageId,
        [ActionExecuteFields.WorkflowVariables]: [],
        [ActionExecuteFields.Observations]: '',
      } as ActionExecute;
      fetchData(() => HttpAction.executeAction(34, dataExecute), true).then(
        () => {
          fetchData(
            () => HttpProductLine.getActualProductLineId(lineId),
            true,
          ).then((newProductLineId: number) => {
            if (newProductLineId != lineId) {
              const newUrl = window.location.pathname.replace(
                `${lineId}`,
                `${newProductLineId}`,
              );
              window.history.replaceState({}, '', newUrl);
            }

            window.location.reload();
          });
        },
      );
    }
  };

  return (
    <>
      <Button
        variant={'contained'}
        size={'small'}
        sx={{ whiteSpace: 'nowrap' }}
        startIcon={<EditOutlinedIcon />}
        onClick={onShowAlertEditConfirmation}
      >
        Modificar
      </Button>

      <DialogAlert
        open={showEditConfirmationDialog}
        onClose={onCloseAlertEditConfirmation}
        onConfirm={onSubmitAlertEditConfirmation}
        textContent={'¿Estás seguro que deseás modificar la línea publicada?'}
      />
    </>
  );
}

export default ProductLineModifyButton;
