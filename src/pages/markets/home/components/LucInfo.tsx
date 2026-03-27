import React from 'react';
import LucInfoCard, { LucInfoCardProps } from './LucInfoCard';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { Grid } from '@mui/material';
import { getBaseColor } from '../../../../util/typification/generalColors';
import { EnumColors } from '../../../../types/general/generalEnums';

const infoCardProps: LucInfoCardProps[] = [
  {
    primaryText: 'Crea tu usuario LUC',
    secondaryText: 'PASO 1',
    icon: (
      <BadgeOutlinedIcon
        sx={{ color: getBaseColor(EnumColors.MARKET_BLUE) }}
        fontSize={'large'}
      />
    ),
  },
  {
    primaryText: 'Agrega tu empresa',
    secondaryText: 'PASO 2',
    icon: (
      <OpenInNewOutlinedIcon
        sx={{ color: getBaseColor(EnumColors.MARKET_BLUE) }}
        fontSize={'large'}
      />
    ),
  },
  {
    primaryText: 'Completa tu legajo',
    secondaryText: 'PASO 3',
    icon: (
      <BusinessCenterOutlinedIcon
        sx={{ color: getBaseColor(EnumColors.MARKET_BLUE) }}
        fontSize={'large'}
      />
    ),
  },
  {
    primaryText: 'Envía tu información',
    secondaryText: 'PASO 4',
    icon: (
      <CreateOutlinedIcon
        sx={{ color: getBaseColor(EnumColors.MARKET_BLUE) }}
        fontSize={'large'}
      />
    ),
  },
];

function LucInfo() {
  return (
    <Grid container spacing={3}>
      {infoCardProps.map((props) => (
        <Grid item md={3} sm={6} xs={12}>
          <LucInfoCard {...props} />
        </Grid>
      ))}
    </Grid>
  );
}

export default LucInfo;
