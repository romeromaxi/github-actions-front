import React from 'react';
import { Dialog, DialogContent, Grid } from '@mui/material';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';

import CompanyAfipActivityList from './CompanyAfipActivityList';
import { CompanyAfipActivityView } from '../../../types/company/companyActivityData';
import {PublicEntityEnums} from "../../../util/typification/publicEntityEnums";

interface CompanyAfipActivityDialogProps {
  open: boolean;
  companyId: number;
  action?: (act: CompanyAfipActivityView) => void;
  onClose: () => void;
}

function CompanyAfipActivityDialog(props: CompanyAfipActivityDialogProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <BaseDialogTitle
        title={`Actividades registradas en ${PublicEntityEnums.ARCA}`}
        subtitle="Elegí cual querés asociar al legajo"
        onClose={props.onClose}
      />

      <DialogContent>
        <Grid container item xs={12}>
          <CompanyAfipActivityList
            companyId={props.companyId}
            action={props.action}
            viewActions
          />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default CompanyAfipActivityDialog;
