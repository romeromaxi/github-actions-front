import React from 'react';
import {
  Grid,
  Typography,
} from '@mui/material';
import { Offerer, OffererFields } from 'types/offerer/offererData';
import OffererLogo from '../../offerer/components/OffererLogo';
import { EntityWithIdFields } from 'types/baseEntities';
import { useAction } from 'hooks/useAction';
import { HttpOffererLogo } from 'http/offerer/httpOffererLogo';
import DrawerBase from "components/misc/DrawerBase";

interface OffererLogoUpdateDialogProps {
  offerer?: Offerer;
  onCloseDialog: () => void;
}

function OffererLogoUpdateDialog({
  offerer,
  onCloseDialog,
}: OffererLogoUpdateDialogProps) {
  const { showLoader, hideLoader } = useAction();

  const handleClose = () => {
    onCloseDialog();
  };

  const handleSubmit = (file: File) => {
    if (offerer) {
      showLoader();

      HttpOffererLogo.update(offerer[EntityWithIdFields.Id], file)
        .then(() => handleClose())
        .finally(() => hideLoader());
    }
  };

  return (
    <DrawerBase show={!!offerer}
                title={'Modificar Logo'}
                onCloseDrawer={handleClose}
    >
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography fontSize={18} fontWeight={600}>
                    {offerer?.[OffererFields.BusinessName]}
                </Typography>
            </Grid>
            <Grid item xs={12} display={'grid'} justifyContent={'center'}>
                <OffererLogo offererId={offerer?.[EntityWithIdFields.Id] ?? 0}
                             onSaveLogo={handleSubmit}
                             size={140}
                />
            </Grid>
        </Grid>
    </DrawerBase>
  );
}

export default OffererLogoUpdateDialog;
