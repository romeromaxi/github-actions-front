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
import OffererLogo from '../../offerer/components/OffererLogo';
import { EntityWithIdAndDescriptionFields } from '../../../types/baseEntities';

interface CompanyOffererLinesStatsDialogProps {
  open: boolean;
  data: SolicitationTotalsView[];
  onClose: () => void;
}

const CompanyOffererLinesStatsDialog = (
  props: CompanyOffererLinesStatsDialogProps,
) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <BaseDialogTitle
        title={`${props.data.length} Oferentes contactados`}
        onClose={props.onClose}
      />

      <DialogContent>
        <Grid container item xs={12}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6.5}>
            <Typography fontSize={16} fontWeight={600} color={'#7e8299'}>
              Oferente
            </Typography>
          </Grid>
          <Grid item xs={2.5}>
            <Typography
              fontSize={16}
              fontWeight={600}
              textAlign={'center'}
              color={'#7e8299'}
            >
              Cantidad Lineas
            </Typography>
          </Grid>
          <Grid item xs={12} pt={1}>
            <Divider />
          </Grid>
          {props.data.map((lineData) => (
            <Grid container spacing={2} alignItems={'center'} pt={1} pb={1}>
              <Grid item xs={3}>
                <OffererLogo
                  offererId={lineData[EntityWithIdAndDescriptionFields.Id]}
                  sx={{ width: '7rem', height: '4.5rem' }}
                />
              </Grid>
              <Grid item xs={6.5}>
                <Typography
                  sx={{ textTransform: 'capitalize', textAlign: 'left' }}
                >
                  {lineData[EntityWithIdAndDescriptionFields.Description]}
                </Typography>
              </Grid>
              <Grid item xs={2.5}>
                <Typography textAlign={'center'} fontWeight={600} fontSize={15}>
                  {`${lineData[SolicitationTotalsViewFields.SolicitationsQuantity] === 1 ? `${lineData[SolicitationTotalsViewFields.SolicitationsQuantity]} linea` : `${lineData[SolicitationTotalsViewFields.SolicitationsQuantity]} lineas`}`}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyOffererLinesStatsDialog;
