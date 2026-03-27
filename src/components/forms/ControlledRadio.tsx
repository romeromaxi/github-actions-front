import React from 'react';
import { makeStyles } from '@mui/styles';
import { createStyles, Theme } from '@mui/material/styles';
import { Control, Controller } from 'react-hook-form';

import {
    FormControlLabel,
    FormHelperText,
    Grid,
    Radio,
    RadioGroup,
    Skeleton,
    Stack, TextField,
    Typography,
} from '@mui/material';
import { UseFormSetValue } from 'react-hook-form/dist/types/form';
import {ResponsiveStyleValue} from "@mui/system";
import LabelFormBase from "./LabelFormBase";

const radioLoagingQuantity: number = 4;

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    labelRadio: {
      /*fontWeight: '600 !important',
        fontSize: '15px !important'*/
      fontSize: '1rem !important',
      marginBottom: '3px',
      fontWeight: '500 !important',
      color: `${theme.palette.grey[500]} !important`,
    },
    descriptionRadio: {
      fontWeight: '600 !important',
      fontSize: '12px !important',
      color: '#797878',
    },
    containerRadioWithDescription: {
      marginBottom: 10,
    },
  }),
);

export interface RadioOption {
  value: any;
  label: string;
  description?: string;
}

interface ControlledRadioProps {
  name: string;
  control: Control<any>;
  radioOptions?: RadioOption[];
  size?: 'small' | 'medium';
  disabled?: boolean;
  row?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
}

export function ControlledRadio({
  name,
  control,
  radioOptions,
    size = 'medium',
  disabled,
  ...rest
}: ControlledRadioProps) {
  return (
    <div>
      {radioOptions ? (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <RadioGroup {...field} disabled={disabled} {...rest}>
              {radioOptions?.map((radio) => (
                <FormControlLabel
                  value={radio.value}
                  control={<Radio size={size} disabled={disabled} />}
                  label={radio.label}
                />
              ))}
              <FormHelperText error={!!error}>
                {error ? error.message : null}
              </FormHelperText>
            </RadioGroup>
          )}
        />
      ) : (
        <Stack direction={rest.row ? 'row' : 'column'} spacing={1}>
          {Array.from(Array(radioLoagingQuantity).keys()).map((item) => (
            <Grid
              container
              item
              xs={12}
              key={`radioLoadingItem_${item}`}
              sx={{ alignItem: 'center' }}
            >
              <Skeleton
                variant="circular"
                width={22}
                height={22}
                sx={{ marginRight: 2 }}
              />
              <Skeleton variant="text" width="50%" height={20} />
            </Grid>
          ))}
        </Stack>
      )}
    </div>
  );
}

interface ControlledRadioYesNoLabelOptions {
  trueLabel: string,
  falseLabel: string,
}

interface ControlledRadioYesNoProps extends RadioGroupProps {
  name: string;
  label?: string;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  disabled?: boolean;
  loadPending?: boolean;
  direction?: ResponsiveStyleValue<'row' | 'column'>,
  labelOptions?: ControlledRadioYesNoLabelOptions;
  disabledAsInput?: boolean
}

export function ControlledRadioYesNo({
  name,
  control,
  label,
  setValue,
  disabled,
  loadPending,
  labelOptions,
  direction = 'row',
  disabledAsInput,  
  ...rest
}: ControlledRadioYesNoProps) {
  const classes = useStyles();
  const yesValue: string = 'true';
  const noValue: string = 'false';

  const valueIsValid = (value: any) => value !== null;

  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, ...field }, fieldState: { error } }) => (
          <Stack spacing={1.25}>
            {
              !!label &&
                <LabelFormBase label={label}
                               loadPending={loadPending && !valueIsValid(field.value)}
                />
            }
              {
                  (disabledAsInput && disabled) ?
                    <TextField variant={'filled'}
                               size={'small'}
                               value={field.value == undefined ? "-" : field.value ? "Si" : "No"}
                               disabled
                    />
                    :  
                    <RadioGroup
                      {...field}
                      {...rest}
                      sx={{marginLeft: 1}}
                      onChange={(event, value) => {
                        setValue(name, value === yesValue, { shouldDirty: true });
                        if (rest.onChange) rest.onChange(event, value);
                      }}
                    >
                      <Stack direction={direction}>
                        <FormControlLabel
                          control={<Radio />}
                          label={labelOptions ? labelOptions.trueLabel : "Si"}
                          value={yesValue}
                          disabled={disabled}
                        />
                        <FormControlLabel
                          control={<Radio size={'medium'} />}
                          label={labelOptions ? labelOptions.falseLabel : "No"}
                          value={noValue}
                          disabled={disabled}
                        />
                      </Stack>
                      <FormHelperText error={!!error}>
                        {error ? error.message : null}
                      </FormHelperText>
                    </RadioGroup>
              }  
          </Stack>
        )}
      />
    </div>
  );
}


/*
        <div>
            {
                radioOptions ?
                    <Controller
                        control={control}
                        name={name}
                        render={({field: {onChange, value}, fieldState: {error}}) => (
                            <RadioGroup
                                value={value}
                                onChange={(event, value) => { 
                                    onChange();
                                    if (rest.onChange) rest.onChange(event, value);
                                }}
                                {...rest}
                            >
                                {radioOptions.map(radio =>
                                    <FormControlLabel
                                        value={radio.value}
                                        control={<Radio sx={{ marginTop: (radio.description) ? -1 : 0 }} />}
                                        label={<ElementRadio option={radio} />}
                                        sx={{
                                            paddingTop: '6px',
                                            borderRadius: '8px',
                                            backgroundColor: radio.value == value ? 'rgb(28, 202, 255, 0.16) !important' : ''
                                        }}
                                    />
                                )}
                                <FormHelperText error={!!error}>
                                    {error ? error.message : null}
                                </FormHelperText>
                            </RadioGroup>
                        )}
                    />
                    :
                    
            }
        </div>*/
interface ElementRadioProps {
  option: RadioOption;
}

function ElementRadio(props: ElementRadioProps) {
  const classes = useStyles();

  return (
    <div>
      {props.option.description ? (
        <div>
          <Typography variant="body2" className={classes.labelRadio}>
            {props.option.label}
          </Typography>
          <Typography
            variant="caption"
            display="block"
            gutterBottom
            className={classes.descriptionRadio}
          >
            {props.option.description}
          </Typography>
        </div>
      ) : (
        <Typography variant="body2" className={classes.labelRadio}>
          {props.option.label}
        </Typography>
      )}
    </div>
  );
}
