import React from 'react';
import { Grid } from '@mui/material';
import CompanySolicitationSharedFiles from './CompanySolicitationSharedFiles';
import CompanySolicitationRequestedFiles from './CompanySolicitationRequestedFiles';
import { SolicitationViewDTO } from 'types/solicitations/solicitationData';

interface CompanySolicitationDocumentSwapProps {
  solicitation: SolicitationViewDTO;
}

function CompanySolicitationDocumentSwap({
  solicitation,
}: CompanySolicitationDocumentSwapProps) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CompanySolicitationRequestedFiles solicitation={solicitation} />
      </Grid>
      <Grid item xs={12}>
        <CompanySolicitationSharedFiles solicitation={solicitation} />
      </Grid>
    </Grid>
  );
}

export default CompanySolicitationDocumentSwap;
