import React, {useEffect, useState} from 'react';
import {Alert, Box, Grid, Stack, Typography} from '@mui/material';
import {Skeleton} from '@mui/lab';

import {ProductLineApprovalFields, ProductLineApprovalView,} from 'types/lines/productLineApprovalData';
import {HttpProductLineApproval} from 'http/index';
import {useProductLineDetail} from '../ProductLineDetailContext';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import {getBaseColor} from 'util/typification/generalColors';
import {EnumColors} from 'types/general/generalEnums';
import {dateFormatter} from 'util/formatters/dateFormatter';

function ProductLineDetailApprovalPublicationResult() {
  const { lineId } = useProductLineDetail();
  const [loading, setLoading] = useState<boolean>(true);
  const [actualApproval, setActualApproval] =
    useState<ProductLineApprovalView>();
  const approved: boolean =
    !!actualApproval &&
    !!actualApproval[ProductLineApprovalFields.ApprovalResultDate];

  useEffect(() => {
    setLoading(true);
    HttpProductLineApproval.getActualByProductLineId(lineId)
      .then(setActualApproval)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container spacing={1}>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton />
        </Grid>
      ) : approved && actualApproval ? (
        <Grid item xs={12}>
          <ProductLineDetailApprovalPublicationResultConfirm
            approval={actualApproval}
          />
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Alert severity="info">La línea aún no se ha publicado</Alert>
        </Grid>
      )}
    </Grid>
  );
}

interface ProductLineDetailApprovalPublicationResultConfirmProps {
  approval: ProductLineApprovalView;
}

export function ProductLineDetailApprovalPublicationResultConfirm({
  approval,
}: ProductLineDetailApprovalPublicationResultConfirmProps) {
  return (
    <Stack width={1} alignItems={'center'}>
      <Stack direction={'row'} alignItems={'center'} spacing={1}>
        <Typography fontSize={20} fontWeight={700} textAlign={'center'}>
          Se aprobó la publicación de la línea
        </Typography>
        <Typography fontSize={15} fontWeight={600} color={'#A1A5B7 !important'}>
          {`(${dateFormatter.toLongDate(approval[ProductLineApprovalFields.ApprovalResultDate] || '')})`}
        </Typography>
      </Stack>
      <Grid item xs={12} textAlign="center">
        <Box sx={{ maxWidth: '500px' }}>
          <CheckCircleRoundedIcon
            sx={{
              userSelect: 'none',
              width: '1em',
              height: '1em',
              display: 'inline-block',
              flexShrink: 0,
              transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              fontSize: '100px',
              marginBottom: '16px',
              color: 'green',
            }}
          />
        </Box>
      </Grid>
    </Stack>
  );
}

export default ProductLineDetailApprovalPublicationResult;
