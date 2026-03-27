import {Box, Grid, Stack, Typography} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import React from 'react';
import ContactSupportTwoToneIcon from '@mui/icons-material/ContactSupportTwoTone';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import CardActionButtonRounded from '../../../components/cards/CardActionButtonRounded';
import {AppRoutesDefinitions, useAppNavigation} from "../../../hooks/navigation";

interface CompanyAccountMoreInfoProps {
  horizontal?: boolean;
  offerer?: boolean;
}

const CompanyAccountMoreInfo = ({
  horizontal = false,
  offerer = false,
}: CompanyAccountMoreInfoProps) => {
  const { navigate } = useAppNavigation();

  const goToMarketLanding = () => navigate(AppRoutesDefinitions.MarketLanding);
  
  const goToAboutLuc = () => navigate(AppRoutesDefinitions.LucAboutPage);
  
  const goToFAQLuc = () => navigate(AppRoutesDefinitions.LucFAQPage);
  
  return (
      <Stack spacing={2}>
          <Typography
              variant="h4"
              fontWeight={600}
              lineHeight={1.2}
              fontSize={'1.5rem'}
          >
              ¿Por dónde seguimos?
          </Typography>
          <Stack direction={horizontal ? 'row' : 'column'}>
              <Grid container spacing={2}>
                  <Grid item xs={12} md={horizontal ? 4 : 12}>
                      <Box height={100} display="flex">
                          <CardActionButtonRounded
                              title={'Ir a la tienda'}
                              onClick={goToMarketLanding}
                              icon={<StoreIcon fontSize={'large'} />}
                              sx={{
                                  height: '100%',
                                  width: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                              }}
                          />
                      </Box>
                  </Grid>
                  <Grid item xs={12} md={horizontal ? 4 : 12}>
                      <Box height={100} display="flex">
                          <CardActionButtonRounded
                              title={'Soluciones LUC'}
                              onClick={goToAboutLuc}
                              icon={<TripOriginIcon fontSize={'large'} />}
                              sx={{
                                  height: '100%',
                                  width: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                              }}
                          />
                      </Box>
                  </Grid>
                  {!offerer && (
                      <Grid item xs={12} md={horizontal ? 4 : 12}>
                          <Box height={100} display="flex">
                              <CardActionButtonRounded
                                  title={'Preguntas Frecuentes'}
                                  onClick={goToFAQLuc}
                                  icon={<ContactSupportTwoToneIcon fontSize={'large'} />}
                                  sx={{
                                      height: '100%',
                                      width: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                  }}
                              />
                          </Box>
                      </Grid>
                  )}
              </Grid>
          </Stack>
      </Stack>
  );
};


export default CompanyAccountMoreInfo;
