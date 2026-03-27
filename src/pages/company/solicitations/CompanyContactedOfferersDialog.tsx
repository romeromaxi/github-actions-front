import {
  OffererFields,
  OffererSummaryView,
} from '../../../types/offerer/offererData';
import { Dialog, DialogContent, Typography } from '@mui/material';
import BaseDialogTitle from '../../../components/dialog/BaseDialogTitle';
import React from 'react';

interface CompanyContactedOfferersDialogProps {
  open: boolean;
  data: OffererSummaryView[];
  onClose: () => void;
}

const CompanyContactedOfferersDialog = ({
  open,
  data,
  onClose,
}: CompanyContactedOfferersDialogProps) => {
  return (
    <Dialog fullWidth maxWidth={'xs'} open={open} onClose={onClose}>
      <BaseDialogTitle title="Oferentes contactados" onClose={onClose} />
      <DialogContent>
        {data.map((offerer) => (
          <Typography fontSize={16} fontWeight={600}>
            {offerer[OffererFields.BusinessName]}
          </Typography>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default CompanyContactedOfferersDialog;
