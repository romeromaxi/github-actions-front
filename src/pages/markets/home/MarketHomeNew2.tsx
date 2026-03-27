import React from 'react';
// @ts-ignore

import {
  Box,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MarketHomeNewStyles from './MarketHomeNew.styles';
// @ts-ignore
import marketHome from '../../../assets/img/market/home/market-home.png';

function MarketHomeNew2() {
  const navigate = useNavigate();
  const classes = MarketHomeNewStyles();

  return (
    <>
      {/*
                
                    <div style={{backgroundColor: 'white'}}>
                        <Grid container justifyContent={'center'} alignItems={'stretch'} sx={{mt: 3, pt: 5, pl: 5}}>
                            <Grid item xs={12} md={6}>
                                <Stack
                                    // spacing={4}
                                       pr={2}
                                       sx={{height: '100%'}}
                                       direction={'column'}
                                       justifyContent={'space-between'}
                                >
                                    <Typography sx={{
                                        fontSize: '3.5em',
                                        fontWeight: 800,
                                        wordWrap: 'break-word',
                                        textAlign: 'center'
                                    }}>
                                        La plataforma de las MiPyMEs para ampliar el acceso al financiamiento
                                    </Typography>
                                    <Stack direction={'column'} gap={1}>
                                        <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{width: '80% !important'}}>
                                            <Typography sx={{
                                                fontSize: '1.65em',
                                                fontWeight: 600,
                                                wordWrap: 'break-word',
                                                textAlign: 'center',
                                                ml: '10%', mr: '10%'
                                            }}>
                                                Encontrá en un mismo lugar los productos financieros, garantías y coberturas de riesgos ofrecidos
                                                en el mercado por entidades públicas y privadas
                                            </Typography>
            
                                        </Stack>*
            
                                    </Stack>
                                    <Stack alignItems={'center'}>
                                        <DefaultMarketButton
            
                                            size='large' sx={{
                                            height: '70px', fontSize: '22px', width: '50%',
                                            textTransform: 'uppercase', backgroundColor: '#1565C0'
                                        }} onClick={() => {navigate('/market/landing')}}>
                                            Explorá ahora
                                        </DefaultMarketButton>
                                    </Stack>
                                    <Box sx={{ mt: 'auto' }}>
                                        <Typography sx={{
                                            fontSize: '1.15em',
                                            fontWeight: 500,
                                            wordWrap: 'break-word',
                                            textAlign: 'center'
                                        }}>
                                            Financiación - Descuento de cheques - Apertura de cuentas - Avales - Seguros
                                        </Typography>
                                    </Box>
                                </Stack>
            
                            </Grid>
                            <Grid item xs={12} md={6} sx={{width: '100%', height: '520px'}}>
                                <Box component="img"
                                     src="/images/market/compu-market-deg.jpg"
                                           sx={{
                                               opacity: 0.75,
                                               height: '102%',
                                               borderRadius: '6px'
                                           }}
                                />
                            </Grid>
                            <Grid item xs={12} container spacing={3} alignItems='center'>
                                <Grid item xs={12}><Divider sx={{width: '100%', mt: 2}}/></Grid>
                                <Grid item xs={12} md={3} pb={3}>
                                    <Typography sx={{
                                        color: '#000',
                                        fontSize: '1.85em',
                                        fontWeight: 800,
                                        wordWrap: 'break-word',
                                        textAlign: 'center',
                                        textTransform: 'uppercase',
                                    }}>
                                        ¡Solicitar precalificaciones en las principales entidades del país es muy simple!
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={9} mt={'20px'} mb={'20px'} sx={{height: '280px'}}>
                                    <Box component="img"
                                         pt={0.5}
                                         src="/images/market/proceso-market-v2.jpg"
                                         sx={{
                                             height: '90%',
                                             width: '95%'
                                         }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                 */}
      <Box
        className={`${classes.containerFullRow} ${classes.gridClickeable}`}
        sx={{
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundImage: `url(${marketHome})`,
          zIndex: 2,
          position: 'relative',
        }}
        onClick={() => {
          navigate('/market/landing');
        }}
      />
    </>
  );
}

export default MarketHomeNew2;
