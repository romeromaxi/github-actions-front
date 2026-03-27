import React, { useState } from 'react';
import { Box, Skeleton, Tab, Tabs, tabsClasses } from '@mui/material';
import { getBaseColor } from '../../../../util/typification/generalColors';
import { EnumColors } from '../../../../types/general/generalEnums';
import MoreInfoForm from './MoreInfoForm';
import {
  ProductLineViewDetail,
  ProductLineFields,
} from '../../../../types/lines/productLineData';
import MarketTypography from '../../components/MarketTypography';

const tabsSxOverride = {
  [`& .${tabsClasses.root}`]: {
    marginTop: 0,
  },
  [`& .${tabsClasses.flexContainer}`]: {
    borderBottom: 'none',
  },
  [`& .${tabsClasses.indicator}`]: {
    backgroundColor: getBaseColor(EnumColors.MARKET_BLUE),
  },
};

const tabSxOverride = {
  [`& .${tabsClasses.root}`]: {
    fontWeight: 800,
  },
  [`&.Mui-selected`]: {
    border: 'none',
    borderBottom: 'none',
    borderRadius: '5px 5px 0px 0px',
  },
};

interface ProductLineDetailTabsProps {
  productLine?: ProductLineViewDetail;
}

function ProductLineDetailTabs({ productLine }: ProductLineDetailTabsProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <Tabs
        onChange={handleChange}
        sx={tabsSxOverride}
        value={selectedTab}
        centered
      >
        <Tab
          sx={tabSxOverride}
          label={
            <MarketTypography sx={{ fontWeight: 'bold' }}>
              DISCLAIMER
            </MarketTypography>
          }
        />
        <Tab
          sx={tabSxOverride}
          label={
            <MarketTypography
              sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              Más Información
            </MarketTypography>
          }
        />
      </Tabs>
      <Box
        sx={{
          p: 8,
          mt: 1,
          backgroundColor: '#f2f2f2',
        }}
      >
        {selectedTab === 0 ? (
          productLine?.[ProductLineFields.Disclaimer] ? (
            <MarketTypography>
              <div
                dangerouslySetInnerHTML={{
                  __html: productLine?.[ProductLineFields.Disclaimer] || '',
                }}
              />
            </MarketTypography>
          ) : (
            <MarketTypography>Sin disclaimer</MarketTypography>
          )
        ) : (
          // [...Array(5)].map(() => <Skeleton variant="text" sx={{fontSize: '1rem'}}/>)
          <MoreInfoForm />
        )}
      </Box>
    </div>
  );
}

export default ProductLineDetailTabs;
