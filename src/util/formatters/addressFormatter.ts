import {
  EntityAddress,
  EntityAddressFields,
} from '../../types/general/generalReferentialData';
import { AddressTypes } from '../../types/general/generalEnums';

export const AddressFormatter = {
  toFullAddress: (address: EntityAddress): string => {
    const streetWithNumber = [
      address?.[EntityAddressFields.Street],
      address?.[EntityAddressFields.StreetNumber],
    ]
      .filter((e) => !!e)
      .join(' ');
    const floor = address?.[EntityAddressFields.Floor]
      ? `Piso/Dept.: ${address[EntityAddressFields.Floor]}`
      : '';
    const postalCode = address?.[EntityAddressFields.PostalCode]
      ? `(${address[EntityAddressFields.PostalCode]})`
      : '';
    const geoData = [
      floor,
      postalCode,
      address?.[EntityAddressFields.MunicipalityDesc],
      address?.[EntityAddressFields.ProvinceDesc],
    ]
      .filter((e) => !!e)
      .join(' - ');
    return [streetWithNumber, geoData].filter((e) => !!e).join(', ');
  },

  toStreetWithNumber: (address: EntityAddress): string => {
    const streetWithNumber = [
      address?.[EntityAddressFields.Street],
      address?.[EntityAddressFields.StreetNumber],
    ]
      .filter((e) => !!e)
      .join(' ');
    const floor = [address?.[EntityAddressFields.Floor]]
      .filter((e) => !!e)
      .join(' ');
    return [streetWithNumber, floor].filter((e) => !!e).join(', ');
  },

  toSecondaryData: (address: EntityAddress): string => {
    
    const postalCode = address?.[EntityAddressFields.PostalCode]
        ? `(CP: ${address[EntityAddressFields.PostalCode]})`
        : '';
    
    const geoData = [
      address?.[EntityAddressFields.MunicipalityDesc],
      address?.[EntityAddressFields.ProvinceDesc],
      postalCode
    ]
        .filter((e) => !!e)
        .join(' - ');
    return [geoData].filter((e) => !!e).join(', ');
  },
  
  getLabel: (address: EntityAddress, onlyType?: boolean): string => {
    const labels = {
      [AddressTypes.Fiscal]: 'Fiscal',
      [AddressTypes.Legal]: 'Legal',
      [AddressTypes.Activity]: 'Actividad',
      [AddressTypes.ActivityMain]: 'Actividad Principal',
      [AddressTypes.Real]: 'Real',
    };
    return `${onlyType ? '' : 'Domicilio '}${labels[address[EntityAddressFields.AddressTypeCode]]}`;
  },
};
