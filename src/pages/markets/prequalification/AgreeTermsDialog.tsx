import React from 'react';
import {DialogAlert} from "components/dialog";
import {useSolicitationCheckoutSteps} from "hooks/useSolicitationCheckoutSteps";

interface AgreeTermsDialogProps {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
}

const AgreeTermsDialog = ({
  open,
  onClose,
  onClick,
}: AgreeTermsDialogProps) => {
  const { agreeTerms } = useSolicitationCheckoutSteps();
  
  const handleClick = () => {
    onClick();
    onClose();
  };
  
  return (
      <DialogAlert open={open} 
                   onClose={onClose}
                   title={'Confirmar envío de solicitud'}
                   textContent={agreeTerms}
                   onConfirm={handleClick}
      />
  );
};

export default AgreeTermsDialog;
