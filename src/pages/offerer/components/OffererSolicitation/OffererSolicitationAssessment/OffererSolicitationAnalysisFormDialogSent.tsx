import BaseDialogTitle from '../../../../../components/dialog/BaseDialogTitle';
import { DialogContent, Grid } from '@mui/material';
import React from 'react';
import { dateFormatter } from '../../../../../util/formatters/dateFormatter';

interface OffererSolicitationAnalysisFormDialogSentProps {
  message: string;
  onClose: () => void;
  sentDate: Date | undefined;
}

const OffererSolicitationAnalysisFormDialogSent = ({
  message,
  onClose,
  sentDate,
}: OffererSolicitationAnalysisFormDialogSentProps) => {
  return (
    <>
      <BaseDialogTitle
        title={
          sentDate
            ? `Formulario de respuesta (${dateFormatter.toLongDate(sentDate)})`
            : 'Formulario de respuesta enviado'
        }
        onClose={onClose}
      />
      <DialogContent>
        <Grid container>
          <Grid item xs={12} container>
            {message && (
              <Grid item xs={12} container>
                <Grid item xs={12}>
                  <div dangerouslySetInnerHTML={{ __html: message }} />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
};

export default OffererSolicitationAnalysisFormDialogSent;
