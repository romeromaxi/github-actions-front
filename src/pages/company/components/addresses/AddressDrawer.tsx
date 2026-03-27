import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Grid } from '@mui/material';

import {AsyncSelect, ControlledTextFieldFilled} from 'components/forms';
import { SendButton } from 'components/buttons/Buttons';

import {
  AddressDataFields,
  Department,
  DepartmentFields,
  Municipality,
  MunicipalityFields,
  Province,
} from 'types/general/generalAddressData';

import { HttpAddressData } from 'http/general';
import { removeDuplicatesById } from 'util/helpers';
import { AddressTypes } from 'types/general/generalEnums';
import {
  EntityAddress,
  EntityAddressFields,
} from 'types/general/generalReferentialData';
import {
  BaseRequestFields,
  EntityWithIdAndDescriptionFields,
} from 'types/baseEntities';

import DrawerBase from 'components/misc/DrawerBase';
import { CompanyAddressInsertDTO } from 'types/company/companyReferentialData';
import {
  RequiredSelectSchema,
  RequiredStringSchema,
} from 'util/validation/validationSchemas';

interface AddressDrawerProps {
  show: boolean;
  onSave: (address: CompanyAddressInsertDTO) => void;
  addressBase?: EntityAddress;
  fixType?: boolean;
  onCloseDrawer: () => void;
}

