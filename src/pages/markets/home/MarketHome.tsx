import React from 'react';
import { Box, Container, Grid, Stack } from '@mui/material';
import { indigo, lightBlue } from '@mui/material/colors';

// @ts-ignore
import { ReactComponent as TargetArrowIcon } from 'assets/svgs/target-and-arrow-svgrepo-com.svg';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import DestinyBannerSwiper from './components/DestinyBannerSwiper';
import MarketBorderBox from './components/MarketBorderBox';
import { getBaseColor } from '../../../util/typification/generalColors';
import { EnumColors } from '../../../types/general/generalEnums';
import MarketTypography from '../components/MarketTypography';
import RegistrationBanner from './components/RegistrationBanner';
import BankLogoSlider from './components/BankLogoSlider';

function MarketHome() {
  return (
    <div>
      <DestinyBannerSwiper />
      <Grid container justifyContent={'center'}>
        <Grid
          item
          xs={11}
          container
          spacing={2}
          sx={{ mt: 3, mb: 3 }}
          alignItems={'stretch'}
        >
          <Grid item xs={3}>
            <MarketBorderBox
              text={
                'SOLICITAR PRECALIFICACIONES en las principales entidades del país es muy simple'
              }
              sx={{ backgroundColor: getBaseColor(EnumColors.MARKET_BLUE) }}
              textProps={{ sx: { fontSize: '1.5rem' } }}
              textColor={'white'}
            />
          </Grid>
          <Grid item container xs={6} spacing={1}>
            <Grid item xs={12 / 5}>
              <MarketBorderBox
                text={'SELECCIONÁ LOS PRODUCTOS'}
                icon={<TargetArrowIcon />}
                textProps={{ textAlign: 'center' }}
              />
            </Grid>
            <Grid item xs={12 / 5}>
              <MarketBorderBox
                text={'ELEGÍ UNA O MÁS LÍNEAS'}
                icon={<SearchIcon sx={{ fontSize: '40px' }} />}
                textProps={{ textAlign: 'center' }}
              />
            </Grid>
            <Grid item xs={12 / 5}>
              <MarketBorderBox
                text={'AGREGÁ TU PYME'}
                icon={<AddIcon sx={{ fontSize: '40px' }} />}
                textProps={{ textAlign: 'center' }}
              />
            </Grid>
            <Grid item xs={12 / 5}>
              <MarketBorderBox
                text={'COMPLETÁ EL LEGAJO'}
                icon={<AccessTimeIcon sx={{ fontSize: '40px' }} />}
                textProps={{ textAlign: 'center' }}
              />
            </Grid>
            <Grid item xs={12 / 5}>
              <MarketBorderBox
                text={'...Y LISTO'}
                icon={<SchemaOutlinedIcon sx={{ fontSize: '40px' }} />}
                textProps={{ textAlign: 'center' }}
              />
            </Grid>
          </Grid>

          <Grid item xs={3}>
            <MarketBorderBox
              text={
                'Se enviaron las solicitudes de precalificación a todos los oferentes que elegiste'
              }
              sx={{ backgroundColor: getBaseColor(EnumColors.MARKET_BLUE) }}
              textProps={{ sx: { fontSize: '1.5rem' } }}
              textColor={'white'}
            />
          </Grid>
        </Grid>
      </Grid>
      <Stack
        sx={{
          width: 1,
          height: '50px',
          backgroundColor: getBaseColor(EnumColors.MARKET_BLUE),
          mt: 2,
        }}
      >
        <MarketTypography
          fontWeight={800}
          variant={'h1'}
          sx={{ color: 'white', textAlign: 'center', margin: 'auto' }}
        >
          SOLUCIONES PARA PYMES REGISTRADAS
        </MarketTypography>
      </Stack>
      <Grid container justifyContent={'center'} alignItems={'stretch'}>
        <Grid
          item
          container
          xs={8}
          spacing={4}
          sx={{ mt: 2, height: '100%' }}
          justifyContent={'center'}
          alignItems={'stretch'}
        >
          <Grid item xs={3}>
            <Box
              sx={{
                borderRadius: '10px',
                backgroundColor: lightBlue[400],
                p: 1,
                minHeight: '100px',
                height: '100%',
              }}
            >
              <MarketTypography
                textAlign={'center'}
                fontWeight={600}
                variant={'h2'}
              >
                Market
              </MarketTypography>
              <MarketTypography
                fontWeight={'light'}
                textAlign={'center'}
                variant={'h6'}
              >
                Productos de financiamiento y Cobertura de Riesgos PyMEs
              </MarketTypography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{
                borderRadius: '10px',
                backgroundColor: lightBlue[400],
                p: 1,
                height: '100%',
              }}
            >
              <MarketTypography
                textAlign={'center'}
                fontWeight={600}
                variant={'h2'}
              >
                Mi Repositorio
              </MarketTypography>
              <MarketTypography
                fontWeight={'light'}
                textAlign={'center'}
                variant={'h6'}
              >
                Datos y Documentos de PyMEs
              </MarketTypography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{
                borderRadius: '10px',
                backgroundColor: lightBlue[400],
                p: 1,
                minHeight: '100px',
                height: '100%',
              }}
            >
              <MarketTypography
                textAlign={'center'}
                fontWeight={600}
                variant={'h2'}
              >
                Ver cómo te ven
              </MarketTypography>
              <MarketTypography
                fontWeight={'light'}
                textAlign={'center'}
                variant={'h6'}
              >
                Datos públicos e indicadores de PyMEs.
              </MarketTypography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{
                borderRadius: '10px',
                backgroundColor: lightBlue[400],
                p: 1,
                minHeight: '100px',
                height: '100%',
              }}
            >
              <MarketTypography
                textAlign={'center'}
                fontWeight={600}
                variant={'h2'}
              >
                Market
              </MarketTypography>
              <MarketTypography
                fontWeight={'light'}
                textAlign={'center'}
                variant={'h6'}
              >
                Productos de financiamiento y Cobertura de Riesgos PyMEs
              </MarketTypography>
            </Box>
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={8}
          spacing={4}
          sx={{ mt: 2 }}
          justifyContent={'center'}
          alignItems={'stretch'}
        >
          <Grid item xs={3}>
            <Stack direction={'column'} gap={3}>
              <MarketTypography fontSize={'1.125rem'}>
                <strong>Descubrí</strong> lo que el mercado ofrece para tu PyME.
              </MarketTypography>
              <MarketTypography fontSize={'1.125rem'}>
                <strong>Compará</strong> las propuestas de los distintos
                oferentes.
              </MarketTypography>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack
              direction={'column'}
              gap={3}
              sx={{ minHeight: '100px', height: '100%' }}
            >
              <MarketTypography fontSize={'1.125rem'}>
                <strong>Solicitá</strong> precalificaciones en todas las líneas
                de tu interés con un único Legajo de Contacto.
              </MarketTypography>
              <MarketTypography fontSize={'1.125rem'}>
                <strong>Guardá, exportá y reutilizá</strong> tus datos y
                documentos más requeridos para trámites y presentaciones de un
                modo ordenado y simple.
              </MarketTypography>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack direction={'column'} gap={3}>
              <MarketTypography fontSize={'1.125rem'}>
                <strong>Creá y editá</strong> presentaciones profesionales y
                visualmente atractivas de forma rápida y sencilla con los
                templates de LUC.
              </MarketTypography>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack direction={'column'} gap={3}>
              <MarketTypography fontSize={'1.125rem'}>
                <strong>Aprendé</strong> a ver cómo ven a tu PyME a través de
                los datos de acceso público y de tus indicadores económico
                financieros.
              </MarketTypography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Box mt={5}></Box>
      <RegistrationBanner />
      <Container>
        <Box mt={2} />
        <BankLogoSlider />
      </Container>
      <Box mt={15}>
        <div style={{ scrollMarginTop: '150px' }}>
          {/*<DestinyBannerGrid/>*/}
        </div>
      </Box>
    </div>
  );
}

export default MarketHome;
