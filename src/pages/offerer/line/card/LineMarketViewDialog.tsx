import React from 'react';
import { ProductLineViewDetail } from '../../../../types/lines/productLineData';
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
} from '@mui/material';
import ProductLineCard from '../../../markets/lines/components/ProductLineCard';
import BaseDialogTitle from '../../../../components/dialog/BaseDialogTitle';

interface LineMarketViewDialogProps extends DialogProps {
  line: ProductLineViewDetail;
  onClose: () => void;
}

function LineMarketViewDialog({
  line,
  onClose,
  ...dialogProps
}: LineMarketViewDialogProps) {
  return (
    <Dialog {...dialogProps} onClose={onClose} maxWidth={'xs'}>
      <BaseDialogTitle onClose={onClose} title={'Vista previa de la línea'} />
      {/*<DialogTitle>*/}
      {/*    Vista previa de la línea*/}
      {/*</DialogTitle>*/}
      <DialogContent>
        <Grid item container xs={12} justifyContent={'center'}>
          <Grid item xs={12}>
            <ProductLineCard productLine={line} viewMode />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default LineMarketViewDialog;
