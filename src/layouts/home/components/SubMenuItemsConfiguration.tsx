import { IItemMenu, MenuCode } from 'types/menu/menuLink';

/*const listItemsMenuAdministrador: IItemMenu[] = [
    {
        nestedType: MenuType.Shallow,
        label: "Empresas",
        link: `/admin/companies`,
        icon: <BusinessTwoTone />
    },
    {
        nestedType: MenuType.Shallow,
        label: "Usuários",
        link: `/admin/users`,
        icon: <SupervisedUserCircleTwoTone />
    },
];*/

export const ListMenuItemByMenuCode: Record<MenuCode, IItemMenu[]> = {
  [MenuCode.Home]: [],
  [MenuCode.OffererHome]: [],
  [MenuCode.OffererLines]: [],
  [MenuCode.OffererRoles]: [],
  [MenuCode.OffererSolicitations]: [],
  [MenuCode.OffererLibrary]: [],
  [MenuCode.InternalHome]: [],
  [MenuCode.InternalLines]: [],
  [MenuCode.InternalProducts]: [],
  [MenuCode.InternalInstruments]: [],
  [MenuCode.InternalDestinies]: [],
  [MenuCode.InternalServices]: [],
  [MenuCode.InternalNeeds]: [],
  [MenuCode.Presentations]: [],
  [MenuCode.Solicitations]: [],
  [MenuCode.Market]: [],
  [MenuCode.PublicInfo]: [],
  [MenuCode.Messages]: [],
  [MenuCode.Trainings]: [],
  [MenuCode.PymeCompanySelect]: [],
  [MenuCode.PymeHome]: [],
  [MenuCode.FAQ]: [],
  /*    [MenuCode.Company_Home]: [],
    [MenuCode.Company_Role]: [],
    [MenuCode.Company_Communications]: [],
    [MenuCode.Company_Activity]: [],
    [MenuCode.Company_RelatedPeople]: [],
    [MenuCode.Company_RelatedPeopleSociety]: [],
    [MenuCode.Company_Financial]: [],
    [MenuCode.Company_Flow]: [],
    [MenuCode.Company_Library]: [],*/
};
