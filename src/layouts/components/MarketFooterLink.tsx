import React, { useState } from 'react';
import {Box, Fade, Link as MuiLink, Stack, Typography} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {themeTypographyDefinition} from "util/themes/definitions";

interface MarketFooterLinkProps {
  label: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

function MarketFooterLink({ label, onClick, disabled }: MarketFooterLinkProps) {
  const [showArrow, setShowArrow] = useState<boolean>(false);

  return (
    <Box onClick={disabled ? undefined : onClick} id={`footer-${label}-link-market`}>
      <MuiLink
        onMouseOver={() => setShowArrow(true)}
        onMouseLeave={() => setShowArrow(false)}
        sx={{
          display: 'inline-block',
          textDecoration: 'none',
          fontSize: '16px !important',
          color: disabled ? '#d2d2d2' : '#fff',
          ':--moz-transition': 'all 0.3s ease-in-out',
          ':--o-transition': 'all 0.3s ease-in-out',
          ':--webkit-transition': 'all 0.3s ease-in-out',
          ':--ms-transition': 'all 0.3s ease-in-out',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            color: disabled ? '#d2d2d2' : '#fff',
            ':--moz-transform': 'translate(5px, 0)',
            ':--o-transform': 'translate(5px, 0)',
            ':--webkit-transform': 'translate(5px, 0)',
            ':--ms-transform': 'translate(5px, 0)',
            transform: 'translate(5px,0)',
            opacity: 1,
          },
        }}
      >
        <Stack direction={'row'} alignItems={'center'}>
          <Typography sx={{ ...themeTypographyDefinition.label }}>{label}</Typography>
            {
                !disabled &&
              <Fade in={showArrow}>
                <ArrowForwardIcon sx={{ ml: '5px' }} />
              </Fade>
            }
        </Stack>
      </MuiLink>
    </Box>
  );
}

export default MarketFooterLink;
