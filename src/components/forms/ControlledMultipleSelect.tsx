import React from 'react';
import clsx from 'clsx'; // para el manejo de className medio dinamico
import {
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlProps,
  FormLabel,
  InputAdornment,
  InputLabel,
  InputLabelProps,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';

import {
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
} from '../../types/baseEntities';
import { stringFormatter } from '../../util/formatters/stringFormatter';

import ControlledMultipleSelectStyles from './ControlledMultipleSelect.styles';
import ControlledTextFieldStyles from './ControlledTextField.styles';
import HelperInputText from '../text/HelperInputText';

const maxSizeChip: number = 20;
const avgChipPerRow: number = 2;
const sizeChipNotText: number = 5;

interface ControlledMultipleSelectProps extends FormControlProps {
  id: string;
  field: string;
  label: string;
  lstData: EntityWithIdAndDescription[] | undefined;
  valuesSelected: number[] | undefined;
  onHandleChange: (field: string, value: any) => void;
  onClose?: (event: React.SyntheticEvent) => void;
  onHandleDelete?: (field: string, value: any) => void;
  filled?: boolean;
  labelProps?: InputLabelProps;
  helperText?: string;
  hideRender?: boolean;
}

export function ControlledMultipleSelect(props: ControlledMultipleSelectProps) {
  const classes = ControlledMultipleSelectStyles();
  const textFieldClasses = ControlledTextFieldStyles();
  const sizeDescriptions = props.lstData
    ? props.lstData
        .filter((x) => props.valuesSelected?.includes(x.id))
        .map((x) => {
          if (x.descripcion.length > maxSizeChip) return maxSizeChip;
          return x.descripcion.length;
        })
        .reduce((x, y) => x + y, 0)
    : 0;

  const moreThanOneRow: boolean =
    sizeDescriptions > avgChipPerRow * (maxSizeChip - sizeChipNotText);
  const stylesSelect = {
    maxHeight: moreThanOneRow ? '' : '50px',
  };
  const isAllSelected =
    props.lstData &&
    props.lstData.length > 0 &&
    props.valuesSelected?.length === props.lstData?.length;

  function handleChange(
    field: string,
    value: string | EntityWithIdAndDescription[],
  ): void {
    let lstValue = value as [];

    let lastValue: number = (lstValue.pop() || -1) as number;
    let finalValue: number[] = lstValue.map(
      (x) => (x as EntityWithIdAndDescription).id,
    );

    if (lstValue.length === 0 || !finalValue.includes(lastValue))
      finalValue.push(lastValue);
    else finalValue = finalValue.filter((x) => x !== lastValue);

    if (lastValue.toString() === 'all' && props.lstData) {
      finalValue =
        props.valuesSelected?.length === props.lstData.length
          ? []
          : props.lstData.map((x) => (x as EntityWithIdAndDescription).id);
    }

    props.onHandleChange(field, finalValue);
  }

  const handleDelete = (entityToDelete: EntityWithIdAndDescription) => () => {
    if (!props.valuesSelected) return;

    let finalValue: number[] = props.valuesSelected.filter(
      (x) => x !== entityToDelete.id,
    );

    if (props.onHandleDelete) props.onHandleDelete(props.field, finalValue);
    else props.onHandleChange(props.field, finalValue);
  };

  return (
    <div className={classes.contentMultipleSelect}>
      <FormControl
        {...props}
        variant="outlined"
        size="small"
        focused={!!props.valuesSelected && props.valuesSelected.length > 0}
        sx={{
          '& > div > div': {
            cursor: props.disabled
              ? 'not-allowed !important'
              : 'default !important',
          },
        }}
      >
        {props.filled ? (
          <FormLabel className={textFieldClasses.labelFilled}>
            <Stack direction="row" justifyContent="flex-start" spacing={1}>
              <>{props.label}</>
            </Stack>
          </FormLabel>
        ) : (
          <InputLabel id={props.id} {...props.labelProps}>
            {props.label}
          </InputLabel>
        )}

        <Select
          name={props.field}
          label={props?.id}
          id={`${props.id}-multiple-select`}
          multiple
          style={stylesSelect}
          value={
            props.lstData?.filter((x) =>
              props.valuesSelected?.includes(x.id),
            ) || []
          }
          onClose={props.onClose}
          error={!!props.error}
          onChange={(e) =>
            handleChange(e.target.name as string, e.target.value)
          }
          endAdornment={
            <InputAdornment position="end">
              {!props.lstData && <CircularProgress size={25} />}
            </InputAdornment>
          }
          renderValue={
            !props.hideRender
              ? (selected) => (
                  <div className={classes.chips}>
                    {(selected as EntityWithIdAndDescription[]).map(
                      (option) => (
                        <Chip
                          key={`chip_${props.id}_${option.id}`}
                          label={stringFormatter.cutIfHaveMoreThan(
                            option[
                              EntityWithIdAndDescriptionFields.Description
                            ],
                            maxSizeChip,
                          )}
                          onDelete={
                            props.disabled ? undefined : handleDelete(option)
                          }
                          className={classes.chip}
                          size="small"
                          color="primary"
                          variant="outlined"
                          onMouseDown={(event) => {
                            event.stopPropagation();
                          }}
                        />
                      ),
                    )}
                  </div>
                )
              : (s) => <></>
          }
        >
          {props.lstData && (
            <MenuItem value="all">
              <ListItemIcon>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={
                    props.valuesSelected && props.lstData
                      ? props.valuesSelected.length > 0 &&
                        props.valuesSelected.length < props.lstData.length
                      : undefined
                  }
                />
              </ListItemIcon>
              <ListItemText
                sx={{ fontWeight: 500 }}
                primary="Seleccionar Todo"
              />
            </MenuItem>
          )}
          {props.lstData &&
            props.lstData.map((option) => (
              <MenuItem
                key={option.id}
                value={option.id}
                className={clsx('', {
                  [classes.menuItemSelected]: props.valuesSelected?.includes(
                    option.id,
                  ),
                })}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={
                      props.valuesSelected &&
                      props.valuesSelected.indexOf(option.id) > -1
                    }
                  />
                </ListItemIcon>
                <text>
                  {option[EntityWithIdAndDescriptionFields.Description]}
                </text>
              </MenuItem>
            ))}
        </Select>

        {props.error && props.helperText && (
          <HelperInputText text={props.helperText} error />
        )}
      </FormControl>
    </div>
  );
}
