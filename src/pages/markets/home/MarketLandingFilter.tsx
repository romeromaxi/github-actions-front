import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import MarketLandingProductLinesAdvertising from "./MarketLandingProductLinesAdvertising";
import BannerCarousel from './components/landingFilter/BannerCarousel';
import ProductSearchTabs from './components/landingFilter/ProductSearchTabs';
import BannersFaq from './components/landingFilter/BannersFaq';
import {HttpProductLineChosen} from "../../../http/line/httpProductLineChosen";

function MarketLandingFilter() {
  const navigate = useNavigate();
  const location = useLocation();

  const lucRedirectPath = '/market/luc?redirect=ac08111f742d99c360628ede782615800ab2b5e0ef3fbd90ed919c0b919447a9b60e27623ee78fcc7021a47e7144df4ec044368bbd4452bb8e80e90600778c72e1721c923214746df1a57d1c1577c2db'; 
  const onClickMatcherLuc = () => navigate(lucRedirectPath);

  const casfogRedirectPath = '/market/casfog?redirect=ac08111f742d99c360628ede78261580097098d9b8b5212a530e5a1bfa048dd9b6ea1960726b42a682c7c2a4a627d36289f71106fc62d464b9c60e65e80641ac361c45a9fad4eca117b804d8557382cd';
  const onClickCasfogLink = () => navigate(casfogRedirectPath);

  useEffect(() => {
    const locationState: any = location.state;
    if (locationState && locationState.scrollToElement) {
      const timer = setTimeout(() => {
        const element = document.getElementById(locationState.scrollToElement);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); 

      return () => clearTimeout(timer);
    }
  }, [location]);
  
  return (
    <Box sx={{ margin: '32px auto' }}>
      <Grid container spacing={8}>
        {/*<ProductSearchTabs />*/}
        <Grid item xs={12}>
          <MarketLandingProductLinesAdvertising loadLinesFn={HttpProductLineChosen.getSelectedProductLines}/>
        </Grid>
        {
          /*
          <BannerCarousel
            lucRedirect={lucRedirectPath} 
            casfogRedirect={casfogRedirectPath} 
          />
          */
        }
      </Grid>
    </Box>
  );
}

export default MarketLandingFilter;