import { Grid, Typography } from '@mui/material';
import React from 'react';

function ProductLineDetailApprovalRequire() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography fontSize={21} fontWeight={600}>
          Registro de Cambios sobre las publicaciones de esta línea
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ProductLineDetailApprovalRequire;
