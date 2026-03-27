import React from 'react';
import { Dialog, DialogContent, Grid } from '@mui/material';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import CompanySolicitationsList from './CompanySolicitationsList';

interface CompanySolicitationsDialogListProps {
  open: boolean;
  companyId: number;
  onClose: () => void;
}

function CompanySolicitationsDialogList(
  props: CompanySolicitationsDialogListProps,
) {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="lg" fullWidth>
      <BaseDialogTitle title="Solicitudes" onClose={props.onClose} />

      <DialogContent>
        <Grid container item xs={12}>
          <CompanySolicitationsList companyId={props.companyId} />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default CompanySolicitationsDialogList;
