import React, { FC } from 'react';

import { Grid } from '@mui/material';

import { DataWithLabel } from 'components/misc/DataWithLabel';

import ProductLineDetailCardBase, {
  ProductLineChildrenDetailCardProps,
} from './ProductLineDetailCardBase';

import { ProductLineFields } from 'types/lines/productLineData';

import { dateFormatter } from 'util/formatters/dateFormatter';
import { numberFormatter } from 'util/formatters/numberFormatter';

const ProductLineOtherServicesDetailCard: FC<
  ProductLineChildrenDetailCardProps
> = ({ productLine }) => {
  const codCurrency: string =
    productLine[ProductLineFields.CurrencyCodeDesc] || '$';

  return (
    <ProductLineDetailCardBase productLine={productLine}>
      <Grid item xs={12}>
        <DataWithLabel
          label="Comisiones"
          data={numberFormatter.toStringWithAmount(
            productLine[ProductLineFields.Commission] || null,
            codCurrency,
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="Monto"
          data={`${numberFormatter.toStringWithAmount(productLine[ProductLineFields.Amount] || null, codCurrency)}`}
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="Vigencia"
          data={`${dateFormatter.toShortDate(productLine[ProductLineFields.DateSince] || null)} - ${dateFormatter.toShortDate(productLine[ProductLineFields.DateTo] || null)}`}
        />
      </Grid>
    </ProductLineDetailCardBase>
  );
};

export default ProductLineOtherServicesDetailCard;
