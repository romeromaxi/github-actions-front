import React from 'react';
import { Button, Paper, Popover, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FilterProductServicePopoverProps {
  title: string;
  children: React.ReactNode;
}

function FilterProductServicePopover({
  title,
  children,
}: FilterProductServicePopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button sx={{ p: 0 }} fullWidth disableRipple onClick={handleClick}>
        <Paper sx={{ width: 1, p: 1 }}>
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Typography>{title}</Typography>

            <ExpandMoreIcon />
          </Stack>
        </Paper>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
      >
        {children}
      </Popover>
    </div>
  );
}

export default FilterProductServicePopover;
