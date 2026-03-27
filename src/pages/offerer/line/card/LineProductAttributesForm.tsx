import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Grid, Typography } from '@mui/material';
import {
  AsyncSelect,
  ControlledRadioYesNo,
  ControlledTextFieldFilled,
} from 'components/forms';
import { ControlledDatePicker } from 'components/forms/ControlledDatePicker';

import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import { ProductLineFields } from 'types/lines/productLineData';
import {
  ProductLineFieldDataTypes,
  ProductLineFieldFormats
} from 'types/lines/productLineEnums';
import {
  callbackFunctionByFields,
  LineProductField,
  LineProductFieldFields,
} from 'types/lines/productLineAttibutesData';
import { EntityWithIdFields } from 'types/baseEntities';
import { ControlledMultipleSelectAsync } from 'components/forms/ControlledMultipleSelectAsync';
import ControlledTextFieldStyles from 'components/forms/ControlledTextField.styles';
import { useProductLineDetail } from '../../../lines/ProductLineDetailContext';
import {
  ProductRateType,
  ProductRateTypeFields,
} from '../../../../types/product/productData';

interface LineProductAttributesBaseFormProps {
  children?: React.ReactElement[];
}

function LineProductAttributesBaseForm(
  props: LineProductAttributesBaseFormProps,
) {
  return (
    <Grid container item xs={12} spacing={2}>
      {props.children}
    </Grid>
  );
}

interface LineProductAttributesComponentsProp {
  listProductFields: LineProductField[];
}

