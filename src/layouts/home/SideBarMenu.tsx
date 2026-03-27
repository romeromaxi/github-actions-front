import LayoutHomeStyles from './LayoutHome.styles';
import clsx from 'clsx';
import { Box, Drawer, Stack } from '@mui/material';
import React, { useContext, useState } from 'react';
import { LayoutHomeContext } from './LayoutHome';
import SideBarMenuItems from './SideBarMenuItems';
import SubMenuItems from './components/SubMenuItems';
import { ListMenuItemByMenuCode } from './components/SubMenuItemsConfiguration';
import SideBarMenuItemsBottom from './SideBarMenuItemsBottom';
import { useNavigate } from 'react-router-dom';
import { ItemMenuType, MenuLayoutType } from 'types/menu/menuLink';
import { DialogAlert } from '../../components/dialog';
import {AppConfigFields, AppConfigLogosFields} from "types/appConfigEntities";

interface SideBarMenuProps {
  layoutType: MenuLayoutType;
  basePath?: string;
}

function SideBarMenu({ layoutType, basePath }: SideBarMenuProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [selectedItemMenu, setSelectedItemMenu] = useState<ItemMenuType>();
  const classes = LayoutHomeStyles();
  const navigate = useNavigate();

  const {
    sideBarOpen,
    setSideBarOpen,
    menuActive,
    shouldWarnBeforeSwitch,
    setShouldWarnBeforeSwitch,
  } = useContext(LayoutHomeContext);

  const onClickMenuItem = (itemMenu: ItemMenuType) => {
    if (!!itemMenu.to) {
      let navigateTo: string = !basePath
        ? itemMenu.to
        : `${basePath}/${itemMenu.to}`;
      setSideBarOpen(false);
      navigate(navigateTo);
    }

    if (
      !sideBarOpen &&
      !itemMenu.to &&
      ListMenuItemByMenuCode[itemMenu.code].length
    )
      setSideBarOpen(true);
  };

  const onClickHandler = (itemMenu: ItemMenuType) => {
    if (shouldWarnBeforeSwitch) {
      setSelectedItemMenu(itemMenu);
      setShowConfirmDialog(true);
    } else {
      onClickMenuItem(itemMenu);
    }
  };

  const onConfirmTabSwitch = () => {
    setShowConfirmDialog(false);
    onClickMenuItem(selectedItemMenu!);
    setShouldWarnBeforeSwitch(false);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        className={classes.sideBarBase}
        classes={{
          paper: classes.sideBarBase,
        }}
      >
        <Stack alignItems="center" mt={4} spacing={3}>
          <Box
            component="img"
            sx={{
              height: 30,
              width: 60,
            }}
            alt={'LOGO'}
            src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
          />

          <SideBarMenuItems onClick={onClickHandler} layoutType={layoutType} />
        </Stack>

        <Stack
          alignItems="center"
          justifyContent="end"
          sx={{ height: '100%' }}
          mb={2}
        >
          <SideBarMenuItemsBottom
            onClick={onClickMenuItem}
            layoutType={layoutType}
          />
        </Stack>
      </Drawer>

      <Drawer
        open={sideBarOpen}
        variant="persistent"
        anchor="left"
        className={clsx('', {
          [classes.menuOpen]: sideBarOpen,
        })}
        classes={{
          paper: classes.menuOpen,
        }}
      >
        <Stack className={classes.menuContainer} mt={4}>
          <SubMenuItems items={ListMenuItemByMenuCode[menuActive]} />
        </Stack>
      </Drawer>
      <DialogAlert
        open={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
        }}
        onConfirm={onConfirmTabSwitch}
        textContent={`¿Estás seguro que deseás cambiar de pestaña? Los cambios no guardados se perderán.`}
      />
    </>
  );
}

export default SideBarMenu;
