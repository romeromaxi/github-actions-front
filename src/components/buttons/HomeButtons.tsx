import React, {useMemo, useRef, useState} from 'react';
import {
    ClickAwayListener,
    Collapse,
    Grow,
    IconButton, ListItemIcon, Menu,
    MenuItem,
    MenuItemProps,
    MenuList,
    Paper,
    Popper, Stack, useMediaQuery,
} from '@mui/material';
import ButtonsStyles from './Buttons.styles';
import { AccountCircleOutlined } from '@mui/icons-material';
import {themeTypographyDefinition} from "../../util/themes/definitions";
import {useTheme} from "@mui/material/styles";
import {WrapperIcons} from "../icons/Icons";
import HomeButtonsStyles from "./HomeButtons.styles";
import clsx from "clsx";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";


export interface OptionDropwond {
  label: string;
  onClick: () => void;
}

interface HomeButtonDropdownProps {
  label: string;
  icon?: React.ReactElement;
  options: OptionDropwond[];
  active?: boolean;
  rightBorder?: boolean;
}

export function HomeButtonDropdown(props: HomeButtonDropdownProps) {
  const classes = ButtonsStyles();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const onHandleClick = () => setOpen(!open);

  const onHandleMenuItemClick = (onClickMenu: () => void) => {
    onClickMenu();
    setOpen(false);
  };

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
    <>
      <div
        ref={anchorRef}
        className={`${props.rightBorder && classes.homeButtonBorder}`}
      >
        <IconButton onClick={onHandleClick} sx={{ mt: 0.5 }}>
          {props?.icon || (
            <AccountCircleOutlined
              fontSize={'large'}
              sx={{ stroke: 'white', strokeWidth: 1 }}
            />
          )}
        </IconButton>
        {/*<Button className={`${classes.homeButton}`}*/}
        {/*        onClick={onHandleClick}*/}
        {/*>*/}
        {/*    <Stack direction="column"*/}
        {/*           alignItems="center"*/}
        {/*           justifyContent="center"*/}
        {/*    >*/}
        {/*        /!*{React.cloneElement(props.icon, { className: classes.homeButtonIcon })}*!/*/}
        {/*        {props.icon}*/}
        {/*        <Typography className={`${classes.homeButtonLabel} ${props.active && classes.homeButtonLabelActive}`}>{props.label}</Typography>*/}
        {/*    </Stack>*/}
        {/*</Button>*/}
      </div>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        className={classes.homeButtonPopper}
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
                <MenuList id="home-button-menu" autoFocusItem>
                  {props.options.map((option, index) => (
                    <MenuItem
                      key={`homeButtonDropdown_${option.label.trim()}_${index}`}
                      onClick={() => onHandleMenuItemClick(option.onClick)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export interface AppBarButtonOptions {
    label: string,
    onClick: () => void,
    Icon?: React.ElementType,
    isActive?: boolean,
}

interface AppBarButtonProps extends MenuItemProps {
    icon?: React.ElementType,
    isActive?: boolean,
    options?: AppBarButtonOptions[]
}

export function AppBarButton({ icon, isActive, onClick, ...props}: AppBarButtonProps) {
    const classes = HomeButtonsStyles();
    
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const resolutionBelow1320 = useMediaQuery(theme.breakpoints.down(1320));
    const resolutionBelow1100 = useMediaQuery(theme.breakpoints.down(1100));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const IconMenu = useMemo(() => (openMenu ? ChevronUpIcon : ChevronDownIcon), [openMenu])

    const handleOpenToggleMenu = (event: React.MouseEvent<HTMLElement>) => {
        if (!isMediumScreen) setAnchorEl(event.currentTarget);
        
        setOpenMenu(true)
    }

    const handleCloseToggle = () => {
        setAnchorEl(null);
        setOpenMenu(false)
    }
    
    const handleClickMenu = (event: React.MouseEvent<any>) => {
        const clickedInsideOptionsMenu = (event.target as HTMLElement).closest("[data-appbar-menu]");

        if (clickedInsideOptionsMenu) {
            handleCloseToggle();
            return;
        }
        
        if (props.options) {
            if (!openMenu)
                handleOpenToggleMenu(event);
            else 
                handleCloseToggle();
            
            event.stopPropagation();
        } else {
            onClick && onClick(event);
        }
    }
    
    return (
        isMediumScreen ?
            <MenuItem {...props}
                      onClick={handleClickMenu}
                      sx={{padding: 0}}
                      className={clsx(classes.appBarButtonMobileRoot, {
                          [classes.appBarMenuRootActive]: isActive
                      })}
                      variant={'appbar'}
                      disableRipple
            >
                <Stack direction={'column'} width={1}>
                    <Stack direction='row' alignItems='center' justifyContent={'space-between'}>
                        <Stack direction='row' alignItems='center'>
                            {icon && <WrapperIcons Icon={icon} />}
                            <div>
                                {props.children}
                            </div>
                        </Stack>
                        
                        {
                            (props.options) &&
                                <WrapperIcons Icon={IconMenu} />
                        }
                    </Stack>
    
                    {
                        (props.options) &&
                        <Collapse in={openMenu} 
                                  sx={{ marginTop: openMenu ? 1.5 : 0 }}
                                  data-appbar-menu>
                            <Stack spacing={1.5}>
                                {
                                    props.options.map((oneOption, index) => (
                                        <MenuItem key={`menuItemAppBarButtonMobile_${oneOption.label}_${index}`}
                                                  onClick={oneOption.onClick}
                                                  className={clsx('', {
                                                      [classes.appBarMenuOptionActive]: oneOption.isActive
                                                  })}
                                        >
                                            {
                                                oneOption.Icon &&
                                                <ListItemIcon>
                                                    <WrapperIcons Icon={oneOption.Icon} />
                                                </ListItemIcon>
                                            }

                                            {oneOption.label}
                                        </MenuItem>
                                    ))
                                }
                            </Stack>
                        </Collapse>
                    }
                </Stack>
            </MenuItem>
            :
            <MenuItem className={clsx(classes.appBarButtonRoot, {
                                    [classes.appBarButtonRootActive]: isActive
                                })}
                      onClick={handleClickMenu}
                      variant={'appbar'}
                      {...props}
                        sx={{
                            fontSize: resolutionBelow1100 
                                ? themeTypographyDefinition.caption 
                                : resolutionBelow1320 
                                    ? '0.825rem' 
                                    : themeTypographyDefinition.subtitle1,
                            '&:hover': {
                                backgroundColor: 'transparent !important',
                                color: `${theme.palette.primary.main} !important`
                            },
                            ...props.sx,
                        }}
            >
                {
                    (props.options && props.options.length) ?
                        <Stack direction={'row'} alignItems={'center'}>
                            {props.children}
                            <WrapperIcons Icon={IconMenu} sx={{ marginLeft: '4px' }} />
                        </Stack>
                        :
                        props.children
                }

                <Menu open={openMenu}
                      anchorEl={anchorEl}
                      onClose={handleCloseToggle}
                      transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                      sx={{
                          marginTop: 8
                      }}
                >
                    {
                        props.options?.map((oneOption, index) => (
                            <MenuItem key={`menuItemAppBarButton_${oneOption.label}_${index}`}
                                      onClick={oneOption.onClick}
                                      className={clsx('', {
                                          [classes.appBarMenuOptionActive]: oneOption.isActive
                                      })}
                            >   
                                {
                                    oneOption.Icon &&
                                        <ListItemIcon>
                                            <WrapperIcons Icon={oneOption.Icon} />
                                        </ListItemIcon>
                                }
                                
                                {oneOption.label}
                            </MenuItem>
                        ))
                    }
                </Menu>
            </MenuItem>
    );
}

