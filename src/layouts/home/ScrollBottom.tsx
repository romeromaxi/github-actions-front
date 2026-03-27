import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Box, Fab, Fade } from '@mui/material';
import { greenColorBase } from '../../util/themes/ThemeItapTec';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React from 'react';

function ScrollBottom() {
  const trigger = useScrollTrigger({
    target: undefined,
    disableHysteresis: true,
    threshold: 0,
  });

  const handleClick = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', zIndex: 5, bottom: 16, right: 16 }}
      >
        <Fab
          size="small"
          color="success"
          aria-label="scroll to bottom"
          sx={{
            opacity: 0.3,
            '&:hover': { opacity: 1, backgroundColor: greenColorBase },
          }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      </Box>
    </Fade>
  );
}

export default ScrollBottom;
