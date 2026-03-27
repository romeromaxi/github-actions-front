import {
  FilterProductLineSearch,
  FilterProductLineSearchFields,
} from '../../types/lines/productLineData';
import {SelectedFilters} from "../../pages/markets/lines/ProductLineSearch";

export type MarketLandingFilter = {
  [FilterProductLineSearchFields.CodsProduct]?: number[];
  [FilterProductLineSearchFields.CodsProductNeed]?: number[];
  [FilterProductLineSearchFields.CodsProductDestiny]?: number[];
  [FilterProductLineSearchFields.CodsProductService]?: number[];
  [FilterProductLineSearchFields.CodsProductInstrument]?: number[];
  [FilterProductLineSearchFields.CodsProductInstrumentType]?: number[];
  [FilterProductLineSearchFields.AmountToFinance]?: number,
  [FilterProductLineSearchFields.CodsCurrency]?: number[]
};

class MarketFilterStorage {
  landingFilterKey: string = 'LUCMarketLandingFilters';
  searchFilterKey: string = 'LUCMarketSearchFilters';
  primarySearchParamKey: string = 'LUCPrimaryMarketSearchParam';
  stackedFiltersKey: string = 'LUCMarketStackedFilters';

  public saveLandingFilter(landingFilter: MarketLandingFilter) {
    sessionStorage.setItem(
      this.landingFilterKey,
      JSON.stringify(landingFilter),
    );
  }

  public getLandingFilter(): MarketLandingFilter | null {
    return JSON.parse(sessionStorage.getItem(this.landingFilterKey) as string);
  }

  public clearLandingFilter() {
    sessionStorage.removeItem(this.landingFilterKey);
  }

  public hasLandingDestiny() {
    return (
      this.getLandingFilter()?.[
        FilterProductLineSearchFields.CodsProductDestiny
      ]?.length || 0 > 0
    );
  }
  public hasLandingService() {
    return (
      this.getLandingFilter()?.[
        FilterProductLineSearchFields.CodsProductService
      ]?.length || 0 > 0
    );
  }
  public hasLandingInstrument() {
    return (
      this.getLandingFilter()?.[
        FilterProductLineSearchFields.CodsProductInstrument
      ]?.length || 0 > 0
    );
  }
  public hasLandingInstrumentTypes() {
    return (
      this.getLandingFilter()?.[
        FilterProductLineSearchFields.CodsProductInstrumentType
      ]?.length || 0 > 0
    );
  }
  public hasLandingProduct() {
    return (
      this.getLandingFilter()?.[FilterProductLineSearchFields.CodsProduct]
        ?.length || 0 > 0
    );
  }

  public saveSearchFilter(searchFilter: FilterProductLineSearch) {
    sessionStorage.setItem(this.searchFilterKey, JSON.stringify(searchFilter));
  }

  public getSearchFilter(): FilterProductLineSearch | null {
    return JSON.parse(sessionStorage.getItem(this.searchFilterKey) as string);
  }

  public clearSearchFilter() {
    sessionStorage.removeItem(this.searchFilterKey);
  }

  public savePrimarySearchParam(param: { name: string; value: string }) {
    sessionStorage.setItem(this.primarySearchParamKey, JSON.stringify(param));
  }

  public saveStackedFilters(stackedFilters: SelectedFilters) {
    sessionStorage.setItem(this.stackedFiltersKey, JSON.stringify(stackedFilters))
  }
  
  public getStackedFilters(): SelectedFilters | null {
    return JSON.parse(sessionStorage.getItem(this.stackedFiltersKey) as string)  
  }
  
  public clearStackedFilters() {
    sessionStorage.removeItem(this.stackedFiltersKey);
  }
  
  public getPrimarySearchParam(): {
    name: string;
    value: string;
  } | null {
    return JSON.parse(
      sessionStorage.getItem(this.primarySearchParamKey) as string,
    );
  }
  
}

export const marketFilterStorage = new MarketFilterStorage();
