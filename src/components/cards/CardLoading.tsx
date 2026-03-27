import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  SxProps,
} from '@mui/material';

interface CardLoadingProps {
  sx?: SxProps;
}
function CardLoading({ sx }: CardLoadingProps) {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack>
          <Skeleton width="90%" />
          <Skeleton width={'35%'} />
        </Stack>

        <Box mt={3}>
          <Skeleton />
          {sx && <Skeleton />}
        </Box>

        <Box mt={3}>
          <Skeleton width={'85%'} />
          {sx && <Skeleton width={'50%'} />}
        </Box>
      </CardContent>
    </Card>
  );
}

export default CardLoading;
