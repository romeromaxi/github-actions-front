import React, { useContext } from 'react';

import useScrollTrigger from '@mui/material/useScrollTrigger';
import { AppBar, IconButton, Slide, Stack, Toolbar } from '@mui/material';
import { LayoutHomeContext } from './LayoutHome';
import LayoutHomeStyles from './LayoutHome.styles';
import clsx from 'clsx';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import MenuDrawerResponsive from './components/MenuDrawerResponsive';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { MenuLayoutType } from '../../types/menu/menuLink';
import UserAvatarWithMenu from './components/UserAvatarWithMenu';
import AvatarTitleAppBar from './components/AvatarTitleAppBar';
import { SubTitleAppBar, TitleAppBar } from 'components/text';

interface AppBarScrollProps {
  layoutType: MenuLayoutType;
}

function AppBarScroll({ layoutType }: AppBarScrollProps) {
  const classes = LayoutHomeStyles();
  const { sideBarOpen, mediumWindow, setSideBarOpen } =
    useContext(LayoutHomeContext);
  const { title, actions, subtitle } = useTypedSelector((state) => state.title);

  const trigger = useScrollTrigger({
    target: undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Slide in={trigger} timeout={500}>
      <AppBar
        className={clsx(classes.appBar, {
          [classes.appBarShift]: sideBarOpen,
          [classes.appBarMediumWindow]: mediumWindow,
        })}
      >
        <Toolbar>
          {mediumWindow && (
            <>
              <IconButton onClick={() => setSideBarOpen(true)}>
                <MenuTwoToneIcon className={classes.iconMenu} />
              </IconButton>

              <MenuDrawerResponsive layoutType={layoutType} />
            </>
          )}

          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
            width={'100%'}
            pl={'1.1rem'}
            justifyContent="space-between"
          >
            {/*icon && icon
                        <Box sx={{
                            objectFit: 'contain',
                            width: 80,
                            height: 40
                        }}
                             component="img"
                             alt="Logo Banco"
                             src={bankLogo}/>
                        */}
            <Stack direction={'row'} spacing={1.2}>
              <AvatarTitleAppBar />
              <Stack>
                <TitleAppBar>{title}</TitleAppBar>

                <SubTitleAppBar textDisabled>{subtitle}</SubTitleAppBar>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              {actions && actions}

              <UserAvatarWithMenu />
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}

export default AppBarScroll;
