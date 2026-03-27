import React from 'react';
import { SideBarMenuPopUpProps } from '../../layouts/home/components/SideBarMenuPopUp';
import { SideBarMenuItemsSecObjects } from '../security';

export interface MenuLink {
  text: string;
  onClick: () => void;
}

export enum MenuType {
  Nested,
  Shallow,
  ShallowLink,
}

export interface IItemMenu {
  nestedType: MenuType;
  label: string;
  link?: string;
  icon?: React.ReactNode;
  subMenu?: IItemMenu[];
  linkTo?: () => void;
}

export enum MenuLayoutType {
  Home = 0,
  OffererHome = 1,
  InternalHome = 2,
}

export interface ItemMenuType {
  code: MenuCode;
  label: string;
  icon: React.ReactNode;
  to?: string;
  disabled?: boolean;
  children?: boolean;
  menu?: React.ComponentType<SideBarMenuPopUpProps>;
  securityObject?: SideBarMenuItemsSecObjects;
}

export enum MenuCode {
  Home = 1,
  OffererHome = 1,
  OffererLines = 2,
  OffererRoles = 3,
  OffererSolicitations = 5,
  OffererLibrary = 6,
  InternalHome = 7,
  InternalLines = 8,
  InternalProducts = 9,
  InternalInstruments = 10,
  InternalDestinies = 11,
  InternalServices = 12,
  InternalNeeds = 13,
  Presentations = 14,
  Market = 15,
  PublicInfo = 16,
  Solicitations = 17,
  Messages = 18,
  Trainings = 19,
  PymeCompanySelect = 20,
  PymeHome = 21,
  FAQ = 22,
  InternalAdminProfile = 23,
  Library = 24,
  OffererWorkTeam = 25,
  OffererSummary = 26,
  OffererReports = 27,
  InternalVerifyPerson = 28,
  OffererTemplates = 29,
  MailTemplates = 30,
  InternalParameters = 31,
  InternalCompanies = 32,
  OffererIntegration = 33,
  OffererProspects = 34,
  InternalSolicitations = 35,
  InternalAds = 36,
  InternalReports = 37,
  InternalSelectedLines = 38,
  InternalAllUsers = 39
}
