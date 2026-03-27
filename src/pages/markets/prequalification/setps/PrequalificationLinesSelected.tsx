import React from 'react';
import { Box, Card, Checkbox, Tooltip, Typography } from '@mui/material';

import { EntityWithIdFields } from 'types/baseEntities';
import {
  ProductLineFields,
  ProductLineView,
} from 'types/lines/productLineData';

import { stringFormatter } from 'util/formatters/stringFormatter';

interface PrequalificationLinesSelectedProps {
  productLine: ProductLineView;
  selected: boolean;
  onSelect: (productLineId: number, drop: boolean) => void;
}

function PrequalificationLinesSelected({
  productLine,
  selected,
  onSelect,
}: PrequalificationLinesSelectedProps) {
  const color: string = selected ? 'rgb(36, 153, 239)' : 'rgb(211, 230, 243)';

  return (
    <Card
      sx={{
        padding: '16px',
        border: `1px solid ${color}`,
        borderRadius: '4px',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale3d(1.05, 1.05, 1)',
          boxShadow: '2px 1px 6px 0px #bebebe',
        },
      }}
    >
      <Box
        onClick={() => onSelect(productLine[EntityWithIdFields.Id], selected)}
      >
        <Box
          sx={{
            margin: '-10px -10px 1px -10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Checkbox
            disableRipple
            checked={selected}
            onChange={(_, value) => {
              onSelect(productLine[EntityWithIdFields.Id], !value);
            }}
            name="terms"
          />
          <Typography>{productLine[ProductLineFields.Line]}</Typography>
        </Box>
        <Tooltip
          title={productLine[ProductLineFields.LineLarge]}
          inputMode="text"
          placement="bottom"
        >
          <div>
            <Typography
              sx={{
                fontStyle: 'normal',
                fontWeight: 300,
                fontSize: '14px',
                lineHeight: '22px',
                height: '72px !important',
                color: 'rgb(95, 116, 141)',
              }}
            >
              {stringFormatter.cutIfHaveMoreThan(
                productLine[ProductLineFields.LineLarge],
                150,
              )}
            </Typography>
          </div>
        </Tooltip>
      </Box>
    </Card>
  );
}

export default PrequalificationLinesSelected;