function AddressDrawer(props: AddressDrawerProps) {
  const addressDrawerSchema = yup.object().shape({
    [EntityAddressFields.AddressTypeCode]: RequiredSelectSchema,
    [EntityAddressFields.Street]: RequiredStringSchema,
    [EntityAddressFields.PostalCode]: RequiredStringSchema,
  });

  const { control, setValue, watch, handleSubmit, reset } =
    useForm<CompanyAddressInsertDTO>({
      defaultValues: props.addressBase,
      resolver: yupResolver(addressDrawerSchema),
    });

  const [provinces, setProvinces] = useState<Province[] | null>(null);
  const [partidos, setPartidos] = useState<Department[] | null>(null);
  const [filteredPartidos, setFilteredPartidos] = useState<Department[] | null>(
    null,
  );
  const [localities, setLocalities] = useState<Municipality[] | null>(null);
  const [filteredlocalities, setFilteredLocalities] = useState<
    Municipality[] | null
  >(null);
  const watchPais = useWatch({
    control,
    name: EntityAddressFields.CountryCode,
  });
  const watchCodigoPostal = useWatch({
    control,
    name: EntityAddressFields.PostalCode,
  });
  const watchProvincia = useWatch({
    control,
    name: EntityAddressFields.ProvinceCode,
  });
  const watchPartido = useWatch({
    control,
    name: EntityAddressFields.DepartmentCode,
  });
  const watchLocality = useWatch({
    control,
    name: EntityAddressFields.MunicipalityCode,
  });

  const loadAddressData = async (pais: number, CP: string) => {
    if (pais && CP) {
      const data = await HttpAddressData.getAddressDataByPostalCodeAndCountry(
        pais,
        CP,
      );
      let unique_provinces = removeDuplicatesById(
        data[AddressDataFields.Provinces],
      ) as Province[];
      let unique_partidos = removeDuplicatesById(
        data[AddressDataFields.Departments],
      ) as Department[];
      let unique_localities = removeDuplicatesById(
        data[AddressDataFields.Municipalities],
      ) as Municipality[];
      setProvinces(unique_provinces);
      setPartidos(unique_partidos);
      setLocalities(unique_localities);
    }
  };

  const loadFilteredPartidos = () => {
    setFilteredPartidos(
      partidos?.filter(
        (p) => p[DepartmentFields.ProvinceCode] === watchProvincia,
      ) || null,
    );
  };

  const loadFilteredLocalities = () => {
    setFilteredLocalities(
      localities?.filter(
        (l) =>
          l[MunicipalityFields.ProvinceCode] === watchProvincia &&
          l[MunicipalityFields.DepartmentCode] === watchPartido,
      ) || null,
    );
  };

  const loadAddressTypes = useCallback(() => {
    return HttpAddressData.getAddressTypes().then((types) => {
      return Promise.resolve(types.filter((t) => t.id !== AddressTypes.Fiscal));
    });
  }, []);

  useEffect(() => {
    loadFilteredPartidos();
  }, [partidos, watchProvincia]);

  useEffect(() => {
    loadFilteredLocalities();
  }, [localities, watchPartido, watchProvincia]);

  useEffect(() => {
    if (provinces?.length === 1) {
      setValue(EntityAddressFields.ProvinceCode, provinces[0].id);
    }
  }, [provinces]);

  useEffect(() => {
    if (filteredPartidos && filteredPartidos.length >= 1) {
      setValue(EntityAddressFields.DepartmentCode, filteredPartidos[0].id);
    }
  }, [filteredPartidos]);

  useEffect(() => {
    if (filteredlocalities && filteredlocalities.length >= 1) {
      setValue(EntityAddressFields.MunicipalityCode, filteredlocalities[0].id);
    }
  }, [filteredlocalities]);

  useEffect(() => {
    (async () => {
      if (watch(EntityAddressFields.CountryCode) !== null) {
        await loadAddressData(
          watch(EntityAddressFields.CountryCode) || 1,
          watchCodigoPostal || '',
        );
      }
    })();
  }, [watchPais]);

  const onBlurCP = useCallback(() => {
    if (watch(EntityAddressFields.CountryCode)) {
      loadAddressData(
        watch(EntityAddressFields.CountryCode) || 1,
        watch(EntityAddressFields.PostalCode) || '',
      );
    }
  }, [watchPais, watchCodigoPostal]);

  useEffect(() => {
    if (watchProvincia && provinces)
      setValue(
        EntityAddressFields.ProvinceDesc,
        provinces.filter(
          (x) => x[EntityWithIdAndDescriptionFields.Id] === watchProvincia,
        )[0][EntityWithIdAndDescriptionFields.Description],
      );
  }, [watchProvincia]);

  useEffect(() => {
    if (watchLocality && localities)
      setValue(
        EntityAddressFields.MunicipalityDesc,
        localities.filter(
          (x) => x[EntityWithIdAndDescriptionFields.Id] === watchLocality,
        )[0][EntityWithIdAndDescriptionFields.Description],
      );
  }, [watchLocality]);

  const onHandleClose = () => {
    props.onCloseDrawer();
    reset({
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
    });
  };

  useEffect(() => {
    if (props.addressBase) reset(props.addressBase);
  }, [props.addressBase]);

  const onHandleSubmit = (data: CompanyAddressInsertDTO) => {
    props.onSave(data);
    reset({
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
    });
  };

  return (
    <DrawerBase
      show={props.show}
      title="Nuevo Domicilio"
      onCloseDrawer={onHandleClose}
    >
      <Grid container spacing={2} mt={1}>
        {!props.fixType && (
          <Grid item xs={12}>
            <AsyncSelect
              label={'Tipo'}
              loadOptions={loadAddressTypes}
              control={control}
              name={EntityAddressFields.AddressTypeCode}
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <ControlledTextFieldFilled
            label={'Calle'}
            control={control}
            name={EntityAddressFields.Street}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledTextFieldFilled
            label={'Número'}
            control={control}
            name={EntityAddressFields.StreetNumber}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledTextFieldFilled
            label={'Piso/Depto.'}
            control={control}
            name={EntityAddressFields.Floor}
            fullWidth
          />
        </Grid>

        {/*<Grid item xs={2}>*/}
        {/*    <ControlledTextField label={'Departamento'}*/}
        {/*                         control={control}*/}
        {/*                         name={EntityAddressFields.Apartment}*/}
        {/*                         fullWidth*/}
        {/*    />*/}
        {/*</Grid>*/}

        <Grid item xs={6}>
          <AsyncSelect
            label={'País'}
            loadOptions={HttpAddressData.getCountries}
            control={control}
            name={EntityAddressFields.CountryCode}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledTextFieldFilled
            label={'Código Postal'}
            control={control}
            type='number'
            onBlur={onBlurCP}
            name={EntityAddressFields.PostalCode}
            fullWidth
            autoComplete="postal-code"
            onChangeCapture={(_) => {
              // @ts-ignore
              setValue(EntityAddressFields.PostalCode, _.target.value);
              onBlurCP();
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlledTextFieldFilled
            select
            label="Provincia"
            control={control}
            options={provinces || []}
            disabled={!provinces || provinces.length <= 1}
            name={EntityAddressFields.ProvinceCode}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <ControlledTextFieldFilled
            select
            label="Partido"
            control={control}
            options={filteredPartidos || []}
            disabled={!filteredPartidos || filteredPartidos.length <= 1}
            name={EntityAddressFields.DepartmentCode}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <ControlledTextFieldFilled
            select
            label="Localidad"
            control={control}
            options={filteredlocalities || []}
            disabled={!filteredlocalities || filteredlocalities.length <= 1}
            name={EntityAddressFields.MunicipalityCode}
            fullWidth
          />
        </Grid>
        <Grid item container>
          <Grid item xs>
            <Grid container direction="row-reverse">
              <SendButton onClick={handleSubmit(onHandleSubmit)}>
                Guardar
              </SendButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DrawerBase>
  );
}

export default AddressDrawer;
