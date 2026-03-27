import React from 'react';

import { Box, CircularProgress, SxProps } from '@mui/material';
import CompanyLogoStyles from './CompanyLogo.styles';
import { Theme } from '@mui/material/styles';
import { ButtonIconFile } from '../../../components/buttons/ButtonIconFile';

interface CompanyIconProps {
  companyIcon?: any;
  loading: boolean;
}

function CompanyIcon({ companyIcon, loading }: CompanyIconProps) {
  const classes = CompanyLogoStyles();

  const sxBox = {
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `url(${companyIcon})`,
    zIndex: 2,
    height: '35px !important',
    width: '40px !important',
    mt: 2,
    ml: 2,
  };

  return !loading ? (
    <>
      <Box component="div" sx={sxBox} className={classes.contentLogo} />
    </>
  ) : (
    <Box component="div" sx={sxBox} className={classes.contentCircularProgress}>
      <CircularProgress className={classes.circularProgress} />
    </Box>
  );
}

export default CompanyIcon;
