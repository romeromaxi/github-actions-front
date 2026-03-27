import React, { FC } from 'react';

import { Grid } from '@mui/material';

import { DataWithLabel } from 'components/misc/DataWithLabel';

import ProductLineDetailCardBase, {
  ProductLineChildrenDetailCardProps,
} from './ProductLineDetailCardBase';

import { ProductLineFields } from 'types/lines/productLineData';

import { dateFormatter } from 'util/formatters/dateFormatter';
import { numberFormatter } from 'util/formatters/numberFormatter';

const ProductLineFinancingDetailCard: FC<
  ProductLineChildrenDetailCardProps
> = ({ productLine }) => {
  const codCurrency: string =
    productLine[ProductLineFields.CurrencyCodeDesc] || '$';
  const textUnspecified: string = 'Sin especificar';

  return (
    <ProductLineDetailCardBase productLine={productLine}>
      <Grid item xs={12}>
        <DataWithLabel
          label="Moneda"
          data={productLine[ProductLineFields.CurrencyDesc] || textUnspecified}
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="Monto"
          data={`${numberFormatter.toStringWithAmount(productLine[ProductLineFields.AmountMin] || null, codCurrency)} - ${numberFormatter.toStringWithAmount(productLine[ProductLineFields.AmountMax] || null, codCurrency)}`}
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="Vigencia"
          data={`${dateFormatter.toShortDate(productLine[ProductLineFields.DateSince] || null)} - ${dateFormatter.toShortDate(productLine[ProductLineFields.DateTo] || null)}`}
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label={`${productLine[ProductLineFields.HasPeriodGrace] ? 'Meses de Gracias' : 'Período Gracia'}`}
          data={`${productLine[ProductLineFields.HasPeriodGrace] ? productLine[ProductLineFields.MonthGrace] : 'No'}`}
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="Plazo"
          data={`${productLine[ProductLineFields.MonthsMin] || textUnspecified} - ${productLine[ProductLineFields.MonthsMax] || textUnspecified}`}
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="Tipo de Tasa"
          data={productLine[ProductLineFields.RateDesc] || textUnspecified}
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="Tasa"
          data={`${productLine[ProductLineFields.RateMin]}% - ${productLine[ProductLineFields.RateMax]}%`}
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="Tipo de Amortización"
          data={
            productLine[ProductLineFields.AmortizationDesc] || textUnspecified
          }
        />
      </Grid>
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
          label="Gastos"
          data={numberFormatter.toStringWithAmount(
            productLine[ProductLineFields.Expenses] || null,
            codCurrency,
          )}
        />
      </Grid>
    </ProductLineDetailCardBase>
  );
};

export default ProductLineFinancingDetailCard;
