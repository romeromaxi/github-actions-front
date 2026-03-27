import React from 'react';
import { Box } from '@mui/material';
// @ts-ignore
import lamparita from '../../../assets/img/market/home/lamparita.png';
import MarketHomeNewStyles from './MarketHomeNew.styles';
import marketHomeServices from '../../../assets/img/market/home/market-home-services-1.png';
import marketHomeServices2 from '../../../assets/img/market/home/market-home-services-2.png';

/*
    const lamparitaTextSx = {
        color: 'black',
        fontSize: '3em',
        fontWeight: 800,
        position: 'relative'
    
    }
    
    const titleTextSx = {
        color: 'black', fontWeight: 800, wordWrap: 'break-word',
        fontSize: '2.325rem'
    }
    
    const textSx = {
        fontSize: '1.25rem',
        wordWrap: 'break-word'
    }
 */

function MarketHomeNew3() {
  const classes = MarketHomeNewStyles();

  return (
    <div>
      <Box
        className={classes.containerXLongRow}
        sx={{
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundImage: `url(${marketHomeServices})`,
          zIndex: 2,
          position: 'relative',
          width: '100%',
        }}
      />
      <Box
        className={classes.containerShortRow}
        sx={{
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundImage: `url(${marketHomeServices2})`,
          height: '100%',
          zIndex: 2,
          position: 'relative',
        }}
      />
      {/*
                <Grid container justifyContent={'center'} alignItems={'stretch'} sx={{mt: 1}}>
                    <Grid item xs={6}>
                        <Box className={classes.containerFullRow} sx={{
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundImage: `url(${lamparita})`,
                            height: '100%',
                            zIndex: 2,
                            p: 5,
                            position: 'relative'
                        }}>
                            <div style={{position: "absolute", color: "white",top: 10, right: '15%'}}>
    
                                <Stack direction={'column'} sx={{position: 'absolute',
                                    right: '2.5%',
                                    top: 10,}} spacing={-2}>
                                    <Typography sx={lamparitaTextSx}>
                                        SOLUCIONES
                                    </Typography>
                                    <Typography sx={lamparitaTextSx}>
                                        PARA PYMES
                                    </Typography>
                                    <Typography sx={lamparitaTextSx}>
                                        REGISTRADAS
    
                                    </Typography>
    
                                </Stack>
                                SOLUCIONES<br></br> PARA PYMES<br></br> REGISTRADAS
    
                            </div>
                            <Typography sx={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '5em',
                                fontWeight: 800,
                                textAlign: 'right',
                                position: 'absolute',
                                right: '2.5%',
                                wordWrap: 'break-word',
                                bottom: 5,
                                width: '50%'
    
                            }}>PYMES</Typography>
    
                        </Box>
                    </Grid>
                    <Grid item container xs={6} alignItems={'stretch'} >
                        <Grid item xs={6}
                        sx={{backgroundColor: '#1565C0', height: 1/2, p: 3}}
                        >
                            <Stack direction={'column'}
                                   alignItems={'center'} gap={1} sx={{color: 'white'}}>
                                <Box mb={1}>
                                    <MarketTypography
                                        textAlign={'center'}
                                        sx={titleTextSx}
                                    >MARKET</MarketTypography>
                                    <MarketTypography
                                        textAlign={'center'}
                                        sx={{
                                            color: 'black', fontWeight: 600, wordWrap: 'break-word', fontSize: '1.5rem'
                                        }}
                                    >
                                        Productos de Financiamiento y Cobertura de Riesgos PyMEs
                                    </MarketTypography>
                                </Box>
    
                                <MarketTypography sx={textSx}>
    
                                    <strong>Descubrí</strong> lo que el mercado ofrece para tu PyME.
                                </MarketTypography>
                                <MarketTypography sx={textSx}>
                                    <strong>Compará</strong> las propuestas de los distintos oferentes.
                                </MarketTypography>
                                <MarketTypography sx={textSx}>
                                    <strong>Solicitá</strong> precalificaciones en todas las líneas de tu interés con un único Legajo de Contacto.
                                </MarketTypography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}
                              sx={{backgroundColor: 'black', height: 1/2, p: 3}}
                        >
                            <Stack direction={'column'}
                                   alignItems={'center'} gap={2} sx={{color: 'white'}}>
                                <Box mb={1}>
                                    <MarketTypography
                                        textAlign={'center'}
                                        sx={{...titleTextSx, color: 'white'}}
                                    >MI REPOSITORIO</MarketTypography>
                                    <MarketTypography
                                        fontWeight={'light'}
                                        textAlign={'center'}
                                        sx={{
                                            color: 'white', fontWeight: 600, wordWrap: 'break-word', fontSize: '1.5rem'
                                        }}
                                    >
                                        Datos y Documentos de PyMEs
                                    </MarketTypography>
    
                                </Box>
                                
                            <MarketTypography sx={textSx}>
                                <strong>Guardá, exportá y reutilizá</strong> tus datos y documentos más requeridos para trámites y presentaciones de un modo ordenado y simple.
                            </MarketTypography>
                            </Stack>
                        </Grid>
    
    
                        <Grid item xs={6}
                              sx={{backgroundColor: 'black', height: 1/2, p: 3}}
    
                        >
                            <Stack direction={'column'}
                                   alignItems={'center'} gap={2} sx={{color: 'white'}}>
                                <Box mb={1}>
                                    <MarketTypography
                                        textAlign={'center'}
                                        sx={{...titleTextSx, color: 'white'}}
                                    >PRESENTACIONES</MarketTypography>
                                    <MarketTypography
                                        textAlign={'center'}
                                        sx={{
                                            color: 'white', fontWeight: 600, wordWrap: 'break-word', fontSize: '1.5rem'
                                        }}
                                    >
                                       Templates y Herramientas de Edición
                                    </MarketTypography>
    
                                </Box>
    
                                <MarketTypography sx={textSx}>
                                    <strong>Creá y editá</strong> presentaciones profesionales y visualmente atractivas de forma rápida y sencilla con los templates de LUC.
                                </MarketTypography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}
                              sx={{backgroundColor: '#1565C0', height: 1/2, p: 3}}
                        >
                            <Stack direction={'column'}
                                   alignItems={'center'} gap={1} sx={{color: 'white'}}>
                                <Box mb={1}>
                                <MarketTypography
                                    fontWeight={'light'}
                                    textAlign={'center'}
                                    sx={{
                                        color: 'black', fontWeight: 800, wordWrap: 'break-word',
                                        fontSize: '2.325rem', textTransform: 'uppercase',
                                    }}
                                >Información Pública</MarketTypography>
                                <MarketTypography
                                    fontWeight={'light'}
                                    textAlign={'center'}
                                    sx={{
                                        color: 'black', fontWeight: 800, wordWrap: 'break-word', fontSize: '1.5rem'
                                    }}
                                >
                                    Datos públicos e indicadores de PyMEs
                                </MarketTypography>
                                </Box>
                                <MarketTypography sx={textSx}>
    
                                    <strong>Aprendé</strong> a ver cómo ven a tu PyME a través de los datos de acceso público y de tus indicadores económico financieros.
                                </MarketTypography>
    
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                 */}
    </div>
  );
}

export default MarketHomeNew3;
