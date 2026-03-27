import { Disclaimer } from '../text/Disclaimer';
import { DialogAlertLUC } from './DialogAlertLUC';
import React from 'react';

interface DialogAlertBuildingLUCProps {
  open: boolean;
  onClose: () => void;
}

const DialogAlertBuildingLUC = ({
  open,
  onClose,
}: DialogAlertBuildingLUCProps) => {
  return (
    <DialogAlertLUC
      open={open}
      title={'Sección en construcción'}
      children={
        <Disclaimer
          fontSize={'13px'}
          text={
            'La página a la que intenta acceder se encuentra en desarrollo. Lamentamos los inconvenientes y agradecemos su comprensión.'
          }
        />
      }
      onClose={onClose}
    />
  );
};

export default DialogAlertBuildingLUC;
