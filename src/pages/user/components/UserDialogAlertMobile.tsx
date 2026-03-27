import React from 'react';
import {Button, Typography} from '@mui/material';
import { DialogAlertLUC } from 'components/dialog/DialogAlertLUC';

interface UserDialogAlertMobileProps {
  open: boolean;
  onClose: () => void;
}

function UserDialogAlertMobile({ open, onClose }: UserDialogAlertMobileProps) {
  return (
      <DialogAlertLUC open={open}
                      title={'Mejor en escritorio'}
                      onClose={onClose}
                      actions={<Button variant='contained' size='small' onClick={onClose}>Entendido</Button>}
      >
          <Typography fontSize={13} color={'text.disabled'} textAlign={'center'}>
              Podés seguir usando LUC en tu dispositivo móvil, pero tendrás una mejor experiencia si lo haces en la versión de escritorio, desde una notebook o PC
          </Typography>
      </DialogAlertLUC>
  );
}

export default UserDialogAlertMobile;
