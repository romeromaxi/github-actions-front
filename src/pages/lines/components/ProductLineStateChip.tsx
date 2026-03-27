import React from "react";
import {Chip, Skeleton, Stack, Typography} from "@mui/material";
import {ProductLineStatesColorMapByNumber} from "util/typification/productLineColors";
import {ColorCustomTypeFields} from "types/baseEntities";

interface ProductLineStateChipProps {
  code: number,
  description: string,
  quantity?: number,
  size?: 'small' | 'medium'
}

function ProductLineStateChip({code, description, quantity, size = 'small'}: ProductLineStateChipProps) {
  if (!code)
    return <Skeleton variant={'text'} />
  
  const stateColor = ProductLineStatesColorMapByNumber(code);
  return (
    <Chip label={
        <Stack spacing={0.8} direction='row' alignItems='center'>
            <Typography fontSize={'.75rem !important'} component={'span'}>{`${description}${quantity !== undefined ? ':' : ''}`}</Typography>
            {quantity !== undefined && <Typography fontSize={'.75rem !important'} fontWeight={600}>{quantity}</Typography>}
        </Stack>
        }
          size={size}
          sx={{
            color: stateColor[ColorCustomTypeFields.Dark],
            backgroundColor: stateColor[ColorCustomTypeFields.Light]
          }}
    />
  )
}

export default ProductLineStateChip;