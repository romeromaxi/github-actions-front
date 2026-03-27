import React, { useContext, useEffect, useState } from 'react';
import {Grid, Stack, Typography} from '@mui/material';
import DataBox from '../../reports/components/DataBox';
import {
  ProductLineTotalsView,
  ProductLineTotalsViewFields,
} from 'types/lines/productLineData';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from 'types/baseEntities';
import { HttpOffererProductLine } from 'http/index';
import { OffererContext } from '../../components/OffererContextProvider';
import ProductLineStateChip from "../../../lines/components/ProductLineStateChip";

function LineListHeader() {
  const offerer = useContext(OffererContext);
  const [totals, setTotals] = useState<ProductLineTotalsView[]>();
  const totalAmount = totals?.reduce(
    (partial, a) =>
      partial + a[ProductLineTotalsViewFields.ProductLinesQuantity],
    0,
  );

  const loadTotals = (offererId: number) => {
    setTotals(undefined);
    HttpOffererProductLine.getTotalProductLinesByOfferer(offererId)
      .then(setTotals)
      .catch(() => setTotals([]));
  };

  useEffect(() => {
    if (offerer && offerer[EntityWithIdFields.Id])
      loadTotals(offerer[EntityWithIdFields.Id]);
  }, [offerer]);

  return (
      <Grid container spacing={2}>
        {totals && (
            <Grid item md={3}>
              <DataBox
                labelSx={{ fontWeight: 600, fontSize: '1.25rem' }}
                label={'Líneas'}
                value={
                  <Typography
                    fontWeight={600}
                    fontSize={'1.45rem'}
                    color={'primary'}
                  >
                    {totalAmount}
                  </Typography>
                }
                borderStyle={'none'}
              />  
            </Grid>
        )}
        {totals &&
            <Grid item md={9}>
              <Stack direction="row" gap={2} flexWrap="wrap">
                {totals.map((total, index) => (
                    <ProductLineStateChip
                        key={`productLine_state_${index}`}
                        code={total[EntityWithIdFields.Id]}
                        quantity={total[ProductLineTotalsViewFields.ProductLinesQuantity] ?? 0}
                        description={total[EntityWithIdAndDescriptionFields.Description]}
                    />
                ))}
              </Stack>
            </Grid>
        }
      </Grid>
  );
}

export default LineListHeader;
