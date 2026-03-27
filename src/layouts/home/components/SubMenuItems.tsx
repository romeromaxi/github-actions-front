import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Collapse,
  Icon,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material/';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IItemMenu, MenuType } from 'types/menu/menuLink';

interface SideBarMenuItemProps {
  item: IItemMenu;
  onClick?: () => void;
  collapsed?: boolean;
  nested?: boolean;
  selected?: boolean;
  pathname?: string;
}

const ShallowItem = (props: SideBarMenuItemProps) => {
  const { item, onClick, collapsed, nested } = props;

  return Boolean(item.nestedType === MenuType.Nested) ? (
    <MenuItem selected={props.selected} onClick={onClick ? onClick : () => {}}>
      <ListItemIcon> {item.icon} </ListItemIcon>
      <ListItemText primary={item.label} />
      <Icon
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {collapsed ? <ExpandLess /> : <ExpandMore />}
      </Icon>
    </MenuItem>
  ) : (
    <MenuItem
      selected={props.selected}
      component={Link}
      to={item.link || '#'}
      onClick={onClick ? onClick : () => {}}
    >
      <ListItemIcon
        sx={
          nested
            ? { marginLeft: 2, marginRight: '-4px', placeItems: 'center' }
            : {}
        }
      >
        {' '}
        {item.icon}{' '}
      </ListItemIcon>
      <ListItemText primary={item.label} />
    </MenuItem>
  );
};

const NestedItem = (props: SideBarMenuItemProps) => {
  const { item } = props;
  const [collapsed, toggler] = React.useState(false);
  const subLinks = item.subMenu?.map((item) => item.link);

  const toggleCollapse = () => {
    toggler(!collapsed);
  };

  return (
    <div>
      <ShallowItem
        item={item}
        collapsed={collapsed}
        selected={collapsed && subLinks?.includes(props.pathname)}
        onClick={toggleCollapse}
      />
      <Collapse
        in={collapsed || (collapsed && subLinks?.includes(props.pathname))}
        unmountOnExit
      >
        <List component="div">
          {item.subMenu?.map((item) => (
            <ShallowItem
              key={item.label}
              nested
              selected={item.link === props.pathname}
              item={{
                ...item,
                icon: <FiberManualRecordIcon sx={{ fontSize: '4px' }} />,
              }}
              onClick={props.onClick}
            />
          ))}
        </List>
      </Collapse>
    </div>
  );
};

const ShallowLinkItem = (props: SideBarMenuItemProps) => {
  const { item, onClick } = props;

  return (
    <MenuItem
      onClick={onClick ? onClick : item.linkTo ? item.linkTo : () => {}}
    >
      <ListItemIcon> {item.icon} </ListItemIcon>
      <ListItemText primary={item.label} />
    </MenuItem>
  );
};

interface SubMenuItemsProps {
  items: IItemMenu[];
  onClickItem?: () => void;
}

const SubMenuItems: React.FC<SubMenuItemsProps> = (
  props: SubMenuItemsProps,
) => {
  const { pathname } = useLocation();

  return (
    <List component="nav">
      {props.items.map((item) => {
        switch (item.nestedType) {
          case MenuType.Nested:
            return (
              <NestedItem
                item={item}
                key={`${item.label}-menuItem`}
                pathname={pathname}
                onClick={props.onClickItem}
              />
            );

          case MenuType.Shallow:
            return (
              <ShallowItem
                item={item}
                key={`${item.label}-menuItem`}
                selected={item.link === pathname}
                onClick={props.onClickItem}
              />
            );

          case MenuType.ShallowLink:
            return (
              <ShallowLinkItem
                item={item}
                key={`${item.label}-menuItem`}
                onClick={props.onClickItem}
              />
            );

          default:
            return <></>;
        }
      })}
    </List>
  );
};

export default SubMenuItems;
