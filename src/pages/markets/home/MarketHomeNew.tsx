import React, { useEffect } from 'react';
import { Grid } from '@mui/material';

import MarketHomeNew2 from './MarketHomeNew2';
import MarketHomeNew3 from './MarketHomeNew3';
import MarketHomeNew4 from './MarketHomeNew4';
import { userStorage } from 'util/localStorage/userStorage';
import { useNavigate } from 'react-router-dom';

function MarketHomeNew() {
  const navigate = useNavigate();
  const isLogged = userStorage.isLogged();

  useEffect(() => {
    if (isLogged) navigate('/market/landing');
  }, [isLogged]);

  return (
    <Grid
      container
      justifyContent={'center'}
      sx={{ mt: 1, backgroundColor: 'white' }}
      spacing={0}
    >
      <Grid item xs={12}>
        <MarketHomeNew2 />
      </Grid>
      <Grid item xs={12}>
        <MarketHomeNew3 />
      </Grid>
      <Grid item xs={12}>
        <MarketHomeNew4 />
      </Grid>
    </Grid>
  );
}

export default MarketHomeNew;
