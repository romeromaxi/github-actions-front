import React, { ReactElement } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {AppConfigFields, AppConfigLogosFields} from "types/appConfigEntities";

interface DialogAlertLUCProps {
  open: boolean;
  title?: string;
  children?: ReactElement | ReactElement[];
  actions?: ReactElement | ReactElement[];
  onClose: () => void;
}

function DialogAlertLUC({
  open,
  title,
  children,
  actions,
  onClose,
}: DialogAlertLUCProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Stack direction={'row'} justifyContent={'end'}>
          <IconButton onClick={onClose} color={'default'}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Stack spacing={3}>
              <Box
                component={'img'}
                sx={{
                  height: 50,
                  width: 100,
                  m: '0 auto !important',
                }}
                src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
              />
              {
                title &&
                <Typography fontSize={20} fontWeight={600} textAlign={'center'}>
                  {title}
                </Typography>
              }
            </Stack>
          </Grid>
          {!!children && (
            <Grid item xs={12} textAlign={'center'}>
              {children}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      {!!actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}

export { DialogAlertLUC };
