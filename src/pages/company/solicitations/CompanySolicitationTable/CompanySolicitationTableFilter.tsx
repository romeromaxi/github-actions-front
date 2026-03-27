import React from 'react';
import {
  CompanySolicitationFilter,
  CompanySolicitationFilterFields,
  SolicitationFilterFields,
} from '../../../../types/solicitations/solicitationData';
import { useForm } from 'react-hook-form';
import {
  AsyncSelect,
  ControlledCheckBox, ControlledTextFieldFilled,
} from '../../../../components/forms';
import { grey } from '@mui/material/colors';
import { Grid, IconButton } from '@mui/material';
import { SearchButton } from '../../../../components/buttons/Buttons';
import { HttpCacheProduct } from '../../../../http/cache/httpCacheProduct';
import ClearIcon from '@mui/icons-material/Clear';

interface CompanySolicitationTableFilterProps {
  companyId: number;
  filter?: CompanySolicitationFilter;
  onClickSearch: (filter: CompanySolicitationFilter) => void;
}

function CompanySolicitationTableFilter({
  companyId,
  filter,
  onClickSearch,
}: CompanySolicitationTableFilterProps) {
  const { control, handleSubmit, reset } = useForm<CompanySolicitationFilter>({
    defaultValues: {
      ...filter,
    },
  });

  const loadProducts = () => {
    return HttpCacheProduct.getListByCompanyId(companyId);
  };

  const onSubmit = (data: CompanySolicitationFilter) => {
    onClickSearch(data);
  };

  const clearFilter = () => {
    reset({
      codProducto: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        item
        container
        spacing={2}
        sx={{ mb: 2 }}
        justifyContent={'flex-end'}
      >
        <Grid item xs={4.5}>
          <ControlledTextFieldFilled
            control={control}
            name={CompanySolicitationFilterFields.OffererBusinessName}
            label={'Oferente'}
            sx={{ backgroundColor: '#F5F8FA' }}
            InputLabelProps={{
              style: { color: grey[600] },
            }}
          />
        </Grid>
        <Grid item xs={4.5}>
          <AsyncSelect
            loadOptions={loadProducts}
            control={control}
            label={'Producto'}
            name={CompanySolicitationFilterFields.ProductTypeCode}
            sx={{ backgroundColor: '#F5F8FA' }}
            InputLabelProps={{
              style: { color: grey[600] },
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={clearFilter} sx={{ marginRight: 1 }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <ControlledCheckBox
            label={'Alertas'}
            name={SolicitationFilterFields.HasAlert}
            control={control}
            sx={{ display: 'inline' }}
          />
        </Grid>
        <Grid item xs={2} textAlign={'end'}>
          <SearchButton type={'submit'}>Buscar</SearchButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default CompanySolicitationTableFilter;
