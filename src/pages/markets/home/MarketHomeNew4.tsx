import { Box, Grid } from '@mui/material';

// @ts-ignore
import equipo from '../../../assets/img/market/home/equipoenmesa.png';
import MarketHomeNewStyles from './MarketHomeNew.styles';
import marketHomeServices3 from '../../../assets/img/market/home/market-home-services-3.png';
import marketHomeServices4 from '../../../assets/img/market/home/market-home-services-4.png';
import React from 'react';

function MarketHomeNew4() {
  const classes = MarketHomeNewStyles();
  //const [actionHover, setActionHover] = useState<boolean>(false)

  /*
        const miraQueHaySx = {
            textAlign: 'center', color: actionHover ? '#000' : 'white', fontWeight: 800,
            fontSize: '3.125rem',
        }
     */

  return (
    <Grid container justifyContent={'center'} sx={{ mt: 1 }}>
      <Grid item xs={12}>
        <Box
          sx={{
            height: '101vh',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundImage: `url(${marketHomeServices3})`,
            zIndex: 2,
            position: 'relative',
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            height: '96vh',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundImage: `url(${marketHomeServices4})`,
            zIndex: 2,
            position: 'relative',
          }}
        />
      </Grid>
      {/*
                
                <Grid item xs={9}>
                    <Box className={classes.containerFullRow} sx={{
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundImage: `url(${equipo})`,
                        zIndex: 2,
                        pl: 5,
                        pt: 1,
                        position: 'relative'
                    }}>
                        <MarketTypography
                            sx={{
                                fontSize: '6rem',
                                fontWeight: 800,
                                backgroundColor: 'rgba(217, 217, 217, 0.5)',
                                borderRadius: 5,
                                pt: 2, pb: 1,
                                pr: 4, pl: 4,
                                // ml: 1,
                                display: 'inline'
                            }}
                        >OFERENTES
                        </MarketTypography>
                        <Stack sx={{position: 'absolute', bottom: 35}} gap={2}>
                            <div>
                                <Typography
                                    component={'span'}
                                    sx={{
                                        fontSize: '3rem',
                                        backgroundColor: 'rgba(217, 217, 217, 0.5)',
                                        color: '#000',
                                        paddingBottom: '0.88rem',
                                        paddingRight: '1rem',
                                        paddingLeft: '1rem',
                                        fontWeight: 600,
                                        borderRadius: '1rem',
                                        pt: 1.5,
                                        // pb: 1.3,
    
                                        // padding: 0.5rem 2rem,
                                        boxDecorationBreak: 'clone',
                                        '-webkit-box-decoration-break': 'clone'
                                    }}
                                    className="background-color"><span className="new-stack-context">
                                        Ampliá la cartera de clientes y potenciá tu gestión con LUC.
                                    </span></Typography>
                            </div>
                            <Stack direction={'row-reverse'}>
                                <DefaultStylesButton variant={'contained'}
                                                     sx={{
                                                         color: 'black',
                                                         backgroundColor: 'white',
                                                         borderRadius: 0,
                                                         boxShadow: 0,
                                                         width: 1 / 3,
                                                         mr: 1,
    
                                                     }}
                                >
                                    <MarketTypography sx={{
                                        fontSize: '2rem',
                                        fontWeight: 500
                                    }}>Leer Más</MarketTypography>
                                </DefaultStylesButton>
                            </Stack>
                        </Stack>
    
                    </Box>
                </Grid>
                <Grid item container xs={3}>
                    <Grid item
                          container
                          alignItems={'flex-end'}
                          xs={12}
                          className={classes.containerLongRow}
                          sx={{ backgroundColor: '#1565C0', color: '#000', position: 'relative', }}
                    >
                        <Grid item xs={12}>
                            <MarketTypography
                                sx={{...miraQueHaySx, color: '#000',}}>
                                SOY OFERENTE
                            </MarketTypography>
                        </Grid>
    
                    </Grid>
                    <Grid item container xs={12}
                          onMouseEnter={(e) => {
                              setActionHover(true)
                          }}
                          onMouseLeave={(e) => {
                              setActionHover(false)
                          }}
                          className={classes.containerShortRow}
                    >
    
                        <Grid item container xs={12} sx={{
                            backgroundColor: actionHover ? 'white' : '#000',
                            p: 1
                        }}
                              justifyContent={'center'} alignItems={'center'}
                        >
                            <Grid item xs={8}>
                                <Stack spacing={-2.5}>
                                    <MarketTypography
                                        sx={miraQueHaySx}
                                    >
                                        QUIERO
                                    </MarketTypography>
                                    <MarketTypography sx={miraQueHaySx}>
                                        ESTAR
                                    </MarketTypography>
                                    <MarketTypography sx={miraQueHaySx}>
                                        EN LUC
                                    </MarketTypography>
                                </Stack>
                            </Grid>
                            <Grid item xs={4} sx={{
                                width: 1,
                            }}
                                  justifyContent={'center'} alignItems={'center'}
                            >
                                <ArrowForwardIcon sx={{
                                    color: actionHover ? 'black' : 'white', fontSize: '12rem',
                                    stroke: actionHover ? 'white' : 'black', strokeWidth: 1,
                                }}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    
                </Grid>
                 */}
    </Grid>
  );
}

export default MarketHomeNew4;
