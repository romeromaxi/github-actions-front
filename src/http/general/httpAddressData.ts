import { HttpAxiosRequest } from '../httpAxiosBase';

import { EntityWithIdAndDescription } from 'types/baseEntities';
import {
  AddressDataWithPostalCode,
  Country,
  Department,
  Municipality,
  Province,
} from 'types/general/generalAddressData';

export const HttpAddressData = {
  getEndpoint: (url: string): string => `domicilio-datos${url}`,

  getAddressTypes: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpAddressData.getEndpoint('/tipos'));
  },

  getAddressDataByPostalCodeAndCountry: (
    countryCode: number,
    postalCode: string,
  ): Promise<AddressDataWithPostalCode> => {
    return HttpAxiosRequest.get(
      HttpAddressData.getEndpoint(
        `/paises/${countryCode}/localidades/${postalCode}`,
      ),
    );
  },

  getCountries: (): Promise<Country[]> => {
    return HttpAxiosRequest.get(HttpAddressData.getEndpoint(`/paises`));
  },

  getProvinces: (countryCode: number): Promise<Province[]> => {
    return HttpAxiosRequest.get(
      HttpAddressData.getEndpoint(`/paises/${countryCode}/provincias`),
    );
  },

  getPartidos: (
    countryCode: number,
    provinceCode: number,
  ): Promise<Department[]> => {
    return HttpAxiosRequest.get(
      HttpAddressData.getEndpoint(
        `paises/${countryCode}/provincias/${provinceCode}/partidos`,
      ),
    );
  },

  getLocalities: (
    countryCode: number,
    provinceCode: number,
    departmentCode: number,
  ): Promise<Municipality[]> => {
    return HttpAxiosRequest.get(
      HttpAddressData.getEndpoint(
        `paises/${countryCode}/provincias/${provinceCode}/partidos/${departmentCode}/localidades`,
      ),
    );
  },
};
