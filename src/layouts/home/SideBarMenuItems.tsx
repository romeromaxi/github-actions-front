import React, { useContext, useState } from 'react';
import { List, ListItem, ListItemButton, Tooltip } from '@mui/material';
import LayoutHomeStyles from './LayoutHome.styles';
import clsx from 'clsx';
import { ItemMenuType, MenuLayoutType } from 'types/menu/menuLink';
import { ListMenuTypeByLayoutType } from './SideBarMenuItemsConfiguration';
import { LayoutHomeContext } from './LayoutHome';
import { useLocation } from 'react-router-dom';
import { SafetyComponent } from 'components/security';
import { SecurityComponents } from 'types/security';
import useSecurityObject from '../../hooks/useSecurityObject';
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";

interface SideBarMenuItemsProps {
  layoutType: MenuLayoutType;
  onClick?: (itemMenu: ItemMenuType) => void;
  urlParam?: string;
  // setOnTabChange?: React.Dispatch<React.SetStateAction<() => void>>
}

function SideBarMenuItems(props: SideBarMenuItemsProps) {
  // const { onTabChange, setOnTabChange } = useContext(SideBarMenuContext)
  const { hasWritePermission } = useSecurityObject();

  const { companyId } = useApplicationCommon();
  const classes = LayoutHomeStyles();
  const location = useLocation();
  const listItemsMenu: ItemMenuType[] | ((urlParam: any) => ItemMenuType[]) =
    ListMenuTypeByLayoutType[props.layoutType];
  //Es medio bestia pero nos fijamos si lo que llega tiene
  // la funcion map, para saber si es una lista o una funcion
  // TODO hacer algo bien aca?
  // @ts-ignore
  const list = listItemsMenu?.map ? listItemsMenu : listItemsMenu(companyId);

  const [menuElement, setMenuElement] = useState<React.ReactElement>();

  const onHandleCloseSideBarMenu = () => setMenuElement(undefined);

  const onHandleClickItem = (
    event: React.MouseEvent<HTMLElement>,
    item: ItemMenuType,
  ) => {
    if (!item.menu) {
      props.onClick && props.onClick(item);
      return;
    }

    if (item.securityObject)
      if (
        !hasWritePermission(
          SecurityComponents.SideBarMenuItems,
          item.securityObject,
        )
      )
        return;

    setMenuElement(
      <item.menu
        anchorEl={event.currentTarget}
        onClose={onHandleCloseSideBarMenu}
      />,
    );
  };

  const isCurrentPath = (path: string | undefined) => {
    if (path) {
      if (location.pathname.includes('market') && path.includes('market'))
        return true; //parece que /home difiere de las demas rutas hijas
      return location.pathname.includes(path);
    }
    return false;
  };

  return (
    <React.Fragment>
      <List component="nav">
        {list.map((item: ItemMenuType, index: number) =>
          item.securityObject ? (
            <SafetyComponent
              componentName={SecurityComponents.SideBarMenuItems}
              objectName={item.securityObject}
              key={`sideBarMenuItemsSafety_${item.code}_${index}`}
            >
              <ListItem sx={{ justifyContent: 'center' }}>
                <Tooltip title={item.label} arrow placement="right">
                  <ListItemButton
                    onClick={(event) => onHandleClickItem(event, item)}
                    className={clsx(classes.listMenuItem, {
                      [classes.listMenuItemActive]: isCurrentPath(item.to),
                      [classes.listMenuItemDisabled]: item.disabled,
                      [classes.listSubmenuItem]: item.children,
                    })}
                    disabled={item.disabled}
                  >
                    {item.icon}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </SafetyComponent>
          ) : (
            <ListItem
              sx={{ justifyContent: 'center' }}
              key={`sideBarMenuItemsList_${item.code}_${index}`}
            >
              <Tooltip title={item.label} arrow placement="right">
                <ListItemButton
                  onClick={(event) => onHandleClickItem(event, item)}
                  className={clsx(classes.listMenuItem, {
                    [classes.listMenuItemActive]: isCurrentPath(item.to),
                    [classes.listMenuItemDisabled]: item.disabled,
                    [classes.listSubmenuItem]: item.children,
                  })}
                  disabled={item.disabled}
                >
                  {item.icon}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ),
        )}
      </List>

      {menuElement && menuElement}
    </React.Fragment>
  );
}

export default SideBarMenuItems;
