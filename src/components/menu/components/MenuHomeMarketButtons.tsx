import React, {Fragment, useMemo, useState} from 'react';
import MenuMarketCategories, {MarketCategoryNode, MarketCategoryNodeFields,} from '../MenuMarketCategories';
import {AppRouteSecObjects, SecurityComponents} from 'types/security';
import useSecurityObject from 'hooks/useSecurityObject';
import {useLocation, useNavigate} from 'react-router-dom';
import FailRedirectMarketDialog from 'pages/markets/home/components/FailRedirectMarketDialog';
import {EntityWithIdFields,} from 'types/baseEntities';
import {marketFilterStorage, MarketLandingFilter,} from 'util/sessionStorage/marketFiltersStorage';
import {FilterProductLineSearchFields} from 'types/lines/productLineData';
import DialogAlertBuildingLUC from '../../dialog/DialogAlertBuildingLUC';
import MenuMarketAssistedSearch from "../MenuMarketAssistedSearch";
import {Stack, useMediaQuery, useTheme} from "@mui/material";
import {AppBarButton} from "../../buttons/HomeButtons";
import {userStorage} from '../../../util/localStorage/userStorage';
import {Module} from "../../../types/form/login/login-enum";
import {AppRoutesDefinitions, useAppNavigation} from "../../../hooks/navigation";

interface MenuHomeMarketButtonsProps {
  asItems?: boolean,
  module?: Module
}
function MenuHomeMarketButtons({asItems, module} : MenuHomeMarketButtonsProps) {
  const routeDomNavigate = useNavigate();
  const location = useLocation();
  const { navigate } = useAppNavigation();
  const theme = useTheme();
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const isLoggedIn = useMemo(() => userStorage.isLogged(), []);
  const { hasReadPermission } = useSecurityObject();

  const [failRedirect, setFailRedirect] = useState<boolean>(false);
  const [openBuilding, setOpenBuilding] = useState<boolean>(false);
  
  const currentPath = useMemo(() => location.pathname || "", [location]);
  
  const sectionAboutLucActive = useMemo(() => currentPath === (window?.URL_ABOUT_LUC || "null"), [currentPath]);
  
  const sectionFAQActive = useMemo(() => currentPath === (window?.URL_FAQ_LUC|| "null"), [currentPath]);

  const sectionContactActive = useMemo(() => currentPath === (window?.URL_CONTACT_LUC|| "null"), [currentPath]);
  
  const inMarket = 
    (window.location.toString().includes('/market/landing') || window.location.toString().includes('/market/lines'))
  && !window.location.toString().includes('/market/lines/carrito');

  const onNavigateCategory = (path: string) => {
    if (
      !hasReadPermission(
        SecurityComponents.AppRoutes,
        AppRouteSecObjects.MarketProductLineSearchRoute,
      )
    ) {
      setFailRedirect(true);
      return;
    }

    onHandleNavigate(path);
  };

  const onHandleNavigate = (path: string) => {
    const newFilter: MarketLandingFilter = {};

    marketFilterStorage.clearSearchFilter();
    marketFilterStorage.clearStackedFilters();

    const queryString = path.split('?')?.[1] || path;

    const searchParams = new URLSearchParams(queryString);

    for (const [key, value] of searchParams) {
      const values = Array.isArray(value)
        ? value.map((x) => parseInt(x))
        : [parseInt(value)];
      switch (key) {
        case 'destiny':
          newFilter[FilterProductLineSearchFields.CodsProductDestiny] = values;
          break;
        case 'service':
          newFilter[FilterProductLineSearchFields.CodsProductService] = values;
          break;
        case 'instrumentType':
          newFilter[FilterProductLineSearchFields.CodsProductInstrumentType] =
            values;
          break;
      }
    }


    marketFilterStorage.savePrimarySearchParam({
      name: '',
      value: '',
    });
    marketFilterStorage.saveLandingFilter(newFilter);

    routeDomNavigate(path);
  };

  const findParentCategoryNode = (
    parentId: number,
    categories: MarketCategoryNode[] | null,
  ): number[] | null => {
    if (!categories || !categories.length) return null;

    // No se puede usar el categories.forEach porque no corta en el return interno
    for (let index = 0; index < categories.length; index++) {
      const node = categories[index];

      if (node[EntityWithIdFields.Id] == parentId) return [index];

      const childrenNode = node[MarketCategoryNodeFields.Children];
      if (childrenNode.length) {
        const leafIndexes = findParentCategoryNode(parentId, childrenNode);

        if (!!leafIndexes) return [index, ...leafIndexes];
      }
    }

    return null;
  };
  
  
  const menuOptionsForMarket = ( 
    <>
      <MenuMarketAssistedSearch />
      <MenuMarketCategories
        title={"Búsqueda por Productos"}
        onNavigate={onNavigateCategory}
        mobileView={asItems}
      />
    </>
  );

  const goToMarketLanding = () => navigate(AppRoutesDefinitions.MarketLanding);
  
  const goToAboutLuc = () => navigate(AppRoutesDefinitions.LucAboutPage);

  const goToFAQLuc = () => navigate(AppRoutesDefinitions.LucFAQPage);

  const goToContactLuc = () => navigate(AppRoutesDefinitions.LucContactPage);

  const menuOptions = ( 
    <React.Fragment>
      {
        (!module || module === Module.Company) &&
          <React.Fragment>
            <AppBarButton onClick={goToAboutLuc} isActive={sectionAboutLucActive}>
              Sobre LUC
            </AppBarButton>
            
            <AppBarButton onClick={goToFAQLuc} isActive={sectionFAQActive}>
              Preguntas Frecuentes
            </AppBarButton>
            
            <AppBarButton onClick={goToContactLuc} isActive={sectionContactActive}>
              Contacto
            </AppBarButton>
          </React.Fragment>
      }
    </React.Fragment>
  );

  const menuFailOrBuilding = (
    <>
      <FailRedirectMarketDialog
        open={failRedirect}
        onClose={() => setFailRedirect(false)}
        description={"Para buscar un producto, es necesario que te registres o ingreses con tu cuenta de LUC."} />
      <DialogAlertBuildingLUC open={openBuilding} onClose={() => setOpenBuilding(false)} />
    </>
  );

  return (
    asItems ?
      <Fragment>
        <Stack spacing={2}>
          {inMarket ?
              <>
                {menuOptionsForMarket}
                {menuOptions}
              </>
            :
              <>{menuOptions}</>
          }
        </Stack>
        {menuFailOrBuilding}
      </Fragment>
      :
      <Stack direction={'row'} justifyContent={'space-evenly'} alignItems={'center'} spacing={4} sx={ 
        isExtraLargeScreen ? 
          isLoggedIn ? 
            { flexBasis: "69%", flexShrink: 1, flexGrow: 0 } 
          :  
            { flexBasis: "70%", flexShrink: 1, flexGrow: 0 } 
        : undefined
        }
      >
        {inMarket ?
          <>
            {menuOptionsForMarket}
            {menuOptions}
            {menuFailOrBuilding}
          </>
        :
          <>
            {
                (isLoggedIn) &&
                  <AppBarButton onClick={goToMarketLanding}>
                    Ir a la Tienda
                  </AppBarButton>
            }
            {menuOptions}
          </>
        }
      </Stack>
  );
}

export default MenuHomeMarketButtons;
