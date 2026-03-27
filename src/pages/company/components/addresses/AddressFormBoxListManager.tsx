import React, {useCallback, useEffect, useState} from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {Box, Stack, Typography} from '@mui/material';

import { DialogAlert } from 'components/dialog';

import AddressFormBoxComponent from './AddressFormBoxComponent';

import { BaseRequestFields } from 'types/baseEntities';
import { AddressTypes } from 'types/general/generalEnums';
import { CompanyAddressInsertDTO } from 'types/company/companyReferentialData';
import {
  EntityAddress,
  EntityAddressFields,
} from 'types/general/generalReferentialData';

import { AddressFormatter } from 'util/formatters/addressFormatter';
import AddressDialog from './AddressDialog';
import {AddButton} from "components/buttons/Buttons";

interface AddressFormProps {
  addressFieldName: string;
  obligatoryTypes?: AddressTypes[];
  disableFiscalAddress?: boolean;
  cantAddAddress?: boolean;
  addressPerRow?: number;
  companyFileOpen?: boolean;
  onCloseCompanyFile?: () => void;
  disabled?: boolean;
}

interface AddressToEdit {
  index: number;
  fixType: boolean;
}

interface AddressToRemove {
  index: number;
  address: EntityAddress;
  function: (x: number) => void;
}

