import React, { useEffect, useState } from 'react';
import { ProductLineRequisiteDescriptionView } from 'types/lines/productLineData';
import { Card, CardContent, CardHeader, Stack } from '@mui/material';
import MarketTypography from '../../components/MarketTypography';
import { HttpProductLineRequisite } from 'http/index';
import ProductLineRequisiteRowGroup from './ProductLineRequisiteRowGroup';
import { Skeleton } from '@mui/lab';

interface ProductLineRequisiteCardProps {
  productLineId: number;
}

function ProductLineRequisiteCard({
  productLineId,
}: ProductLineRequisiteCardProps) {
  const [requisitesDescription, setRequisitesDescription] =
    useState<ProductLineRequisiteDescriptionView[]>();

  const renderLoading = () =>
    [1, 2, 3].map((x) => (
      <Skeleton key={`productLineRequisiteCardLoading_${x}`} />
    ));

  useEffect(() => {
    setRequisitesDescription(undefined);

    HttpProductLineRequisite.getRequisiteDescriptionByProductLine(
      productLineId,
    ).then(setRequisitesDescription);
  }, [productLineId]);

  return (
    <Card>
      <CardHeader
        title={
          <MarketTypography fontSize={16} fontWeight={700}>
            ¿Para qué Pymes está destinada la línea?
          </MarketTypography>
        }
        subheader={
          <MarketTypography fontSize={13} fontWeight={500}>
            Conocé los requisitos
          </MarketTypography>
        }
      />
      <CardContent sx={{ pl: 0 }}>
        <Stack direction={'column'} gap={1}>
          {requisitesDescription
            ? requisitesDescription.map((description) => (
                <ProductLineRequisiteRowGroup
                  requisiteDescription={description}
                />
              ))
            : renderLoading()}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProductLineRequisiteCard;
