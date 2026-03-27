import {Module} from '../types/form/login/login-enum';
import {createSearchParams, URLSearchParamsInit, useNavigate} from 'react-router-dom';
import {marketFilterStorage, MarketLandingFilter} from "../util/sessionStorage/marketFiltersStorage";
import {FilterProductLineSearchFields} from "../types/lines/productLineData";

export const useModuleNavigate = (hookModule = Module.None) => {
  const redirectMap: Record<Module, string> = {
    [Module.Company]: '/mi-cuenta',
    [Module.Offerer]: '/offerer/home',
    [Module.Internal]: '/internal/home',
    [Module.None]: '/',
    [Module.Market]: '/market/lines',
  };
  const navigateHook = useNavigate();
  
  const navigateToMarketStore = () => {
    let listParams: URLSearchParamsInit | undefined = [];
    let searchParams = createSearchParams(listParams);
    marketFilterStorage.clearSearchFilter();
    marketFilterStorage.clearStackedFilters();

    let landingFilter : MarketLandingFilter = {
      [FilterProductLineSearchFields.CodsProduct]: [],
      [FilterProductLineSearchFields.CodsProductDestiny]: [],
      [FilterProductLineSearchFields.CodsProductService]: [],
      [FilterProductLineSearchFields.CodsProductInstrument]: [],
      [FilterProductLineSearchFields.CodsProductInstrumentType]: []
    }

    if (window.IS_PRODUCTION_ENV) {
      listParams.push(['service', 2]);
      landingFilter[FilterProductLineSearchFields.CodsProductService] = [2];
    }
    
    marketFilterStorage.saveLandingFilter(landingFilter);
    navigateHook(`${redirectMap[Module.Market]}?${searchParams}`);
  }
  
  const navigate = (module?: Module) => {
    if (module === Module.Market) {
      navigateToMarketStore();
      return;
    }
    
    navigateHook(redirectMap[module || hookModule]);
  };
  return navigate;
};
