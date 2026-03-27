import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import FavoriteIconButton from '../../components/icons/FavoriteIconButton';

import ProductLineRequisiteList from '../ProductLineRequisiteList';
import ProductLineRequirementList from '../ProductLineRequirementList';

import { ProductLineViewDetail, ProductLineFields } from 'types/lines/productLineData';

// root component interface
interface ProductLineDetailCardBaseProps {
  productLine: ProductLineViewDetail;
  children: React.ReactElement[];
}

export interface ProductLineChildrenDetailCardProps {
  productLine: ProductLineViewDetail;
}

const ProductLineDetailCardBase: FC<ProductLineDetailCardBaseProps> = ({
  productLine,
  children,
}) => {
  const navigate = useNavigate();

  const onPrequalification = () =>
    navigate(
      `/market/lines/prequalification/${productLine[ProductLineFields.OffererId]}/${productLine[ProductLineFields.Id]}`,
    );

  return (
    <Card>
      <CardContent>
        <Grid container mb={1} spacing={1} gap={1}>
          <Grid
            container
            item
            xs={12}
            md={6}
            sx={{ gap: '0px !important', height: 'fit-content' }}
          >
            <Grid item xs={12}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="column">
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ height: '40px !important' }}
                  >
                    <AccountBalanceIcon fontSize="small" />
                    <Typography marginLeft={1}>
                      <Typography>
                        {productLine[ProductLineFields.OffererBusinessName]}
                      </Typography>
                    </Typography>
                  </Box>
                  <Grid item xs={12} mb={1}>
                    <Typography
                      sx={{
                        fontStyle: 'normal',
                        fontWeight: 300,
                        fontSize: '14px',
                        lineHeight: '22px',
                        color: 'rgb(95, 116, 141)',
                      }}
                    >
                      {productLine[ProductLineFields.LineLarge]}
                    </Typography>
                  </Grid>
                </Stack>

                <FavoriteIconButton
                  productLineId={productLine[ProductLineFields.Id]}
                  isInShoppingCart={
                    productLine[ProductLineFields.IsInShoppingCart]
                  }
                />
              </Stack>
            </Grid>
            {children}
            <Grid item xs={12} mt={1}>
              <ProductLineRequisiteList
                productLineId={productLine[ProductLineFields.Id]}
              />
            </Grid>
          </Grid>
          <Grid container item xs={0} md={1} sx={{ maxWidth: '3% !important' }}>
            <Divider orientation={'vertical'} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <ProductLineRequirementList
                productLineId={productLine[ProductLineFields.Id]}
              />

              <Button
                variant="contained"
                onClick={onPrequalification}
                sx={{ width: '40%' }}
              >
                Precalificate
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductLineDetailCardBase;
