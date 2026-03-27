import React, { useState } from 'react';
import { Button } from '@mui/material';
import { DeleteTwoTone } from '@mui/icons-material';

import useAxios from 'hooks/useAxios';
import { useAction } from 'hooks/useAction';
import { DialogAlert } from 'components/dialog';
import { HttpOffererProductLine } from 'http/index';

interface ProductLineDeleteButtonProps {
  lineId: number;
  offererId: number;
}

function ProductLineDeleteButton({
  lineId,
  offererId,
}: ProductLineDeleteButtonProps) {
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();

  const [
    showUnsubscribePublicationDialog,
    setShowUnsubscribePublicationDialog,
  ] = useState<boolean>(false);

  const onShowUnsubscribePublication = () =>
    setShowUnsubscribePublicationDialog(true);

  const onCloseAlertUnsubscribe = () =>
    setShowUnsubscribePublicationDialog(false);

  const onSubmitAlertUnsubscribe = () => {
    fetchData(
      () => HttpOffererProductLine.unsubscribePublication(offererId, lineId),
      true,
    ).then(() => {
      setShowUnsubscribePublicationDialog(false);
      snackbarSuccess(
        'La publicación de la línea se ha dado de baja exitosamente',
      );
      window.location.reload();
    });
  };

  return (
    <>
      <Button
        variant={'outlined'}
        size={'small'}
        color={'error'}
        sx={{ whiteSpace: 'nowrap' }}
        startIcon={<DeleteTwoTone />}
        onClick={onShowUnsubscribePublication}
      >
        Solicitar Baja
      </Button>

      <DialogAlert
        open={showUnsubscribePublicationDialog}
        onClose={onCloseAlertUnsubscribe}
        onConfirm={onSubmitAlertUnsubscribe}
        textContent={'¿Estás seguro de que deseás solicitar la baja de la publicación de la línea? La línea se eliminará automáticamente de la tienda y si la querés recuperar deberás darla de alta nuevamente.'}
      />
    </>
  );
}

export default ProductLineDeleteButton;
