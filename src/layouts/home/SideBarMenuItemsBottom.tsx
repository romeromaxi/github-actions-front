import React, { useContext, useState } from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
} from '@mui/material';
import clsx from 'clsx';
import { ItemMenuType, MenuLayoutType } from '../../types/menu/menuLink';
import LayoutHomeStyles from './LayoutHome.styles';
import { ListMenuBottomTypeByLayoutType } from './SideBarMenuItemsBottomConfiguration';
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";
import { matchPath, useLocation } from 'react-router-dom';
interface SideBarMenuItemsBottomProps {
  onClick?: (itemMenu: ItemMenuType) => void;
  layoutType: MenuLayoutType;
}

function SideBarMenuItemsBottom(props: SideBarMenuItemsBottomProps) {
  const [menuElement, setMenuElement] = useState<React.ReactElement>();
  const { companyId } = useApplicationCommon();
  const classes = LayoutHomeStyles();
  const location = useLocation();
  const listItemsMenu: ItemMenuType[] | ((urlParam: any) => ItemMenuType[]) =
    ListMenuBottomTypeByLayoutType[props.layoutType];
  //Es medio bestia pero nos fijamos si lo que llega tiene
  // la funcion map, para saber si es una lista o una funcion
  // TODO hacer algo bien aca?
  // @ts-ignore
  const items = listItemsMenu?.map ? listItemsMenu : listItemsMenu(companyId);
  const onHandleClickItem = (
    event: React.MouseEvent<HTMLElement>,
    item: ItemMenuType,
  ) => {
    if (!item.menu) {
      if (item.to?.includes('http')) window.open(item.to);
      else props.onClick && props.onClick(item);
      return;
    }

    const onHandleCloseSideBarMenu = () => setMenuElement(undefined);

    setMenuElement(
      <item.menu
        anchorEl={event.currentTarget}
        onClose={onHandleCloseSideBarMenu}
      />,
    );
  };

  const isCurrentPath = (path: string | undefined) => {
    if (path) {
      return !!matchPath(location.pathname, path);
    }
    return false;
  };

  return (
    <>
      <List component="nav">
        <Divider />

        {items.map((item: ItemMenuType) => (
          <ListItem sx={{ justifyContent: 'center' }}>
            <Tooltip title={item.label} arrow placement="right">
              <ListItemButton
                onClick={(event) => onHandleClickItem(event, item)}
                className={clsx(classes.listMenuItem, {
                  [classes.listMenuItemActive]: isCurrentPath(item.to),
                  [classes.listMenuItemDisabled]: item.disabled,
                })}
                disabled={item.disabled}
              >
                {item.icon}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}

        {/*<ListItem sx={{ justifyContent: 'center' }}>
                    <UserAvatarWithMenu />
                </ListItem>*/}
      </List>

      {menuElement && menuElement}
    </>
  );
}

export default SideBarMenuItemsBottom;
