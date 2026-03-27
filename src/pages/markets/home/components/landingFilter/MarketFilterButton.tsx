import React, { useRef, useState } from 'react';
import { Box, Slide, Stack, Typography } from '@mui/material';
import { DefaultButtonBanner } from 'components/buttons/Buttons';
import MarketFilterButtonStyles from './MarketFilterButton.styles';
import clsx from 'clsx';

interface MarketFilterButtonProps {
  src: string;
  title: string;
  onClickSelect: () => void;
  onClickUnselect: () => void;
  selected?: boolean;
  disabled?: boolean;
}

function MarketFilterButton({
  src,
  title,
  onClickSelect,
  onClickUnselect,
  selected,
  disabled,
}: MarketFilterButtonProps) {
  const classes = MarketFilterButtonStyles();

  const [showButton, setShowButton] = useState<boolean>(false);
  const containerRef = useRef(null);

  return (
    <div
      className={clsx(classes.root, {
        [classes.rootDisabled]: disabled && !selected,
      })}
    >
      <Box
        className={clsx(classes.boxHover, {
          [classes.boxNotAllowed]: disabled && !selected,
        })}
        sx={{
          height: '105px',
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
            cursor: 'grab',
          },
        }}
        onMouseEnter={() => (selected || disabled ? null : setShowButton(true))}
        onMouseLeave={() => setShowButton(false)}
      >
        <Stack
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={1}
          sx={{ mt: -1 }}
          style={{
            width: '100%',
            height: '100%',
            opacity: 1,
            zIndex: 2,
            backgroundColor: selected
              ? 'rgba(21, 101, 192, 0.68)'
              : 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Typography
            // position={'absolute'}
            sx={{
              fontSize: '1.125rem',
              fontWeight: 900,
              textAlign: 'center',
              textTransform: 'uppercase',
              color: 'white',
              padding: '0 5px',
            }}
            variant={'h4'}
          >
            {title}
          </Typography>

          <div
            ref={containerRef}
            // style={{ marginTop: '25px' }}
          >
            {selected && !disabled && (
              <DefaultButtonBanner
                onClick={onClickUnselect}
                color={'secondary'}
                sx={{ width: 1 }}
              >
                Quitar selección
              </DefaultButtonBanner>
            )}

            <Slide
              direction={'up'}
              in={showButton || selected}
              timeout={{ enter: 400, exit: 400 }}
              container={containerRef.current}
            >
              <div>
                {!selected && (
                  <DefaultButtonBanner
                    onClick={onClickSelect}
                    sx={{ width: 1 }}
                  >
                    Seleccionar
                  </DefaultButtonBanner>
                )}
              </div>
            </Slide>
          </div>
        </Stack>
      </Box>
    </div>
  );
}

export default MarketFilterButton;
