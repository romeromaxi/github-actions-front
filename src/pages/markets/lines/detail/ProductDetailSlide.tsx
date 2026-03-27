import React, { useMemo } from 'react';
import { Box, Slide, Stack, Typography } from '@mui/material';

export interface ProductDetailSlideProps {
  imageUrl: string;
  title: string;
  onHoverText: string;
}

function ProductDetailSlide({
  imageUrl,
  title,
  onHoverText,
}: ProductDetailSlideProps) {
  const hasHoverText: boolean =
    !!onHoverText && onHoverText !== '<p></p>' && onHoverText !== '<p></p>\n';
  const fontSize = useMemo(() => {
    if (onHoverText?.length > 200) {
      return '1.125rem';
    } else if (onHoverText?.length > 150) {
      return '1.125rem';
    } else {
      return '1.125rem';
    }
  }, [onHoverText]);

  const containerRef = React.useRef(null);
  const [checked, setChecked] = React.useState(false);

  const handleMouseEnter = () => setChecked(true);
  const handleMouseLeave = () => setChecked(false);

  return (
    <Stack direction={'column'} gap={3}>
      <Box
        sx={{
          height: '286px',
          backgroundImage: `url(${imageUrl})`,
          width: 1,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={containerRef}
      >
        <Slide direction="up" in={checked} container={containerRef.current}>
          <div
            style={{
              position: 'absolute',
              // top: '10%',
              width: '100%',
            }}
          >
            {hasHoverText && (
              <div
                style={{
                  color: 'white',
                  background: 'rgba(21, 101, 192, 0.68)',
                  fontWeight: 600,
                  width: '100%',
                  fontSize: fontSize,
                  padding: '10px',
                  overflowY: 'scroll',
                  height: '286px',
                }}
                dangerouslySetInnerHTML={{ __html: onHoverText }}
              />
            )}
          </div>
        </Slide>
      </Box>
      <div>
        <Typography variant={'h6'} textAlign={'center'}>
          {title}
        </Typography>
      </div>
    </Stack>
  );
}

export default ProductDetailSlide;
