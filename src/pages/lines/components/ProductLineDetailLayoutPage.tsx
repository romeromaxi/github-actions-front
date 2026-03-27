import { ReactElement } from 'react';
import { Grid } from '@mui/material';

interface ProductLineDetailLayoutPageProps {
  children: ReactElement;
}

function ProductLineDetailLayoutPage({
  children,
}: ProductLineDetailLayoutPageProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  );
}

export default ProductLineDetailLayoutPage;
