import {
  Alert,
  Dialog,
  DialogContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import BaseDialogTitle from '../dialog/BaseDialogTitle';
import React, { useEffect, useState } from 'react';
import { HttpFilesSolicitation } from '../../http';
import {
  SolicitationFileRequested,
  SolicitationFileRequestedFields,
} from '../../types/files/filesData';
import { fileFormatter } from '../../util/formatters/fileFormatter';
import { grey } from '@mui/material/colors';

interface SolicitationRequiredFileCancelledDialogProps {
  open: boolean;
  onClose: () => void;
  solicitationId: number;
}

const SolicitationRequiredFileCancelledDialog = ({
  open,
  onClose,
  solicitationId,
}: SolicitationRequiredFileCancelledDialogProps) => {
  const [docs, setDocs] = useState<SolicitationFileRequested[]>();

  useEffect(() => {
    if (open)
      HttpFilesSolicitation.getCancelledFiles(solicitationId).then((r) =>
        setDocs(r),
      );
    else setDocs(undefined);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <BaseDialogTitle
        onClose={onClose}
        title={`Documentos cancelados de la solicitud ${solicitationId}`}
      />
      <DialogContent>
        <Stack spacing={1}>
          {docs ? (
            docs.length !== 0 ? (
              docs.map((doc: SolicitationFileRequested) => (
                <Grid container alignItems="center">
                  <Grid item md={1}>
                    {fileFormatter.getIconByFileName(
                      doc[SolicitationFileRequestedFields.Title],
                      { fontSize: 'large' },
                    )}
                  </Grid>
                  <Grid item md={11}>
                    <Stack>
                      <Typography fontSize={14} fontWeight={600}>
                        {doc[SolicitationFileRequestedFields.Title]}
                      </Typography>
                      {doc[SolicitationFileRequestedFields.Observations] &&
                        doc[SolicitationFileRequestedFields.Observations] !==
                          '' && (
                          <Typography color={grey[600]} fontSize={11}>
                            {doc[SolicitationFileRequestedFields.Observations]}
                          </Typography>
                        )}
                    </Stack>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Alert severity={'info'}>
                Por el momento no se ha cancelado ningún archivo
              </Alert>
            )
          ) : (
            Array.from({ length: 6 }).map(() => <Skeleton />)
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default SolicitationRequiredFileCancelledDialog;
