import React, { useRef, useState } from 'react';
// @ts-ignore
import { Box, Fade, Slide, Stack, SxProps, Typography } from '@mui/material';
import { DefaultStylesButton } from '../../../../components/buttons/Buttons';
import { Link } from 'react-router-dom';

export interface DestinyBannerProps {
  src: string;
  title: string;
  to: string;
  sx?: SxProps;
}

function DestinyBanner({ src, title, to, sx }: DestinyBannerProps) {
  const [showButton, setShowButton] = useState<boolean>(false);
  const containerRef = useRef(null);

  return (
    <div style={{ overflow: 'hidden' }}>
      <Box
        sx={{
          height: '286px',
          backgroundImage: `url(${src})`,
          width: 1,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          ':--moz-transition': 'all 0.3s ease-in-out',
          ':--o-transition': 'all 0.3s ease-in-out',
          ':--webkit-transition': 'all 0.3s ease-in-out',
          ':--ms-transition': 'all 0.3s ease-in-out',
          transition: 'all 0.3s ease-in-out',
          ':--moz-transform': 'scale(1.1)',
          ':--o-transform': 'scale(1.1)',
          ':--webkit-transform': 'scale(1.1)',
          ':--ms-transform': 'scale(1.1)',
          transform: 'scale(1.1)',
          '&:hover': {
            color: '#fff',
            ':--moz-transform': 'scale(1.0)',
            ':--o-transform': 'scale(1.0)',
            ':--webkit-transform': 'scale(1.0)',
            ':--ms-transform': 'scale(1.0)',
            transform: 'scale(1.0)',
          },
          ...sx,
        }}
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => setShowButton(false)}
      >
        <Stack
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={3}
          style={{
            width: '100%',
            height: '100%',
            opacity: 1,
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 900,
              textAlign: 'center',
              textTransform: 'uppercase',
              color: 'white',
            }}
            variant={'h4'}
          >
            {title}
          </Typography>
          <div ref={containerRef}>
            <Slide
              direction={'up'}
              in={showButton}
              timeout={{ enter: 400, exit: 400 }}
              container={containerRef.current}
            >
              <div>
                <Link to={to}>
                  <DefaultStylesButton
                    sx={{ width: 1, backgroundColor: '#004dda' }}
                  >
                    Ver líneas
                  </DefaultStylesButton>
                </Link>
              </div>
            </Slide>
          </div>
        </Stack>
      </Box>
    </div>
  );
}

export default DestinyBanner;