function AddressFormBoxListManager({
  addressFieldName,
  obligatoryTypes,
  addressPerRow,
  cantAddAddress = false,
  disableFiscalAddress = false,
  companyFileOpen,
  onCloseCompanyFile,
  disabled,
}: AddressFormProps) {
  const rowSize: number = addressPerRow || 1;

  const [showNewAddress, setShowNewAddress] = useState<boolean>(false);
  const [addressToEdit, setAddressToEdit] = useState<AddressToEdit>();
  const [addressToRemove, setAddressToRemove] = useState<AddressToRemove>();
  const [addressIdx, setAddressIdx] = useState<number>()

  const { control, setValue, watch } = useFormContext();

  const { fields, append, update, remove } = useFieldArray({
    control: control,
    name: addressFieldName,
  });

  const updateObligatoryAddress = (type: AddressTypes, index: number) => {
    setValue(`${addressFieldName}.${index}`, {
      [EntityAddressFields.Street]: '',
      [EntityAddressFields.StreetNumber]: '',
      [EntityAddressFields.Floor]: '',
      [EntityAddressFields.PostalCode]: '',
      [EntityAddressFields.ProvinceCode]: null,
      [EntityAddressFields.DepartmentCode]: null,
      [EntityAddressFields.MunicipalityCode]: null,
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
      [AddressTypes.ActivityMain]: false,
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

      let onEdit: (() => void) | undefined =
        addressType !== AddressTypes.Fiscal
          ? () =>
              setAddressToEdit({
                index: idx,
                fixType: companyFileOpen ? companyFileOpen : fixObligatoryType,
              })
          : undefined;

      let onDelete: (() => void) | undefined =
        addressType !== AddressTypes.Fiscal
          ? () =>
              setAddressToRemove({
                index: idx,
                address: watch(`${addressFieldName}.${idx}`),
                function: functionOnDelete,
              })
          : undefined;

      let component = (
        <AddressFormBoxComponent
          key={field.id}
          address={watch(`${addressFieldName}.${idx}`)}
          onEdit={onEdit}
          onDelete={onDelete}
          disabled={disabled}
        />
      );

      mapResult.push(component);
    });

    return mapResult;
  };

  const mapAddress = () => {
    if (!!obligatoryTypes) return mapWhenObligatory();

    return fields.map((field, idx) => {
      const isFiscal =
        watch(`${addressFieldName}.${idx}`)[
          EntityAddressFields.AddressTypeCode
        ] === AddressTypes.Fiscal;
      return (
        <AddressFormBoxComponent
          key={field.id}
          address={watch(`${addressFieldName}.${idx}`)}
          onEdit={
            !(isFiscal && disableFiscalAddress)
              ? () => setAddressToEdit({ index: idx, fixType: false })
              : undefined
          }
          onDelete={
            !(isFiscal && disableFiscalAddress)
              ? () => remove(idx)
              : undefined
          }
          disabled={disabled}
        />
      );
    });
  };

  const onNewAddress = () => setShowNewAddress(true);

  const onCloseDrawer = () => {
    setShowNewAddress(false);
    setAddressToEdit(undefined);
  };

  const onSaveAddress = (address: CompanyAddressInsertDTO) => {
    if (
      address[EntityAddressFields.AddressTypeCode] === AddressTypes.ActivityMain
    )
      fields.forEach((field, idx) => {
        const isActivityMain =
          watch(`${addressFieldName}.${idx}`)[
            EntityAddressFields.AddressTypeCode
          ] === AddressTypes.ActivityMain;
        if (isActivityMain) {
          setValue(
            `${addressFieldName}.${idx}.${EntityAddressFields.AddressTypeCode}`,
            AddressTypes.Activity,
          );
          setValue(
            `${addressFieldName}.${idx}.${EntityAddressFields.AddressTypeDesc}`,
            'Actividad',
          );
        }
      });

    if (!!addressToEdit) update(addressToEdit.index, address);
    else append(address);

    onCloseDrawer();
  };
  
  const onSaveCompanyFile = (data: CompanyAddressInsertDTO) => {
    if (!!addressIdx) update(addressIdx, data)
    else append(data)
    onCloseCompanyFile && onCloseCompanyFile()
  }

  const onCancelDelete = () => setAddressToRemove(undefined);

  const onConfirmDelete = () => {
    if (addressToRemove) addressToRemove.function(addressToRemove.index);

    setAddressToRemove(undefined);
  };

  const searchActivityIdx = useCallback(() => {
    if (companyFileOpen) {
      const lst = watch(addressFieldName);
      return lst.findIndex((i: any) => i[EntityAddressFields.AddressTypeCode] === AddressTypes.Activity);
    }
  }, [watch, addressFieldName, companyFileOpen])

  useEffect(() => {
    const idx = searchActivityIdx();
    setAddressIdx(idx);
  }, [searchActivityIdx]);

  const activityPath = `${addressFieldName}.${addressIdx !== undefined ? addressIdx : ''}`;

  return (
      <>
        {
          companyFileOpen && onCloseCompanyFile ?
              <AddressDialog
                  open
                  onClose={onCloseCompanyFile}
                  onSubmit={onSaveCompanyFile}
                  addressBase={watch(activityPath)}
                  fixType
                  hidenTypes={{
                    [AddressTypes.Fiscal]: true,
                    [AddressTypes.Activity]: false,
                    [AddressTypes.ActivityMain]: false,
                    [AddressTypes.Real]: true,
                    [AddressTypes.Legal]: true
                  }}
                  //loadAddressesTypes={loadAddressTypes}
              />
              :
            <Stack spacing={2}>
                <Typography variant={'h6'}>
                  Domicilios
                </Typography>
                
              <Stack spacing={2}>
                {mapAddress()}
              </Stack>

                {
                    (!cantAddAddress && !disabled) && (
                        <Box id={'hideThis'} sx={{width: '100% !important'}}>
                            <AddButton variant={'text'} color={'primary'}
                                       onClick={onNewAddress}
                                       fullWidth
                            >
                                Agregar nuevo domicilio
                            </AddButton>
                        </Box>
                    )
                }
                
                
              <AddressDialog
                open={showNewAddress || !!addressToEdit}
                onClose={onCloseDrawer}
                onSubmit={onSaveAddress}
                addressBase={
                  !addressToEdit
                    ? undefined
                    : watch(`${addressFieldName}.${addressToEdit.index}`)
                }
                fixType={!!addressToEdit ? addressToEdit.fixType : companyFileOpen}
                hidenTypes={{
                  [AddressTypes.Fiscal]: true,
                  [AddressTypes.Activity]: false,
                  [AddressTypes.ActivityMain]: false,
                  [AddressTypes.Real]: fields.some(
                    (fields, idx) =>
                      watch(`${addressFieldName}.${idx}`)[
                        EntityAddressFields.AddressTypeCode
                      ] === AddressTypes.Real,
                  ),
                  [AddressTypes.Legal]: fields.some(
                    (fields, idx) =>
                      watch(`${addressFieldName}.${idx}`)[
                        EntityAddressFields.AddressTypeCode
                      ] === AddressTypes.Legal,
                  ),
                }}
                //loadAddressesTypes={loadAddressTypes}
              />
        
              <DialogAlert
                open={!!addressToRemove}
                onClose={onCancelDelete}
                onConfirm={onConfirmDelete}
                textContent={`¿Estás seguro que deseás eliminar el domicilio ${!!addressToRemove ? AddressFormatter.toFullAddress(addressToRemove.address) : ''}?`}
              />
            </Stack>
        }
      </>
  );
}

export default AddressFormBoxListManager;
