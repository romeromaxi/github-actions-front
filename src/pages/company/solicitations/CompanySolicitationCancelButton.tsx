import React from 'react';
import { DeleteIconButton } from 'components/buttons/Buttons';
import { HttpSolicitation } from 'http/index';
import { useAction } from 'hooks/useAction';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import {DialogAlert} from "../../../components/dialog";

interface CompanySolicitationCancelButtonProps {
  solicitationId: number;
}

function CompanySolicitationCancelButton({
  solicitationId,
}: CompanySolicitationCancelButtonProps) {
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  const onCancel = () => {
    fetchData(
      () => HttpSolicitation.cancelSolicitation(solicitationId),
      true,
    ).then(() => {
      snackbarSuccess('Solicitud cancelada con éxito');
      navigate(-1);
    });
  };

  return (
    <div>
      <DeleteIconButton
        tooltipTitle={'Cancelar solicitud'}
        onClick={() => setShowCancelDialog(true)}
      />

      <DialogAlert open={showCancelDialog}
                   severity={'error'}
                   title={`Cancelar solicitud #${solicitationId}`}
                   textContent={`¿Estás seguro que querés cancelar esta solicitud?`}
                   onClose={() => setShowCancelDialog(false)}
                   onConfirm={onCancel}
                   textConfirm={"Sí, cancelar"}
      >
        Al cancelar la solicitud, esta quedará inactiva y no se podrán realizar operaciones adicionales. 
        Para reactivarla, será necesario enviar una nueva solicitud para la línea.
      </DialogAlert>
    </div>
  );
}

export default CompanySolicitationCancelButton;
