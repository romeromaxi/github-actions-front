import {
  ItemMenuType,
  MenuCode,
  MenuLayoutType,
} from '../../types/menu/menuLink';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import ContactSupportTwoToneIcon from '@mui/icons-material/ContactSupportTwoTone';
import React from 'react';
import { NotificationUserIcon } from './components/ItemsMenuSpecialIcon';
import StoreIcon from '@mui/icons-material/Store';

const itemsHomePyme: ItemMenuType[] = [
  {
    code: MenuCode.Market,
    label: 'Market',
    icon: <StoreIcon />,
    to: '/market/landing',
  },
  {
    code: MenuCode.Messages,
    label: 'Notificaciones',
    icon: <NotificationUserIcon />,
    to: `/notificaciones`,
  },
  {
    code: MenuCode.FAQ,
    label: 'FAQ',
    icon: <ContactSupportTwoToneIcon />,
    to: window.URL_FAQ_LUC,
  },
];

const itemsOfferer: ItemMenuType[] = [
  {
    code: MenuCode.Market,
    label: 'Market',
    icon: <StoreIcon />,
    to: '/market/landing',
  },
  {
    code: MenuCode.Messages,
    label: 'Notificaciones',
    icon: <NotificationUserIcon />,
    to: `/offerer/notificaciones`,
  },
];

const itemsQua: ItemMenuType[] = [
  {
    code: MenuCode.Messages,
    label: 'Notificaciones',
    icon: <NotificationUserIcon />,
    to: '/internal/notificaciones',
  },
];

export const ListMenuBottomTypeByLayoutType: Record<
  MenuLayoutType,
  ItemMenuType[] | (() => ItemMenuType[])
> = {
  [MenuLayoutType.Home]: itemsHomePyme,
  [MenuLayoutType.OffererHome]: itemsOfferer,
  [MenuLayoutType.InternalHome]: itemsQua,
};
