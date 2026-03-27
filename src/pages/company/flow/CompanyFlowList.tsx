import React from 'react';
import {
  CompanyFlowFields,
  CompanyFlowView,
} from '../../../types/company/companyFlowData';
import { Box, Grid, SxProps, Typography } from '@mui/material';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import { numberFormatter } from '../../../util/formatters/numberFormatter';
import { grey } from '@mui/material/colors';
import { Theme } from '@mui/material/styles';
import { DataWithLabel } from '../../../components/misc/DataWithLabel';

interface CompanyFlowListProps {
  flowList: CompanyFlowView[];
  hideTitles?: boolean;
  sx?: SxProps<Theme>;
}

function CompanyFlowList({ flowList, hideTitles, sx }: CompanyFlowListProps) {
  return (
    <Grid item container spacing={3} sx={{ ...sx }}>
      {!hideTitles && (
        <Grid item container xs={12}>
          <Grid item xs={4}>
            <Box width={'100%'} />
            <Typography color={grey[600]} variant={'h6'}>
              Fecha
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              style={{ textAlign: 'center', marginRight: 60 }}
              color={grey[600]}
              variant={'h6'}
            >
              Ingreso
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              style={{ textAlign: 'center' }}
              color={grey[600]}
              variant={'h6'}
            >
              Egreso
            </Typography>
          </Grid>
        </Grid>
      )}

      {flowList.map((flow) => (
        <Grid
          item
          container
          xs={12}
          spacing={13}
          alignItems={'center'}
          sx={{ mb: -1 }}
        >
          <Grid item xs={5}>
            {`${dateFormatter.toMonthNameWithYear(flow[CompanyFlowFields.Date], true)}:`}
          </Grid>
          <Grid item xs={4}>
            <DataWithLabel
              rowDirection
              label={'Compra'}
              data={numberFormatter.toStringWithAmount(
                flow[CompanyFlowFields.Income],
                '$',
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <DataWithLabel
              rowDirection
              label={'Venta'}
              data={numberFormatter.toStringWithAmount(
                flow[CompanyFlowFields.Sale],
                '$',
              )}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default CompanyFlowList;
