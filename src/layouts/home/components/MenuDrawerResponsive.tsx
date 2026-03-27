import { Box, Drawer, Stack } from '@mui/material';
import React, { useContext } from 'react';
import { LayoutHomeContext } from '../LayoutHome';
import { ListMenuItemByMenuCode } from './SubMenuItemsConfiguration';
import SubMenuItems from './SubMenuItems';
import SideBarMenuItemsBottom from '../SideBarMenuItemsBottom';
import SideBarMenuItems from '../SideBarMenuItems';
import LayoutHomeStyles from '../LayoutHome.styles';
import { ItemMenuType, MenuLayoutType } from '../../../types/menu/menuLink';
import { useNavigate } from 'react-router-dom';

interface MenuDrawerResponsiveProps {
  layoutType: MenuLayoutType;
  basePath?: string;
}

function MenuDrawerResponsive({
  layoutType,
  basePath,
}: MenuDrawerResponsiveProps) {
  const classes = LayoutHomeStyles();

  const { sideBarOpen, setSideBarOpen, menuActive } =
    useContext(LayoutHomeContext);
  const navigate = useNavigate();

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
  const onCloseDrawer = () => setSideBarOpen(false);

  return (
    <Drawer open={sideBarOpen} anchor="left" onClose={onCloseDrawer}>
      <Stack direction="row" sx={{ height: '100vh' }}>
        <Stack className={classes.boxSideBarResponsive}>
          <Stack alignItems="center" mt={4} spacing={3}>
            <SideBarMenuItems
              layoutType={layoutType}
              onClick={onClickMenuItem}
            />
          </Stack>

          <Stack
            alignItems="center"
            justifyContent="end"
            sx={{ height: '100%' }}
            mb={2}
          >
            <SideBarMenuItemsBottom
              layoutType={layoutType}
              onClick={onClickMenuItem}
            />
          </Stack>
        </Stack>

        <Box>
          <Stack mt={4}>
            <SubMenuItems
              items={ListMenuItemByMenuCode[menuActive]}
              onClickItem={onCloseDrawer}
            />
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
}

export default MenuDrawerResponsive;
