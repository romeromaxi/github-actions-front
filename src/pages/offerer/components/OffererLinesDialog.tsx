import {
  SolicitationTotalsView,
  SolicitationTotalsViewFields,
} from '../../../types/solicitations/solicitationData';
import BaseDialogTitle from '../../../components/dialog/BaseDialogTitle';
import {
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import { EntityWithIdAndDescriptionFields } from '../../../types/baseEntities';

interface OffererLinesDialogProps {
  open: boolean;
  data: SolicitationTotalsView[];
  onClose: () => void;
}

export const OffererLinesDialog = (props: OffererLinesDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <BaseDialogTitle
        title={`Total de solicitudes por linea`}
        onClose={props.onClose}
      />

      <DialogContent>
        <Grid container item xs={12}>
          <Grid item xs={9}>
            <Typography fontSize={16} fontWeight={600} color={'#7e8299'}>
              Linea
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              fontSize={16}
              fontWeight={600}
              color={'#7e8299'}
              textAlign={'center'}
            >
              Total
            </Typography>
          </Grid>
          <Grid item xs={12} pt={1}>
            <Divider />
          </Grid>
          {props.data.map((lineData) => (
            <Grid container spacing={2} alignItems={'center'} pt={1} pb={1}>
              <Grid item xs={9}>
                <Typography
                  sx={{ textTransform: 'capitalize', textAlign: 'left' }}
                  fontWeight={600}
                >
                  {lineData[EntityWithIdAndDescriptionFields.Description]}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography textAlign={'center'} fontWeight={600} fontSize={15}>
                  {`${lineData[SolicitationTotalsViewFields.SolicitationsQuantity] === 1 ? `${lineData[SolicitationTotalsViewFields.SolicitationsQuantity]} solicitud` : `${lineData[SolicitationTotalsViewFields.SolicitationsQuantity]} solicitudes`}`}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default OffererLinesDialog;
