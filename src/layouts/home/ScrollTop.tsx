import React from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Box, Fab, Fade, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ScrollTop() {
  const theme = useTheme();  
    
  const trigger = useScrollTrigger({
    target: undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  
  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1 }}
      >
        <Fab
          size="small"
          color="primary"
          aria-label="scroll back to top"
          sx={{
            opacity: 0.3,
            '&:hover': { opacity: 1, backgroundColor: theme.palette.primary.dark },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Fade>
  );
}

export default ScrollTop;
