import React, { useEffect, useRef, useState } from 'react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import {
  EntityListWithPagination,
  EntityListWithPaginationFields,
  EntityPaginationFields,
} from '../../../types/baseEntities';
import { ProductLineView } from '../../../types/lines/productLineData';
import {
  FilterProductLineSearch,
  FilterProductLineSearchFields,
} from 'types/lines/productLineData';
import { HttpCompany, HttpProductLine } from '../../../http';
import { EnumColors } from '../../../types/general/generalEnums';
import LucInfo from './components/LucInfo';
import MarketCategorySlider from './components/MarketCategorySlider';
import MarketInfoBanner from '../../../layouts/components/MarketInfoBanner';
import { getBaseColor } from '../../../util/typification/generalColors';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DestinyBannerGrid from './components/DestinyBannerGrid';
import RegistrationBanner from './components/RegistrationBanner';
import BankLogoSlider from './components/BankLogoSlider';
import ProductLineCard from '../lines/components/ProductLineCard';
import { CompanyViewDTO } from '../../../types/company/companyData';
import { useNavigate } from 'react-router-dom';
import ProductLineCardLoading from '../lines/components/ProductLineCardLoading';

function MarketHomeOld() {
  const navigate = useNavigate();
  const ref = useRef<null | HTMLDivElement>(null);
  const [productLines, setProductLines] =
    useState<EntityListWithPagination<ProductLineView>>();
  const [filters] = useState<FilterProductLineSearch>({
    [FilterProductLineSearchFields.CodsProductService]: undefined,
    [FilterProductLineSearchFields.CodsProductInstrument]: undefined,
    [EntityPaginationFields.ActualPage]: 1,
    [EntityPaginationFields.PageSize]: 8,
  });
  const [companies, setCompanies] = useState<CompanyViewDTO[]>([]);

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
    ).then(setProductLines);
  };

  const mapLoading = () =>
    Array.from(Array(6).keys()).map((item) => (
      <Grid item xs={4} key={`keyProductLineCardBaseLoading_${item}`}>
        <ProductLineCardLoading />
      </Grid>
    ));

  useEffect(() => {
    searchProductLines(filters);
    HttpCompany.getCompaniesByUser().then((response) => {
      setCompanies(response);
    });
  }, [filters]);

  const handleBeginSearchClick = () => {
    navigate('/market/landing');
    // ref.current?.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <Box>
      <Box mt={-7}>
        <MarketCategorySlider />
      </Box>
      <MarketInfoBanner />
      <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
        <Button
          onClick={handleBeginSearchClick}
          style={{ backgroundColor: 'transparent' }}
          sx={{
            p: 1,
            mt: 5,
            color: getBaseColor(EnumColors.MARKET_BLUE),
            '&:hover': {
              color: 'black',
            },
          }}
        >
          <TuneIcon />
          <Typography fontSize={25}>Comenzar con la búsqueda</Typography>
        </Button>
      </Stack>
      <Container>
        <Typography
          sx={{
            fontSize: '2.25rem',
            fontWeight: 500,
            textAlign: 'center',
            mt: 12,
          }}
        >
          Encuentre su financiación en 4 simples pasos
          <Typography
            display={'block'}
            variant={'caption'}
            sx={{
              fontSize: '1.4375rem',
              fontWeight: 300,
              color: '#444',
              mb: 3,
            }}
          >
            ¿Qué tengo que hacer en LUC para contactarme con los oferentes?
          </Typography>
        </Typography>
        <LucInfo />

        <Stack
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography
            sx={{
              // ...fontFamily,
              fontSize: '1.4375rem',
              fontWeight: '300',
              mt: 5,
            }}
          >
            Comenzar
          </Typography>
          <ExpandMoreIcon fontSize={'large'} />
        </Stack>
      </Container>
      <Box mt={15}>
        <div ref={ref} style={{ scrollMarginTop: '150px' }}>
          <DestinyBannerGrid />
        </div>
      </Box>
      <Typography
        sx={{
          fontSize: '2.25rem',
          fontWeight: 500,
          textAlign: 'center',
          mt: 12,
        }}
      >
        Destacados
        <Typography
          display={'block'}
          variant={'caption'}
          sx={{
            fontSize: '1.4375rem',
            fontWeight: 300,
            color: '#444',
          }}
        >
          Podés ver además el listado completo navegado por categorías
        </Typography>
      </Typography>

      <Container>
        <Grid
          container
          spacing={1}
          item
          lg={12}
          md={9}
          xs={7}
          alignContent="center"
          justifyItems={'center'}
          sx={{ mt: 3 }}
        >
          {productLines
            ? productLines[EntityListWithPaginationFields.List].map(
                (line, index) => (
                  <Grid item xs={6} md={4} lg={3} key={index}>
                    <ProductLineCard productLine={line} />
                  </Grid>
                ),
              )
            : mapLoading()}
        </Grid>
      </Container>
      <Box mt={5} />
      <RegistrationBanner />
      <Container>
        <Box mt={2} />
        <BankLogoSlider />
      </Container>
    </Box>
  );
}

export default MarketHomeOld;
