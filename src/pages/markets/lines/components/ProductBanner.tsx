import React, { useEffect, useState } from 'react';
import {
  ProductLineViewDetail,
  ProductLineFields,
} from '../../../../types/lines/productLineData';
import { HttpMarketIntermediate } from '../../../../http/market';
import {IntermediateDataViewFields} from '../../../../types/market/marketIntermediateData';
import { Box, Stack, Typography } from '@mui/material';
import { EntityWithIdFields } from 'types/baseEntities';

interface ProductBannerProps {
  product: ProductLineViewDetail;
}

function ProductBanner({ product }: ProductBannerProps) {
  const [bannerUrl, setBannerUrl] = useState<string>('');

  useEffect(() => {
    Promise.all([
      HttpMarketIntermediate.getIntermediateDestinies(),
      // HttpMarketIntermediate.getIntermediateServices(),
      // HttpMarketIntermediate.getIntermediateInstrumentTypes()
    ]).then(([destinies]) => {
      const foundBanner = destinies.find(
        (destiny) =>
          destiny[EntityWithIdFields.Id] ===
          product[ProductLineFields.ProductDestinyCode],
      );
      setBannerUrl(
        foundBanner?.[IntermediateDataViewFields.UrlImage] ||
          destinies[0][IntermediateDataViewFields.UrlImage],
      );
    });
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      {
        // bannerUrl
        // &&
        <Box
          sx={{
            height: '286px',
            backgroundImage: `url(${bannerUrl})`,
            width: 1,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Stack
            direction={'column'}
            justifyContent={'center'}
            alignItems={'flex-start'}
            gap={3}
            style={{
              width: '100%',
              height: '100%',
              opacity: 1,
              zIndex: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            sx={{ p: 2 }}
          >
            <Typography
              sx={{
                fontSize: '2.5rem',
                fontWeight: 900,
                textAlign: 'left',
                textTransform: 'uppercase',
                color: 'white',
              }}
              variant={'h4'}
            >
              {product[ProductLineFields.Line]}
            </Typography>
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 900,
                textAlign: 'left',
                textTransform: 'uppercase',
                color: 'white',
              }}
              variant={'h4'}
            >
              {product[ProductLineFields.OffererBusinessName]}
            </Typography>
          </Stack>
        </Box>
      }
    </div>
  );
}

export default ProductBanner;
