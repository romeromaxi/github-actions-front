import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Grid } from '@mui/material';
import { AddButton } from 'components/buttons/Buttons';

import AddressFormManager from './AddressFormManager';

import { BaseRequestFields } from 'types/baseEntities';
import { AddressTypes } from 'types/general/generalEnums';
import { EntityAddressFields } from 'types/general/generalReferentialData';
import { CompanyAddressInsertDTO } from 'types/company/companyReferentialData';

interface AddressFormProps {
  addressFieldName: string;
  obligatoryTypes?: AddressTypes[];
}

function AddressFormListManager({
  addressFieldName,
  obligatoryTypes,
}: AddressFormProps) {
  const { control, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: addressFieldName,
  });

  const updateObligatoryAddress = (type: AddressTypes, index: number) => {
    setValue(`${addressFieldName}.${index}`, {
      [EntityAddressFields.Street]: '',
      [EntityAddressFields.StreetNumber]: '',
      [EntityAddressFields.Floor]: '',
      [EntityAddressFields.PostalCode]: '',
      [EntityAddressFields.ProvinceCode]: 0,
      [EntityAddressFields.DepartmentCode]: 0,
      [EntityAddressFields.MunicipalityCode]: 0,
      [EntityAddressFields.CountryCode]: 1,
      [EntityAddressFields.AddressTypeCode]: type,
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    } as unknown as CompanyAddressInsertDTO);
  };

  const removeObligatoryAddress = (type: AddressTypes, index: number) => {
    let anyOfType: boolean =
      fields.filter(
        (x, idx) =>
          // @ts-ignore
          x[EntityAddressFields.AddressTypeCode] === type &&
          // @ts-ignore
          x[EntityAddressFields.Street] !== '' &&
          idx !== index,
      )?.length > 0;

    if (anyOfType) remove(index);
    else updateObligatoryAddress(type, index);
  };

  const mapWhenObligatory = () => {
    if (!obligatoryTypes) return;

    let mapResult: any[] = [];
    let hayAnyByObligatoryType: Record<AddressTypes, boolean> = {
      [AddressTypes.Fiscal]: false,
      [AddressTypes.Legal]: false,
      [AddressTypes.Real]: false,
      [AddressTypes.Activity]: false,
    };

    fields.forEach((field, idx) => {
      // @ts-ignore
      let addressType: number = field.codDomicilioTipo ?? 1;
      let isObligatotyType: boolean = obligatoryTypes.includes(addressType);
      let functionOnDelete: (x: number) => void = remove;
      let fixObligatoryType: boolean =
        isObligatotyType &&
        !hayAnyByObligatoryType[addressType as AddressTypes];

      if (fixObligatoryType) {
        functionOnDelete = (x: number) =>
          removeObligatoryAddress(addressType, x);
        hayAnyByObligatoryType[addressType as AddressTypes] = true;
      }

      let component = (
        <AddressFormManager
          key={field.id}
          addressFieldName={`${addressFieldName}.${idx}`}
          onDelete={() => functionOnDelete(idx)}
          fixType={fixObligatoryType}
        />
      );

      mapResult.push(component);
    });

    return mapResult;
  };

  const mapAddress = () => {
    if (!!obligatoryTypes) return mapWhenObligatory();

    return fields.map((field, idx) => (
      <AddressFormManager
        key={field.id}
        addressFieldName={`${addressFieldName}.${idx}`}
        onDelete={() => remove(idx)}
      />
    ));
  };

  return (
    <Grid container spacing={2}>
      {mapAddress()}

      <Grid item container>
        <Grid item xs>
          <Grid container direction="row-reverse">
            <AddButton
              size="small"
              onClick={() =>
                append({
                  [EntityAddressFields.Street]: '',
                  [EntityAddressFields.StreetNumber]: '',
                  [EntityAddressFields.Floor]: '',
                  [EntityAddressFields.PostalCode]: '',
                  [EntityAddressFields.ProvinceCode]: 0,
                  [EntityAddressFields.DepartmentCode]: 0,
                  [EntityAddressFields.MunicipalityCode]: 0,
                  [EntityAddressFields.CountryCode]: 1,
                  [EntityAddressFields.AddressTypeCode]: 0,
                  [BaseRequestFields.OriginCode]: 1,
                  [BaseRequestFields.ModuleCode]: 1,
                } as unknown as CompanyAddressInsertDTO)
              }
            >
              {' '}
              Domicilio
            </AddButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AddressFormListManager;
