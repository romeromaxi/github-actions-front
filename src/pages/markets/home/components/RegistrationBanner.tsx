import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
// @ts-ignore
import backgroundImage from '../../../../assets/img/bg-index.jpg';
import { DefaultStylesButton } from '../../../../components/buttons/Buttons';

function RegistrationBanner() {
  return (
    <Box
      //
      sx={{
        height: '400px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: 1,
        mt: 0,
      }}
    >
      <Grid
        container
        alignItems={'center'}
        style={{
          width: '100%',
          height: '100%',
          opacity: 1,
          zIndex: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Grid item xs={2}>
          <Box sx={{ width: 1 }} />
        </Grid>
        <Grid item xs={5}>
          <Stack direction={'column'}>
            <Typography
              sx={{
                color: 'white',
                fontSize: '2.25rem',
                fontWeight: '900',
                textTransform: 'uppercase',
              }}
            >
              ¿CUÁLES SON LAS VENTAJAS DE UN LEGAJO DIGITAL?
            </Typography>
            <Typography
              sx={{
                color: 'white',
                fontSize: '1.125rem',
              }}
            >
              Para solicitar pre-calificaciones crediticias a través de la
              plataforma, lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Sed elementum purus accumsan risus convallis sagittis.
              Praesent malesuada sodales dolor, at ornare lacus ullamcorper et.
              Mauris tincidunt lacus et commodo efficitur.
            </Typography>
            <DefaultStylesButton
              sx={{ width: 1 / 4, backgroundColor: '#004dda' }}
            >
              Registrarse
            </DefaultStylesButton>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RegistrationBanner;
