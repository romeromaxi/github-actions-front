import React, { useEffect, useState } from 'react';
import {
  Box,
  breadcrumbsClasses,
  Container,
  IconButton,
  Stack,
} from '@mui/material';
import { useParams } from 'react-router';
import MarketBreadcrumbs, { MarketBreadcrumb } from './MarketBreadcrumbs';
import MarketTypography from '../../../pages/markets/components/MarketTypography';
import ContainersStyles from '../../../components/misc/Containers.styles';
import { HttpOffererProductLine } from 'http/index';
// @ts-ignore
import bankLogo from '../../../assets/img/bankLogos/Banco2.png';

import {ProductLineFields, ProductLineView, ProductLineViewDetail} from '../../../types/lines/productLineData';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import WishlistActionButton from '../../../pages/markets/lines/wishlist/WishlistActionButton';
import ShoppingBagActionButton from '../../../pages/markets/lines/shoppingbag/ShoppingBagActionButton';

function MarketLineDetailBreadcrumbsContainer() {
  const containerClasses = ContainersStyles();
  let params = useParams();

  const lineId: number = parseInt(params.idLine ?? '');
  const offererId: number = parseInt(params.idOfferer ?? '');
  const [line, setLine] = useState<ProductLineViewDetail>();

  const getCompanies = () => {}

  useEffect(() => {
    if (lineId && offererId) {
      HttpOffererProductLine.getById(offererId, lineId).then((productLine) => {
        setLine(productLine);
      });
    }
  }, [lineId, offererId]);

  const lineDetailBreadcrumbsElements: MarketBreadcrumb[] = [
    { label: '', to: 'market/home' },
    { label: 'Líneas', to: 'market/lines' },
    { label: 'Detalle de la línea' },
  ];
  return (
    <Box sx={{ backgroundColor: '#f8f8f8', p: 5 }}>
      <Container>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <div>
            <MarketBreadcrumbs
              breadcrumbs={lineDetailBreadcrumbsElements}
              labelProps={{ sx: { color: 'black' } }}
              breadcrumbsProps={{
                sx: {
                  [`& .${breadcrumbsClasses.separator}`]: {
                    color: 'black',
                  },
                },
              }}
            />
            <Stack direction={'row'} gap={1} alignItems={'center'}>
              <MarketTypography
                variant={'h6'}
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: '#111',
                  display: 'block',
                  textAlign: 'left',
                }}
              >
                {line?.[ProductLineFields.Line] || 'Linea'}
              </MarketTypography>
              {line && (
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  spacing={2}
                >
                  <WishlistActionButton
                    favoriteAddComponent={
                      <IconButton>
                        <FavoriteBorderIcon
                          fontSize={'large'}
                          sx={{ stroke: 'white', strokeWidth: 1, mt: 0.5 }}
                        />
                      </IconButton>
                    }
                    favoriteRemoveComponent={
                      <IconButton>
                        <FavoriteIcon
                          fontSize={'large'}
                          sx={{ stroke: 'white', strokeWidth: 1, mt: 0.5 }}
                        />
                      </IconButton>
                    }
                    productLine={line as unknown as ProductLineView}
                  />
                  <ShoppingBagActionButton
                    productLine={line as unknown as ProductLineView}
                    shoppingBagAddComponent={
                      <IconButton>
                        <ShoppingBagOutlinedIcon
                          fontSize={'large'}
                          sx={{ stroke: 'white', strokeWidth: 1, mt: 0.5 }}
                        />
                      </IconButton>
                    }
                    shoppingBagRemoveComponent={
                      <IconButton>
                        <ShoppingBagIcon
                          fontSize={'large'}
                          sx={{ stroke: 'white', strokeWidth: 1, mt: 0.5 }}
                        />
                      </IconButton>
                    }
                    reloadCompanies={getCompanies}
                    basic={true}
                  />
                </Stack>
              )}
            </Stack>

            <MarketTypography
              variant={'h6'}
              sx={{
                fontSize: '1rem',
                fontWeight: 500,
                color: '#111',
                display: 'block',
                textAlign: 'left',
              }}
            >
              {line?.[ProductLineFields.ProductDesc] || 'Producto'}
            </MarketTypography>
          </div>

          <Box
            sx={{
              borderRadius: '10px',
              objectFit: 'contain',
              width: 115,
              height: 50,
            }}
            component="img"
            alt="Logo Banco"
            src={bankLogo}
          />
        </Stack>
      </Container>
    </Box>
  );
}

export default MarketLineDetailBreadcrumbsContainer;
