import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Grid } from '@mui/material';

import { AsyncSelect, ControlledTextFieldFilled } from 'components/forms';
import {
  ConfirmButton,
  DeleteIconButton,
} from 'components/buttons/Buttons';

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
import { EntityAddressFields } from 'types/general/generalReferentialData';
import { EntityWithIdAndDescriptionFields } from 'types/baseEntities';

interface AddressFormProps {
  name: string;
  onDelete: () => void;
  onSave: () => void;
  fixType?: boolean;
}

function AddressForm(props: AddressFormProps) {
  const { control, setValue, watch, trigger } = useFormContext();

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
    name: `${props.name}.${EntityAddressFields.CountryCode}`,
  });
  const watchCodigoPostal = useWatch({
    control,
    name: `${props.name}.${EntityAddressFields.PostalCode}`,
  });
  const watchProvincia = useWatch({
    control,
    name: `${props.name}.${EntityAddressFields.ProvinceCode}`,
  });
  const watchPartido = useWatch({
    control,
    name: `${props.name}.${EntityAddressFields.DepartmentCode}`,
  });
  const watchLocality = useWatch({
    control,
    name: `${props.name}.${EntityAddressFields.MunicipalityCode}`,
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
      setValue(
        `${props.name}.${EntityAddressFields.ProvinceCode}`,
        provinces[0].id,
      );
    }
  }, [provinces]);

  useEffect(() => {
    if (filteredPartidos && filteredPartidos.length >= 1) {
      setValue(
        `${props.name}.${EntityAddressFields.DepartmentCode}`,
        filteredPartidos[0].id,
      );
    }
  }, [filteredPartidos]);

  useEffect(() => {
    if (filteredlocalities && filteredlocalities.length >= 1) {
      setValue(
        `${props.name}.${EntityAddressFields.MunicipalityCode}`,
        filteredlocalities[0].id,
      );
    }
  }, [filteredlocalities]);

  useEffect(() => {
    (async () => {
      if (watch(`${props.name}.${EntityAddressFields.CountryCode}`) !== null) {
        await loadAddressData(
          watch(`${props.name}.${EntityAddressFields.CountryCode}`) || 1,
          watchCodigoPostal || '',
        );
      }
    })();
  }, [watchPais]);

  const onBlurCP = useCallback(() => {
    if (watch(`${props.name}.${EntityAddressFields.CountryCode}`) !== null) {
      loadAddressData(
        watch(`${props.name}.${EntityAddressFields.CountryCode}`) || 1,
        watch(`${props.name}.${EntityAddressFields.PostalCode}`) || '',
      );
    }
  }, [watchPais, watchCodigoPostal]);

  useEffect(() => {
    if (watchProvincia && provinces)
      setValue(
        `${props.name}.${EntityAddressFields.ProvinceDesc}`,
        provinces.filter(
          (x) => x[EntityWithIdAndDescriptionFields.Id] === watchProvincia,
        )[0][EntityWithIdAndDescriptionFields.Description],
      );
  }, [watchProvincia]);

  useEffect(() => {
    if (watchLocality && localities)
      setValue(
        `${props.name}.${EntityAddressFields.MunicipalityDesc}`,
        localities.filter(
          (x) => x[EntityWithIdAndDescriptionFields.Id] === watchLocality,
        )[0][EntityWithIdAndDescriptionFields.Description],
      );
  }, [watchLocality]);

  return (
    <Grid container spacing={2}>
      {!props.fixType && (
        <Grid item xs={3}>
          <AsyncSelect
            label={'Tipo'}
            loadOptions={loadAddressTypes}
            control={control}
            name={`${props.name}.${EntityAddressFields.AddressTypeCode}`}
            fullWidth
          />
        </Grid>
      )}
      <Grid item xs={props.fixType ? 12 : 9}>
        <ControlledTextFieldFilled
          label={'Calle'}
          control={control}
          name={`${props.name}.${EntityAddressFields.Street}`}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <ControlledTextFieldFilled
          label={'Número'}
          control={control}
          name={`${props.name}.${EntityAddressFields.StreetNumber}`}
          fullWidth
        />
      </Grid>
      <Grid item xs={3}>
        <ControlledTextFieldFilled
          label={'Piso/Depto.'}
          control={control}
          name={`${props.name}.${EntityAddressFields.Floor}`}
          fullWidth
        />
      </Grid>
      {/*<Grid item xs={2}>*/}
      {/*    <ControlledTextField label={'Departamento'}*/}
      {/*                         control={control}*/}
      {/*                         name={`${props.name}.${EntityAddressFields.Apartment}`}*/}
      {/*                         fullWidth*/}
      {/*    />*/}
      {/*</Grid>*/}
      <Grid item xs={5}>
        <AsyncSelect
          label={'País'}
          loadOptions={HttpAddressData.getCountries}
          control={control}
          name={`${props.name}.${EntityAddressFields.CountryCode}`}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <ControlledTextFieldFilled
          label={'Código Postal'}
          control={control}
          onBlur={onBlurCP}
          type={'number'}
          name={`${props.name}.${EntityAddressFields.PostalCode}`}
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <ControlledTextFieldFilled
          select
          label="Provincia"
          control={control}
          options={provinces || []}
          disabled={!provinces || provinces.length <= 1}
          name={`${props.name}.${EntityAddressFields.ProvinceCode}`}
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <ControlledTextFieldFilled
          select
          label="Partido"
          control={control}
          options={filteredPartidos || []}
          disabled={!filteredPartidos || filteredPartidos.length <= 1}
          name={`${props.name}.${EntityAddressFields.DepartmentCode}`}
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <ControlledTextFieldFilled
          select
          label="Localidad"
          control={control}
          options={filteredlocalities || []}
          disabled={!filteredlocalities || filteredlocalities.length <= 1}
          name={`${props.name}.${EntityAddressFields.MunicipalityCode}`}
          fullWidth
        />
      </Grid>
      <Grid item container>
        <DeleteIconButton onClick={props.onDelete} />
        <Grid item xs>
          <Grid container direction="row-reverse">
            <ConfirmButton
              onClick={() => {
                trigger(props.name).then(
                  (isValid) => isValid && props.onSave(),
                );
              }}
            >
              Guardar
            </ConfirmButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AddressForm;