export function LineProductAttributesComponents(
  props: LineProductAttributesComponentsProp,
) {
  const { allowEdit } = useProductLineDetail();
  const { control } = useFormContext();

  const renderAttribute = (attrType: LineProductField, index: number) => {
    const showBit: boolean = attrType[LineProductFieldFields.ShowBit];
    const showObservations: boolean =
      attrType[LineProductFieldFields.ShowObservations];
    const fieldLabel = attrType[LineProductFieldFields.LineProductFieldLabel];
    const fieldLabelForm = showBit ? '' : fieldLabel;
    const fieldName =
      attrType[LineProductFieldFields.LineProductFieldDescription];
    const isDate: boolean =
      attrType[LineProductFieldFields.LineProductFieldDataTypeCode] ===
      ProductLineFieldDataTypes.Date;
    const isCurrency: boolean =
      attrType[LineProductFieldFields.LineProductFieldDataTypeCode] ===
      ProductLineFieldDataTypes.Currency;
    const isPercentage: boolean =
      attrType[LineProductFieldFields.LineProductFieldDataTypeCode] ===
      ProductLineFieldDataTypes.Percentage;
    const isNumeric: boolean =
      attrType[LineProductFieldFields.LineProductFieldDataTypeCode] ===
      ProductLineFieldDataTypes.Number;    
    let component: ReactElement | ReactElement[] = <></>;

    switch (attrType[LineProductFieldFields.LineProductFieldFormatCode]) {
      case ProductLineFieldFormats.Select:
        const callbackFunction =
          callbackFunctionByFields[attrType[EntityWithIdFields.Id]];

        component = (
          <AsyncSelect
            label={fieldLabelForm}
            control={control}
            name={fieldName}
            loadOptions={callbackFunction}
            disabled={!allowEdit}
          />
        );
        break;

      case ProductLineFieldFormats.SelectMultiple:
        const callbackFunctionSelect =
          callbackFunctionByFields[attrType[EntityWithIdFields.Id]];

        component = (
          <ControlledMultipleSelectAsync
            id={`lineProductAttributes_${index}`}
            label={fieldLabelForm}
            loadOptions={callbackFunctionSelect}
            control={control}
            name={fieldName}
            sx={{ width: '100%', backgroundColor: 'white' }}
            disabled={!allowEdit}
            fullWidth
            filled
          />
        );
        break;

      case ProductLineFieldFormats.GracePeriod:
        component = (
          <Grid item xs={12} md={6} key={`lineProductAttributes_${index}`} alignSelf='start'>
            <LineProductAttributesPeriodGrace />
          </Grid>
        );
        return component;

      case ProductLineFieldFormats.Range:
        component = (
          <LineProductAttributesRange
            label={fieldLabelForm}
            name={fieldName}
            date={isDate}
            currency={isCurrency}
            percentage={isPercentage}
          />
        );
        break;

      case ProductLineFieldFormats.RateMultiple:
        component = (
          <LineProductAttributesRateMultiple
            label={fieldLabelForm}
            name={fieldName}
            index={index}
          />
        );
        break;

      case ProductLineFieldFormats.Input:
      default:
        if (isDate)
          component = (
            <ControlledDatePicker
              label={fieldLabelForm}
              name={fieldName}
              control={control}
              disabled={!allowEdit}
              filled
            />
          );
        else
          component = (
            <ControlledTextFieldFilled
              label={fieldLabelForm}
              name={fieldName}
              control={control}
              disabled={!allowEdit}
              currency={isCurrency}
              percentage={isPercentage}
              type={isNumeric ? "number" : undefined}
            />
          );
    }
    
    let nameObservations;
    
    if (showObservations) {
      nameObservations = `desc${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
      component = [
        component,
        <ControlledTextFieldFilled
          label={''}
          name={nameObservations}
          control={control}
          disabled={!allowEdit}
          helperText={'Observaciones'}
        />,
      ];
    }

    if (showBit) {
      const nameBit = `tiene${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
      return (
        <Grid item xs={12} md={6} key={`lineProductAttributes_${index}`} alignSelf='start'>
          <LineProductAttributeWithBit
            label={attrType[LineProductFieldFields.LineProductFieldLabel]}
            name={fieldName}
            children={component}
            number={isCurrency || isPercentage}
            nameBit={nameBit}
            nameObservations={nameObservations}
          />
        </Grid>
      );
    }

    return (
      <Grid item xs={12} md={6} key={`lineProductAttributes_${index}`} alignSelf='start'>
        {component}
      </Grid>
    );
  };

  return (
    <LineProductAttributesBaseForm>
      {props.listProductFields.map(renderAttribute)}
    </LineProductAttributesBaseForm>
  );
}

interface LineProductAttributeWithBitProps {
  label: string;
  name: string;
  nameBit: string;
  children: ReactElement | ReactElement[];
  number?: boolean;
  nameObservations?: string;
}

function LineProductAttributeWithBit(props: LineProductAttributeWithBitProps) {
  const classes = ControlledTextFieldStyles();
  const { allowEdit } = useProductLineDetail();
  const { control, watch, setValue } = useFormContext();
  const hasAttibute = watch(props.nameBit);
  const childrenLength = Array.isArray(props.children)
    ? props.children.length
    : 1;

  useEffect(() => {
    if (!hasAttibute) {
      setValue(props.name, props.number ? parseInt('') : '');
      
      if (props.nameObservations) 
        setValue(props.nameObservations, '');
    }
  }, [hasAttibute]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography className={classes.labelFilled}>{props.label}</Typography>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={4} alignSelf='start' pt={'22px !important'}>
          <ControlledRadioYesNo
            name={props.nameBit}
            control={control}
            setValue={setValue}
            disabled={!allowEdit}
            row
          />
        </Grid>
        {Array.isArray(props.children) ? (
          props.children.map((x, idx) => (
            <Grid item key={`lineProductAttributeWithBitList_${props.name}_${idx}`} xs={8 / childrenLength} alignSelf='start'>
              {React.cloneElement(x, { disabled: !allowEdit || !hasAttibute })}
            </Grid>
          ))
        ) : (
          <Grid item xs={8} alignSelf='start'>
            {React.cloneElement(props.children, {
              disabled: !allowEdit || !hasAttibute,
            })}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

function LineProductAttributesPeriodGrace() {
  const classes = ControlledTextFieldStyles();
  const { allowEdit } = useProductLineDetail();
  const { control, setValue, watch } = useFormContext();
  const watchHasPeriodGrace = watch(ProductLineFields.HasPeriodGrace);

  useEffect(() => {
    if (!watchHasPeriodGrace) setValue(ProductLineFields.MonthGrace, 0);
  }, [watchHasPeriodGrace]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography className={classes.labelFilled}>
          Período de Gracia
        </Typography>
      </Grid>
      <Grid item xs={4} alignSelf='start' pt={1}>
        <ControlledRadioYesNo
          name={ProductLineFields.HasPeriodGrace}
          control={control}
          setValue={setValue}
          disabled={!allowEdit}
          row
        />
      </Grid>

      <Grid item xs={8} alignSelf='start'>
        <ControlledTextFieldFilled
          name={ProductLineFields.MonthGrace}
          control={control}
          disabled={!allowEdit || !watchHasPeriodGrace}
          helperText={'Meses de Gracia'}
        />
      </Grid>
    </Grid>
  );
}

interface LineProductAttributesRateMultipleProps {
  label: string;
  name: string;
  index: number;
}

function LineProductAttributesRateMultiple({
  label,
  name,
  index,
}: LineProductAttributesRateMultipleProps) {
  const classes = ControlledTextFieldStyles();
  const { allowEdit } = useProductLineDetail();
  const { control, setValue, watch } = useFormContext();
  const [ratesTypes, setRatesTypes] = useState<ProductRateType[]>();

  const watchRatesTypes = watch(name);
  const isVariableRate =
    !!ratesTypes &&
    ratesTypes.some((x) => {
      return !watchRatesTypes || !Array.isArray(watchRatesTypes)
        ? false
        : watchRatesTypes.includes(x[EntityWithIdFields.Id]) &&
            x[ProductRateTypeFields.IsVariableRate];
    });

  const loadRatesTypes = useCallback(async (): Promise<ProductRateType[]> => {
    if (!!ratesTypes) return Promise.resolve(ratesTypes);

    const rates = await HttpCacheProduct.getRatesTypes();

    setRatesTypes(rates);
    return Promise.resolve(rates);
  }, [ratesTypes]);

  useEffect(() => {
    if (!isVariableRate && !!watch && !watch(ProductLineFields.RateInformation))
      setValue(ProductLineFields.RateInformation, '');
  }, [isVariableRate, watch]);

  return (
    <Grid container alignItems={'center'}>
      <Grid item xs={12}>
        <Typography className={classes.labelFilled}>{label}</Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} alignSelf='start'>
          <ControlledMultipleSelectAsync
            id={`lineProductAttributesRateMultiple_${index}`}
            label={''}
            loadOptions={loadRatesTypes}
            control={control}
            name={name}
            sx={{ width: '100%', backgroundColor: 'white' }}
            disabled={!allowEdit}
            fullWidth
            filled
          />
        </Grid>

        <Grid item xs={12} md={6} alignSelf='start'>
          <ControlledTextFieldFilled
            name={ProductLineFields.RateInformation}
            control={control}
            disabled={!allowEdit}
            helperText={'Observaciones sobre la/s tasa/s'}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

interface LineProductAttributesRangeProps {
  label: string;
  name: string;
  date?: boolean;
  currency?: boolean;
  percentage?: boolean;
}

function LineProductAttributesRange({
  label,
  name,
  date,
  currency,
  percentage,
}: LineProductAttributesRangeProps) {
  const classes = ControlledTextFieldStyles();
  const { control } = useFormContext();
  const { allowEdit } = useProductLineDetail();
  const minName = `${name}${date ? 'Desde' : 'Min'}`;
  const maxName = `${name}${date ? 'Hasta' : 'Max'}`;

  const minComponent = date ? (
    <ControlledDatePicker
      name={minName}
      control={control}
      disabled={!allowEdit}
      helperText={'Desde'}
      filled
    />
  ) : (
    <ControlledTextFieldFilled
      name={minName}
      control={control}
      disabled={!allowEdit}
      currency={currency}
      percentage={percentage}
      helperText={'Mínimo'}
    />
  );

  const maxComponent = date ? (
    <ControlledDatePicker
      name={maxName}
      control={control}
      disabled={!allowEdit}
      helperText={'Hasta'}
      filled
    />
  ) : (
    <ControlledTextFieldFilled
      name={maxName}
      control={control}
      disabled={!allowEdit}
      currency={currency}
      percentage={percentage}
      helperText={'Máximo'}
    />
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography className={classes.labelFilled}>{label}</Typography>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={6} alignSelf='start'>
          {minComponent}
        </Grid>
        <Grid item xs={6} alignSelf='start'>
          {maxComponent}
        </Grid>
      </Grid>
    </Grid>
  );
}
