import React from 'react';
import { Control, Controller } from 'react-hook-form';

import {
  Box,
  FormHelperText,
  Grid,
  RadioGroup,
  RadioGroupProps,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import ControlledOptionBoxStyles from './ControlledOptionBox.styles';
import clsx from 'clsx';
import {TypographyBase} from "../misc/TypographyBase";

const radioLoagingQuantity: number = 4;

export interface BoxOption {
  value: any;
  labelKey: string;
  descriptionKey?: string;
  icon?: React.ReactNode;
}

interface ControlledOptionBoxProps extends RadioGroupProps {
  name: string;
  control: Control<any>;
  options?: BoxOption[];
  disabled?: boolean;
}

export function ControlledOptionBox({
  name,
  control,
  options,
  disabled,
  ...rest
}: ControlledOptionBoxProps) {
  return (
    <Stack direction="row" width="100%">
      {options ? (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <RadioGroup {...field} {...rest} sx={{ width: '100%' }}>
              <Stack
                spacing={2}
                width="100%"
                justifyContent="space-between"
                direction={{ xs: 'column', lg: rest.row ? 'row' : 'column' }}
                style={{ cursor: disabled ? 'not-allowed' : '' }}
              >
                {options?.map((radio) => (
                  <OptionBox
                    {...radio}
                    onClick={field.onChange}
                    active={field.value === radio.value}
                    width={100 / options?.length}
                    disabled={disabled}
                  />
                ))}
              </Stack>
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
    </Stack>
  );
}

interface OptionBoxProps extends BoxOption {
  active: boolean;
  onClick: (value: any) => void;
  width?: number;
  disabled?: boolean;
}

function OptionBox(props: OptionBoxProps) {
  const classes = ControlledOptionBoxStyles();
  const onClick = () => props.onClick(props.value);

  return (
    <Box
      component="span"
      onClick={props.disabled ? undefined : onClick}
      className={clsx(classes.root, {
        [classes.active]: props.active,
        [classes.boxDisabled]: props.disabled,
      })}
      width={{ xs: '100%', lg: `${props.width}%` }}
    >
      <Stack direction="row" alignItems="center" spacing={2} height="100%">
        {props.icon && props.icon}

        <Stack direction="column">
          <TypographyBase fontWeight={500} fontSize={'1.1rem'}>
            {props.labelKey}
          </TypographyBase>

          {props.descriptionKey && (
            <TypographyBase variant={'caption'} color={'text.disabled'}>
              {props.descriptionKey}
            </TypographyBase>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
