import React, { FC, useContext, useMemo } from 'react';

import {Paper, Stack, useMediaQuery, useTheme, Button, Badge, Divider} from '@mui/material';
import MarketTypography from '../components/MarketTypography';
import { ProductLineFilterContext } from './ProductLineSearch';
import ProductLineGondolaFilters from "./filter/ProductLineGondolaFilters";

const ProductLineFilter: FC = () => {
  const { selectedValues, filterOpts } = useContext(ProductLineFilterContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const totalFilters = useMemo(() => {
    if (!selectedValues) return 0;
    return Object.values(selectedValues).reduce((total, filters) => {
      return total + filters.filter(v => v.id && v.id !== 0).length;
    }, 0);
  }, [selectedValues]);

  return (
    <Paper sx={{ padding: '20px 16px 16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
      {!isMobile && <ProductLineFilterTitle label={'Filtros'} filterCount={totalFilters} />}
        <Stack spacing={2} width="100%">
          {!isMobile && <Divider />}
          <ProductLineGondolaFilters filterOptions={filterOpts} />
        </Stack>
    </Paper>
  );
};

interface ProductLineFilterTitleProps {
  label: string;
  subtitle?: boolean;
  filterCount: number;
}

function ProductLineFilterTitle({
  label,
  filterCount
}: ProductLineFilterTitleProps) {
  const { clearFilters } = useContext(ProductLineFilterContext);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
      <Stack direction="row" alignItems="center" spacing={3}>
        <MarketTypography variant={'h5'}>
          {label}
        </MarketTypography>
        {filterCount > 0 && (
          <Badge badgeContent={filterCount} color="primary"/>
        )}
      </Stack>
      <Button variant="text" onClick={clearFilters} disabled={filterCount === 0} size="small">
        Limpiar
      </Button>
    </Stack>
  );
}

export default ProductLineFilter;