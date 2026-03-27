import React from 'react';
import { Grid, Stack } from '@mui/material';
import { NavsTabHorizontal } from "components/navs/NavsTab";
import SearchIcon from "@mui/icons-material/Search";
import { WrapperIcons } from "components/icons/Icons";
import MarketLookingForLinesLandingFilter from "./MarketLookingForLinesLandingFilter";

const ProductSearchTabs = () => {
  return (
    <Grid 
      id={'search-by-products'} 
      item xs={12} md={12} 
      sx={{
        justifyContent: 'center !important', 
        alignItems: 'center !important', 
        scrollMarginTop: '64px'
      }}
    >
      <Stack sx={{ width: '90% !important', margin: '0 auto' }}>
        <NavsTabHorizontal 
          fullWidth 
          alignLeft 
          disableNavigation 
          lstTabs={[{
            tabList: [{
              label: 'Búsqueda por productos',
              icon: <WrapperIcons Icon={SearchIcon} size={'xs'} />,
              content: <MarketLookingForLinesLandingFilter data-cy={'market-landing-lines-filter'}/>,
              iconPosition: 'start',
              id: 'search-by-products-tab',
              default: true
            }]
          }]} 
        />
      </Stack>
    </Grid>
  );
};

export default ProductSearchTabs;