import React from 'react';
import { Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import {
  ProductLineRequisiteDescriptionFields,
  ProductLineRequisiteDescriptionView,
} from 'types/lines/productLineData';

interface ProductLineRequisiteRowProps {
  requisiteDescription: ProductLineRequisiteDescriptionView;
}

function ProductLineRequisiteRowTitle({
  requisiteDescription,
}: ProductLineRequisiteRowProps) {
  const details =
    requisiteDescription[
      ProductLineRequisiteDescriptionFields.DetailDescription
    ];

  return (
    <Stack direction={'row'} gap={1} justifyContent={'space-between'}>
      <Typography
        color={blue[800]}
        variant={'body2'}
        fontWeight={600}
        fontSize={15}
      >
        {
          requisiteDescription[
            ProductLineRequisiteDescriptionFields.Description
          ]
        }
      </Typography>

      <Typography
        color={blue[800]}
        variant={'body2'}
        fontWeight={600}
        fontSize={15}
      >
        {details && details.length == 1 && details[0]}
      </Typography>
    </Stack>
  );
}

export default ProductLineRequisiteRowTitle;
