import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { MarketLandingFilterContext } from '../../MarketLandingFilter';
import { Alert } from '@mui/lab';
import { DefaultStylesButton } from 'components/buttons/Buttons';
import {
  IntermediateProductFields,
  IntermediateProductView,
} from 'types/market/marketIntermediateData';
import {
  createSearchParams,
  URLSearchParamsInit,
  useNavigate,
} from 'react-router-dom';
import MarketFilteredProductsStyles from './MarketFilteredProducts.styles';
import { EntityWithIdFields } from 'types/baseEntities';
import { SearchRounded } from '@mui/icons-material';
import { stringFormatter } from 'util/formatters/stringFormatter';
import {
  marketFilterStorage,
  MarketLandingFilter,
} from 'util/sessionStorage/marketFiltersStorage';
import { FilterProductLineSearchFields } from 'types/lines/productLineData';
import { boxSx } from '../../../../company/activity/components/ActivityBox.styles';
import { grey } from '@mui/material/colors';
import { getBaseColor } from 'util/typification/generalColors';
import { EnumColors } from 'types/general/generalEnums';
import useSecurityObject from 'hooks/useSecurityObject';
import FailRedirectMarketDialog from '../FailRedirectMarketDialog';
import { AppRouteSecObjects, SecurityComponents } from 'types/security';

interface MarketFilteredProductsProps {
  title: React.ReactNode;
}

function MarketFilteredProducts({ title }: MarketFilteredProductsProps) {
  const navigate = useNavigate();
  const { hasReadPermission } = useSecurityObject();
  const {
    destinyCode,
    serviceCode,
    instrumentTypeCode,
    selectedFilter,
    products,
    primaryParam,
  } = useContext(MarketLandingFilterContext);

  const [productSelected, setProductSelected] = useState<number[]>([]);
  const [failRoute, setFailRoute] = useState<boolean>(false);

  const goToSearchProductLine = () => {
    if (
      !hasReadPermission(
        SecurityComponents.AppRoutes,
        AppRouteSecObjects.MarketProductLineSearchRoute,
      )
    ) {
      setFailRoute(true);
      return;
    }

    let listParams: URLSearchParamsInit | undefined = [];
    const newFilter: MarketLandingFilter = {};
    if (!productSelected.length) {
      if (destinyCode) {
        listParams.push(['destiny', `${destinyCode}`]);
        newFilter[FilterProductLineSearchFields.CodsProductDestiny] = [
          destinyCode,
        ];
      }
      if (serviceCode) {
        listParams.push(['service', `${serviceCode}`]);
        newFilter[FilterProductLineSearchFields.CodsProductService] = [
          serviceCode,
        ];
      }
      if (instrumentTypeCode) {
        listParams.push(['instrumentType', `${instrumentTypeCode}`]);
        newFilter[FilterProductLineSearchFields.CodsProductInstrumentType] = [
          instrumentTypeCode,
        ];
      }
    } else {
      listParams.push([
        'products',
        `${productSelected.map((select) => `${select}`)}`,
      ]);
      newFilter[FilterProductLineSearchFields.CodsProduct] = productSelected;
    }

    let searchParams = createSearchParams(listParams);
    // marketFilterStorage.clearLandingFilter()
    marketFilterStorage.clearSearchFilter();
    marketFilterStorage.clearStackedFilters();
    marketFilterStorage.savePrimarySearchParam({
      name: primaryParam?.[0] || '',
      value: primaryParam?.[1] || '',
    });
    marketFilterStorage.saveLandingFilter(newFilter);
    navigate(`/market/lines?${searchParams}`);
  };

  const onSelectProduct = (product: number, drop: boolean) => {
    if (drop) setProductSelected(productSelected.filter((x) => x !== product));
    else setProductSelected([...productSelected, product]);
  };

  return (
    <Box>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{ mb: 1 }}
      >
        <div>{title}</div>

        {selectedFilter && (
          <Stack direction={'row-reverse'}>
            <DefaultStylesButton
              sx={{ mb: 1 }}
              onClick={goToSearchProductLine}
              startIcon={<SearchRounded />}
            >
              {productSelected && productSelected.length
                ? `Ver seleccionados (${productSelected.length})`
                : 'Ver todos'}
            </DefaultStylesButton>
          </Stack>
        )}
      </Stack>

      {selectedFilter ? (
        <Grid container spacing={1}>
          {products && products.length ? (
            products.map((product, index) => (
              <Grid item xs={3} key={`productCard_${index}`}>
                <ProductCard
                  product={product}
                  selected={productSelected.some(
                    (x) => x === product[EntityWithIdFields.Id],
                  )}
                  onSelect={onSelectProduct}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert color={'info'} severity={'info'}>
                No se han encontrado productos para los parámetros elegidos
              </Alert>
            </Grid>
          )}
        </Grid>
      ) : (
        <Alert color={'info'} severity={'info'}>
          Primero tenés que seleccionar una categoría.
        </Alert>
      )}

      <FailRedirectMarketDialog
        open={failRoute}
        onClose={() => {
          setFailRoute(false);
        }}
        hideTitle
      />
    </Box>
  );
}

interface ProductCardProps {
  product: IntermediateProductView;
  selected: boolean;
  onSelect: (productId: number, drop: boolean) => void;
}

function ProductCard(props: ProductCardProps) {
  const classes = MarketFilteredProductsStyles();

  return (
    <Card
      className={classes.rootProductCard}
      sx={{
        border: props.selected
          ? `1px solid ${getBaseColor(EnumColors.MARKET_BLUE)}`
          : '',
        '&:hover': {},
      }}
    >
      <CardActionArea
        onClick={() => {
          props.onSelect(props.product[EntityWithIdFields.Id], props.selected);
        }}
        sx={{
          height: 1,
          width: 1,
          p: 1,
        }}
      >
        <Stack
          direction={'column'}
          alignItems={'center'}
          justifyContent={'flex-start'}
          gap={2}
          // onClick={() => {
          //     props.onSelect(props.product[EntityWithIdFields.Id], props.selected)
          // }}
        >
          <Tooltip title={props.product[IntermediateProductFields.ProductDesc]}>
            <Typography className={classes.productTitle}>
              {stringFormatter.cutIfHaveMoreThan(
                props.product[IntermediateProductFields.ProductDesc],
                45,
              )}
            </Typography>
          </Tooltip>
          <Grid container spacing={2} justifyContent={'center'}>
            <Grid item xs={5}>
              <Box sx={{ ...boxSx, padding: 1 }}>
                <Typography sx={numberTypographySx}>
                  {props.product[IntermediateProductFields.OffererQuantity]}
                </Typography>
                <Typography sx={labelTypographySx}>Oferentes</Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box sx={{ ...boxSx, padding: 1 }}>
                <Typography sx={numberTypographySx}>
                  {props.product[IntermediateProductFields.LineQuantity]}
                </Typography>
                <Typography sx={labelTypographySx}>Líneas</Typography>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

const numberTypographySx = {
  fontSize: '1.125rem',
  fontWeight: 800,
  color: getBaseColor(EnumColors.MARKET_BLUE),
  textAlign: 'center',
};
const labelTypographySx = {
  fontWeight: 600,
  color: grey[400],
  textAlign: 'center',
};

export default MarketFilteredProducts;
