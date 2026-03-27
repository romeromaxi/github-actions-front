import React, { useRef, useState } from 'react';

import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { SolicitationGroupBy } from 'types/solicitations/solicitationEnums';

const options = {
  [SolicitationGroupBy.Line]: 'Agrupar por Línea',
  [SolicitationGroupBy.Pyme]: 'Agrupar por Pyme',
  [SolicitationGroupBy.State]: 'Agrupar por Estado',
};

interface SolicitationButtonGroupByProps {
  actual: SolicitationGroupBy;
  onClick: (groupBy: SolicitationGroupBy) => void;
}

function SolicitationButtonGroupBy(props: SolicitationButtonGroupByProps) {
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleClick = () => props.onClick(props.actual);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    props.onClick(index);
    setOpen(false);
  };

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        sx={{ boxShadow: 'none' }}
      >
        <Button onClick={handleClick} sx={{ padding: '0px 20px' }}>
          {options[props.actual]}
        </Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {Object.entries(options).map((option, index) => (
                    <MenuItem
                      key={`prueba_${index}`}
                      selected={index === props.actual}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option[1]}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}

export default SolicitationButtonGroupBy;
