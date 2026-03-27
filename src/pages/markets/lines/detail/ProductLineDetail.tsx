import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import {
  FilterProductLineSearch,
  FilterProductLineSearchFields,
  ProductLineViewDetail,
  ProductLineFields,
  ProductLineView,
} from '../../../../types/lines/productLineData';
import { HttpOffererProductLine, HttpProductLine } from '../../../../http';
import { Box, Container, Grid, Skeleton, Stack } from '@mui/material';
import {
  EntityListWithPagination,
  EntityListWithPaginationFields,
  EntityPaginationFields,
} from '../../../../types/baseEntities';
import {
  LoadingProductLineRequisiteList,
  ProductLineDetailRequisiteList,
} from './ProductLineRequisiteList';
import { DefaultMarketButton } from '../../../../components/buttons/Buttons';
import ContainersStyles from '../../../../components/misc/Containers.styles';
import ProductLineDetailTabs from './ProductLineDetailTabs';
import ProductSlider from '../components/ProductSlider';
import { ProductLineDetailRequirementList } from './ProductLineRequirementList';
import MarketTypography from '../../components/MarketTypography';
import {
  LoadingProductLineDetailTable,
  ProductLineDetailTable,
} from './ProductLineDetailTable';

function ProductLineDetail() {
  const classes = ContainersStyles();
  let params = useParams();
  const navigate = useNavigate();
  const lineId: number = parseInt(params.idLine ?? '');
  const offererId: number = parseInt(params.idOfferer ?? '');

  const [productLine, setProductLine] = useState<ProductLineViewDetail>();
  const [productLines, setProductLines] =
    useState<EntityListWithPagination<ProductLineView>>();

  useEffect(() => {
    if (lineId && offererId) {
      HttpOffererProductLine.getById(offererId, lineId).then((productLine) => {
        setProductLine(productLine as ProductLineViewDetail);
      });
    }
  }, [lineId, offererId]);

  const searchProductLines = (filter: FilterProductLineSearch) => {
    setProductLines(undefined);

    HttpProductLine.search(
      filter[EntityPaginationFields.PageSize],
      filter[EntityPaginationFields.ActualPage],
      '- ',
      [],
      [],
      [],
      filter[FilterProductLineSearchFields.CodsProductService],
      [],
      filter[FilterProductLineSearchFields.CodsProductInstrument],
      filter[FilterProductLineSearchFields.CodsOfferer],
    ).then(setProductLines);
  };

  useEffect(() => {
    searchProductLines({
      [EntityPaginationFields.PageSize]: 4,
      [EntityPaginationFields.ActualPage]: 1,
    });
  }, []);

  return (
    <>
      <Container>
        <Grid container spacing={10}>
          <Grid item md={6} sm={12}>
            {productLine ? (
              <Stack direction={'column'} justifyContent={'space-between'}>
                <MarketTypography
                  variant={'h5'}
                  sx={{ fontWeight: 600, fontSize: '0.875em', color: '#444' }}
                >
                  {productLine[ProductLineFields.OffererBusinessName]}
                </MarketTypography>

                <MarketTypography
                  variant={'body2'}
                  sx={{ fontSize: '16px', color: '#444' }}
                >
                  {productLine[ProductLineFields.LineLarge]}
                </MarketTypography>

                <Box mt={10} />
                <ProductLineDetailTable productLine={productLine} />
              </Stack>
            ) : (
              <Stack direction={'column'} justifyContent={'space-between'}>
                <Skeleton variant="text" sx={{ fontSize: '0.875em' }} />

                {[...Array(5)].map(() => (
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                ))}

                <Box mt={10} />
                <LoadingProductLineDetailTable />
              </Stack>
            )}
          </Grid>
          <Grid item md={6} sm={12}>
            <Stack
              sx={{ height: 1 }}
              direction={'column'}
              gap={5}
              justifyContent={'space-between'}
            >
              {productLine ? (
                <>
                  <ProductLineDetailRequisiteList productLine={productLine} />
                  <ProductLineDetailRequirementList productLine={productLine} />
                </>
              ) : (
                <>
                  <div>
                    <MarketTypography
                      variant={'h6'}
                      style={{ fontWeight: 'bold' }}
                    >
                      Requisitos
                    </MarketTypography>
                    <LoadingProductLineRequisiteList />
                  </div>
                  <div>
                    <MarketTypography
                      variant={'h6'}
                      style={{ fontWeight: 'bold' }}
                    >
                      Requerimientos
                    </MarketTypography>
                    <LoadingProductLineRequisiteList />
                  </div>
                </>
              )}

              <DefaultMarketButton
                onClick={() => navigate('/market/lines/prequalification')}
                fullWidth
              >
                PRECALIFICATE
              </DefaultMarketButton>
            </Stack>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
        <Box mt={5} />
      </Container>

      <ProductLineDetailTabs productLine={productLine} />
      <Container className={classes.mainContainer}>
        <MarketTypography
          sx={{
            fontWeight: 500,
            color: '#111',
            textAlign: 'center',
            fontSize: '2.25rem',
            lineHeight: 1.2,
            mb: 2,
          }}
          variant={'h2'}
        >
          Líneas Similares
        </MarketTypography>
        <Grid container spacing={1}>
          {productLines?.[EntityListWithPaginationFields.List] && (
            <ProductSlider
              lineList={productLines[EntityListWithPaginationFields.List]}
            />
          )}
        </Grid>
      </Container>
    </>
  );
}

export default ProductLineDetail;
