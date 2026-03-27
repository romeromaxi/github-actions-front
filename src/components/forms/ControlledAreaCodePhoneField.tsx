import * as React from 'react';
import { Control, useWatch } from 'react-hook-form';

import { Box, Grid, Stack } from '@mui/material';
import {
  ControlledTextFieldFilled
} from './ControlledTextField';
import { HttpCacheGeneral } from '../../http';
import { ControlledAutocomplete } from './ControlledAutocomplete';
import { Country, CountryFields } from '../../types/general/generalAddressData';
import { EntityWithIdAndDescriptionFields } from '../../types/baseEntities';
import ControlledTextFieldStyles from './ControlledTextField.styles';
import { ControlledCheckBox } from "./ControlledCheckbox";
import {
  digitsOnly,
  validateInternationalPhone,
  formatNationalPhoneAsYouType,
  formatNationalPhoneForInput,
} from '../../util/validation/phoneValidation';
import {TypographyBase} from "../misc/TypographyBase";

export interface ControlledAreaCodePhoneFieldProps {
  control: Control<any>;
  nameAreaCode: any;
  namePhoneNumber: any;
  labelPhoneNumber?: string;
  nameCountry?: string;
  showCountries?: boolean;
  showWhatsapp?: boolean;
  nameWhatsapp?: string;
  whatsappControl?: Control<any>;
  defaultCountryCallingCode?: string;
}

const DEFAULT_CALLING_CODE = '54';

