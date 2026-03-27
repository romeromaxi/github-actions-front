import React from 'react';
import {
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import { ProductLineApprovalResultType } from 'types/lines/productLineEnums';
import {
  ProductLineApprovalFields,
  ProductLineApprovalView,
} from 'types/lines/productLineApprovalData';

interface ProductLineDetailApprovalHistoricItemProps {
  approval: ProductLineApprovalView;
}

function ProductLineDetailApprovalHistoricItem({
  approval,
}: ProductLineDetailApprovalHistoricItemProps) {
  return (
    <Grid container justifyContent={'center'} spacing={2}>
      <Grid item xs={12}>
        <Stack spacing={1}>
          <Typography fontSize={16} fontWeight={600}>
            Consideraciones
          </Typography>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={5}
            fullWidth
            defaultValue={approval[ProductLineApprovalFields.Justification]}
            disabled
          />
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <ToggleButtonGroup
          color={'primary'}
          value={
            approval[
              ProductLineApprovalFields.ProductLineApprovalResultCode
            ] === ProductLineApprovalResultType.Approved
              ? 'aprobado'
              : 'rechazado'
          }
          exclusive
          aria-label={'Aprobación'}
          size={'large'}
          fullWidth
          disabled
        >
          <ToggleButton value={'rechazado'} color={'error'}>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <Typography fontSize={16} fontWeight={600}>
                RECHAZADO
              </Typography>
              <CloseIcon fontSize={'small'} />
            </Stack>
          </ToggleButton>
          <ToggleButton value={'aprobado'} color={'success'}>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <Typography fontSize={16} fontWeight={600}>
                APROBADO
              </Typography>
              <CheckIcon fontSize={'small'} />
            </Stack>
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
}

export default ProductLineDetailApprovalHistoricItem;
