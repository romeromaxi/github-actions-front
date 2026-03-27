import React from 'react';
import { Box, Fade, Stack, Typography } from '@mui/material';
import { DefaultStylesButton } from '../../../../components/buttons/Buttons';

interface MarketHomeSlideProps {
  title: React.ReactNode;
  subTitle: React.ReactNode;
  src: string;
  isActive?: boolean;
}

function MarketCategorySlide({
  title,
  subTitle,
  src,
  isActive,
}: MarketHomeSlideProps) {
  return (
    <Box
      sx={{
        height: '400px',
        width: 1,
        backgroundImage: `url(${src})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Stack
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        style={{
          width: '100%',
          height: '100%',
          opacity: 1,
          zIndex: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Fade in={isActive} timeout={{ enter: 1200, exit: 0 }}>
          <div>
            <Stack direction={'column'} alignItems={'center'} gap={1}>
              <Typography
                sx={{
                  fontSize: '2.875rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  color: 'white',
                }}
                variant={'h4'}
              >
                {title}
              </Typography>
              <Typography
                variant={'h6'}
                sx={{
                  fontSize: '1.3125rem',
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                {subTitle}
              </Typography>
              <DefaultStylesButton
                sx={{ width: 1 / 4, backgroundColor: '#004dda' }}
              >
                Ver Más
              </DefaultStylesButton>
            </Stack>
          </div>
        </Fade>
      </Stack>
    </Box>
  );
}

export default MarketCategorySlide;