export const ControlledAreaCodePhoneFieldFilled = (
  props: ControlledAreaCodePhoneFieldProps,
) => {
  const classes = ControlledTextFieldStyles();

  const onGetOption = (opt: Country) => {
    return `${opt[CountryFields.ISOCode]}(+${opt[CountryFields.PhoneCode] || ''})`;
  };

  const watchedCountryCallingCode = useWatch({ 
    control: props.control, 
    name: props.nameCountry as any,
    defaultValue: undefined 
  });

  const effectiveCallingCode = props.showCountries && watchedCountryCallingCode
    ? digitsOnly(String(watchedCountryCallingCode))
    : (props.defaultCountryCallingCode || DEFAULT_CALLING_CODE);

  const showCountryAdornment = Boolean(effectiveCallingCode);
  const adornmentText = `(+${effectiveCallingCode})`;

  return props.showCountries ? (
    <Grid container spacing={3} alignItems={'flex-start'}>
      {props.showCountries && props.nameCountry && (
        <Grid item md={4.5} mt={1} sx={{width: '210px'}}>
          <ControlledAutocomplete
            control={props.control}
            label={'Cód. País'}
            loadOptions={HttpCacheGeneral.getCountries}
            name={props.nameCountry}
            getOption={onGetOption}
            renderOption={(propsOpt, option) => (
              <Stack
                sx={{ cursor: 'pointer' }}
                {...propsOpt}
                direction={'row'}
                alignItems={'center'}
                spacing={2}
                justifyContent={'space-between'}
                className={classes.menuItemSelect}
              >
                {option[EntityWithIdAndDescriptionFields.Description]}
                <Box component="li" sx={{ '& > img': { flexShrink: 0 } }}>
                  <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${option[CountryFields.ISOCode].toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${option[CountryFields.ISOCode].toLowerCase()}.png`}
                    alt=""
                  />
                </Box>
              </Stack>
            )}
          />
        </Grid>
      )}
      <Grid item md={props.showCountries ? 3 : 4} mt={1}>
        <ControlledTextFieldFilled
          control={props.control}
          label={'Cód. Área'}
          name={props.nameAreaCode}
          helperText="Sin cero inicial. Ej: 11"
          type="tel"
          onChange={(e) => {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
          }}
          inputProps={{
            maxLength: 10,
            inputMode: 'numeric'
          }}
        />
      </Grid>
      <Grid item md={props.showCountries ? 4.5 : 8} mt={1}>
        <ControlledTextFieldFilled
          {...props}
          type="tel"
          name={props.namePhoneNumber}
          inputProps={{
            inputMode: 'tel',
            pattern: '[0-9 ]*',
          }}
          onChange={(e) => {
            const raw = String(e.target.value ?? '');
            const area = String((props as any)?.control?._formValues?.[props.nameAreaCode] ?? '');
            const nationalRaw = `${digitsOnly(area)} ${raw}`.trim();
            const formatted = formatNationalPhoneAsYouType(effectiveCallingCode, nationalRaw);
            e.target.value = formatted;
          }}
          onBlur={(e) => {
            const raw = String(e.target.value ?? '');
            const area = String((props as any)?.control?._formValues?.[props.nameAreaCode] ?? '');
            const nationalRaw = `${digitsOnly(area)} ${raw}`.trim();
            const validation = validateInternationalPhone(effectiveCallingCode, nationalRaw);
            const normalized = validation.ok
              ? formatNationalPhoneForInput(effectiveCallingCode, nationalRaw)
              : raw;
            if (normalized !== raw) {
              e.target.value = normalized;
            }
          }}
          label={props.labelPhoneNumber || 'Número'}
          helperText="Sin 15"
          InputProps={{
            startAdornment: showCountryAdornment ? (
                <TypographyBase variant={"body2"} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {adornmentText}
                </TypographyBase>
            ) : undefined,
            endAdornment: (
              props.showWhatsapp && props.nameWhatsapp && props.whatsappControl ? (
                <ControlledCheckBox
                  label={'Whatsapp'}
                  name={props.nameWhatsapp}
                  control={props.whatsappControl}
                />
              ) : undefined
            ),
          }}
          fullWidth
        />
      </Grid>
    </Grid>
  ) : (
    <Grid container spacing={3} alignItems={'center'}>
      <Grid item md={4}>
        <ControlledTextFieldFilled
          control={props.control}
          label={'Cód. Área'}
          name={props.nameAreaCode}
          helperText="Sin cero inicial. Ej: 11"
          type="tel"
          onChange={(e) => {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
          }}
          inputProps={{
            maxLength: 10,
            inputMode: 'numeric'
          }}
        />
      </Grid>
      <Grid item md={8}>
        <ControlledTextFieldFilled
          {...props}
          type="tel"
          name={props.namePhoneNumber}
          inputProps={{
            inputMode: 'tel',
            pattern: '[0-9 ]*',
          }}
          onChange={(e) => {
            const raw = String(e.target.value ?? '');
            const area = String((props as any)?.control?._formValues?.[props.nameAreaCode] ?? '');
            const nationalRaw = `${digitsOnly(area)} ${raw}`.trim();
            const formatted = formatNationalPhoneAsYouType(effectiveCallingCode, nationalRaw);
            e.target.value = formatted;
          }}
          onBlur={(e) => {
            const raw = String(e.target.value ?? '');
            const area = String((props as any)?.control?._formValues?.[props.nameAreaCode] ?? '');
            const nationalRaw = `${digitsOnly(area)} ${raw}`.trim();
            const validation = validateInternationalPhone(effectiveCallingCode, nationalRaw);
            const normalized = validation.ok
              ? formatNationalPhoneForInput(effectiveCallingCode, nationalRaw)
              : raw;
            if (normalized !== raw) {
              e.target.value = normalized;
            }
          }}
          label={props.labelPhoneNumber || 'Número'}
          helperText="Sin 15"
          InputProps={{
            startAdornment: showCountryAdornment ? (
                <TypographyBase variant={"body2"} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {adornmentText}
                </TypographyBase>
            ) : undefined,
            endAdornment: (
              props.showWhatsapp && props.nameWhatsapp && props.whatsappControl ? (
                <ControlledCheckBox
                  label={'Whatsapp'}
                  name={props.nameWhatsapp}
                  control={props.whatsappControl}
                />
              ) : undefined
            ),
          }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};
