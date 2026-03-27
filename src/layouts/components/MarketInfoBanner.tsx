import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import MonitorOutlinedIcon from '@mui/icons-material/MonitorOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

const iconSx = {
  stroke: 'white',
  strokeWidth: 1,
};

const labelSx = { textAlign: 'center', fontSize: '1.125rem', fontWeight: 400 };

function MarketInfoBanner() {
  return (
    <Grid
      container
      sx={{
        width: 1,
        backgroundColor: '#f8f8f8',
        p: 1,
        mt: 0,
        // position: 'absolute',
        // right: 0
      }}
    >
      <Grid item xs={2}>
        <Box sx={{ width: 1 }} />
      </Grid>
      <Grid item container xs={10}>
        <Grid item xs={4}>
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <BusinessCenterOutlinedIcon
              fontSize={'large'}
              color={'primary'}
              sx={iconSx}
            />
            <Typography sx={labelSx}>
              +100 Opciones de Financiamiento
              <Typography display={'block'} variant={'caption'}>
                Encontrá la línea para tu PyME
              </Typography>
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <MonitorOutlinedIcon
              fontSize={'large'}
              color={'primary'}
              sx={iconSx}
            />
            <Typography sx={labelSx}>
              Gestión 100% Online
              <Typography
                sx={{ fontSize: '0.875rem' }}
                display={'block'}
                variant={'caption'}
              >
                Optimice tiempos y recursos
              </Typography>
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <BadgeOutlinedIcon
              fontSize={'large'}
              color={'success'}
              sx={iconSx}
            />
            <Typography sx={labelSx}>
              Armá tu perfil online
              <Typography display={'block'} variant={'caption'}>
                Realizá tu perfil online
              </Typography>
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Box sx={{ width: 1 }} />
      </Grid>
    </Grid>
  );
}

export default MarketInfoBanner;
