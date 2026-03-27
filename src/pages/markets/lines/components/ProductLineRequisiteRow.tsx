import React from 'react';
import { styled, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';

interface ProductLineRequisiteRowProps {
  label: string;
}

function ProductLineRequisiteRow({ label }: ProductLineRequisiteRowProps) {
  return <DataTypography noWrap>{`\u2022 ${label}`}</DataTypography>;
}

const DataTypography = styled(Typography)({
  color: blue[800],
  variant: 'body1',
  fontWeight: 600,
  fontSize: 15,
});

export default ProductLineRequisiteRow;
