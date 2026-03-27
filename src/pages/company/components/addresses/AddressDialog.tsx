import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { CompanyAddressInsertDTO } from 'types/company/companyReferentialData';
import {
  EntityAddress,
  EntityAddressFields,
} from 'types/general/generalReferentialData';
import * as yup from 'yup';
import {
  RequiredSchema,
  RequiredSelectSchema,
  RequiredStringSchema,
} from 'util/validation/validationSchemas';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AddressDataFields,
  Department,
  DepartmentFields,
  Municipality,
  MunicipalityFields,
  Province,
} from 'types/general/generalAddressData';
import { AddressTypes } from 'types/general/generalEnums';
import {
  BaseRequestFields,
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from 'types/baseEntities';
import { HttpAddressData } from 'http/general';
import { removeDuplicatesById } from 'util/helpers';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import { SendButton } from 'components/buttons/Buttons';
import { AsyncSelect, ControlledTextFieldFilled } from 'components/forms';

interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (address: CompanyAddressInsertDTO) => void;
  addressBase?: EntityAddress;
  fixType?: boolean;
  hidenTypes?: Record<AddressTypes, boolean>;
}

function AddressDialog(props: AddressDialogProps) {
  const addressDialogSchema = yup.object().shape({
    [EntityAddressFields.AddressTypeCode]: RequiredSelectSchema,
    [EntityAddressFields.Street]: RequiredStringSchema,
    [EntityAddressFields.PostalCode]: RequiredSchema,
  });

  const { control, setValue, watch, handleSubmit, reset } =
    useForm<CompanyAddressInsertDTO>({
      defaultValues: {
        ...props.addressBase,
        [EntityAddressFields.CountryCode]: props.addressBase
          ? props.addressBase[EntityAddressFields.CountryCode]
          : 1,
      },
      resolver: yupResolver(addressDialogSchema),
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
      return Promise.resolve(
        types.filter((t) => {
          let showType: boolean =
            !props.hidenTypes || !props.hidenTypes[t.id as AddressTypes];
          return (
            props.addressBase?.[EntityAddressFields.AddressTypeCode] === t.id ||
            (t.id !== AddressTypes.Fiscal && showType)
          );
        }),
      );
    });
  }, [props.addressBase, props.hidenTypes]);

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
      let baseDepartmentCode =
        props.addressBase?.[EntityAddressFields.DepartmentCode] ?? 0;
      let indexAddressFiltered = filteredPartidos.findIndex(
        (x) => x[EntityWithIdFields.Id] === baseDepartmentCode,
      );
      let newDepartmentCode =
        indexAddressFiltered >= 0 ? baseDepartmentCode : filteredPartidos[0].id;

      setValue(EntityAddressFields.DepartmentCode, newDepartmentCode);
    }
  }, [filteredPartidos]);

  useEffect(() => {
    if (filteredlocalities && filteredlocalities.length >= 1) {
      let baseMunicipalityCode =
        props.addressBase?.[EntityAddressFields.MunicipalityCode] ?? 0;
      let indexAddressFiltered = filteredlocalities.findIndex(
        (x) => x[EntityWithIdFields.Id] === baseMunicipalityCode,
      );
      let newMunicipalityCode =
        indexAddressFiltered >= 0
          ? baseMunicipalityCode
          : filteredlocalities[0].id;

      setValue(EntityAddressFields.MunicipalityCode, newMunicipalityCode);
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
  }, [watchPais, watchCodigoPostal]);

  const onBlurCP = useCallback(() => {
    if (watch(EntityAddressFields.CountryCode)) {
      loadAddressData(
        watch(EntityAddressFields.CountryCode) || 1,
        watch(EntityAddressFields.PostalCode) || '',
      );
    }
  }, [watchPais, watchCodigoPostal]);

  useEffect(() => {
    if (watchProvincia && provinces) {
      let provincesAddresses = provinces.filter(
        (x) => x[EntityWithIdAndDescriptionFields.Id] === watchProvincia,
      );
      if (provincesAddresses && provincesAddresses.length)
        setValue(
          EntityAddressFields.ProvinceDesc,
          provincesAddresses[0][EntityWithIdAndDescriptionFields.Description],
        );
    }
  }, [watchProvincia, provinces]);

  useEffect(() => {
    if (watchLocality && filteredlocalities) {
      let localitiesAddresses = filteredlocalities.filter(
        (x) => x[EntityWithIdAndDescriptionFields.Id] === watchLocality,
      );
      if (localitiesAddresses && localitiesAddresses.length)
        setValue(
          EntityAddressFields.MunicipalityDesc,
          localitiesAddresses[0][EntityWithIdAndDescriptionFields.Description],
        );
    }
  }, [watchLocality, filteredlocalities]);

  const onHandleClose = () => {
    props.onClose();
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
    props.onSubmit(data);
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

  const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Dialog open={props.open} onClose={onHandleClose} maxWidth={'md'} fullWidth>
      <BaseDialogTitle
        title={
          props.addressBase
            ? `Domicilio ${props.addressBase[EntityAddressFields.AddressTypeDesc]}`
            : 'Nuevo Domicilio'
        }
        onClose={onHandleClose}
      />

      <DialogContent>
        <Grid container spacing={2}>
          {!props.fixType && (
            <Grid item xs={12} sm={4}>
              <AsyncSelect
                label={'Tipo'}
                loadOptions={loadAddressTypes}
                control={control}
                name={EntityAddressFields.AddressTypeCode}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12} sm={!props.fixType ? 8 : 6}>
            <ControlledTextFieldFilled
              label={'Calle'}
              control={control}
              name={EntityAddressFields.Street}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <ControlledTextFieldFilled
              label={'Número'}
              control={control}
              name={EntityAddressFields.StreetNumber}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <ControlledTextFieldFilled
              label={'Piso/Depto.'}
              control={control}
              name={EntityAddressFields.Floor}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AsyncSelect
              label={'País'}
              loadOptions={HttpAddressData.getCountries}
              control={control}
              name={EntityAddressFields.CountryCode}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ControlledTextFieldFilled
              label={'Código Postal'}
              control={control}
              onBlur={onBlurCP}
              type="number"
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

          <Grid item xs={0} md={!props.fixType ? 0 : 4} />

          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
        </Grid>
      </DialogContent>

      <DialogActions sx={{ width: '100%', flexWrap: 'wrap', paddingTop: isMobileScreenSize ? 2 : 0 }}>
        <Button variant="outlined" color="secondary" onClick={onHandleClose} size={isMobileScreenSize ? 'small' : undefined} id={"company-address-new-cancel-btn"}>
          Descartar
        </Button>

        <Button variant="contained" color="primary" 
                onClick={handleSubmit(onHandleSubmit)} 
                size={isMobileScreenSize ? 'small' : undefined} 
                id={"company-address-new-accept-btn"}>
            Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddressDialog;
