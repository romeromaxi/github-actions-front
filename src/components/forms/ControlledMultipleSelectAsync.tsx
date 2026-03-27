import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
    Checkbox,
    Chip,
    FormControl,
    FormControlProps,
    InputLabelProps,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select, Stack, Tooltip,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { EntityWithIdAndDescription, EntityWithIdAndDescriptionAndDetail, EntityWithIdAndDescriptionFields } from '../../types/baseEntities';
import { stringFormatter } from '../../util/formatters/stringFormatter';
import { multiSelectProps } from './selectStyles';
import ControlledMultipleSelectStyles from './ControlledMultipleSelect.styles';
import ControlledTextFieldStyles from './ControlledTextField.styles';
import HelperInputText from '../text/HelperInputText';
import LabelFormBase from "./LabelFormBase";
import { X } from 'lucide-react';
import {themeIconsSizeDefinition} from "../../util/themes/definitions";

const maxSizeChip = 20;
const maxSizeChipOffset = 40;
const offsetPadding = 50;

interface ControlledMultipleSelectAsyncProps extends FormControlProps {
  control: Control<any>;
  id: string;
  name: string;
  label?: string;
  loadOptions: () => Promise<EntityWithIdAndDescription[] | EntityWithIdAndDescriptionAndDetail[]> | undefined;
  filled?: boolean;
  helperText?: string;
  labelProps?: InputLabelProps;
  onClose?: (event: React.SyntheticEvent) => void;
  optionsWithTooltip?: boolean
}

export function ControlledMultipleSelectAsync(props: ControlledMultipleSelectAsyncProps) {
  const classes = ControlledMultipleSelectStyles();
  const textFieldClasses = ControlledTextFieldStyles();

  const divRef = useRef<HTMLDivElement>(null);
  const [widthSelect, setWidthSelect] = useState<number>(0);
  const [options, setOptions] = useState<EntityWithIdAndDescription[] | EntityWithIdAndDescriptionAndDetail[]>([]);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const optionsLength: number = options?.length || 0;

  useEffect(() => {
    const getSizeSelect = () => {
      if (divRef.current) {
        const { width } = divRef.current.getBoundingClientRect();
        setWidthSelect(width - offsetPadding);
      }
    };

    getSizeSelect();

    const handleChangeSize = () => {
      getSizeSelect();
    };

    window.addEventListener('resize', handleChangeSize);

    return () => {
      window.removeEventListener('resize', handleChangeSize);
    };
  }, []);

  const { loadOptions } = props;

  useEffect(() => {
    const request = loadOptions();

    if (request) {
      request.then((options) => {
        setOptions(options);
      });
    }
  }, [loadOptions]);

  const handleDelete = (
    entityToDelete: EntityWithIdAndDescription | undefined,
    valuesSelected: number[],
  ) => {
    if (!valuesSelected) return [];

    if (!!entityToDelete)
      return valuesSelected.filter((x) => x !== entityToDelete.id);

    return [];
  };

  const handleMenuItemHover = (id: number | null) => {
    if (isMenuOpen) {
      setHoveredItemId(id);
    }
  };

  return (
    <Controller
      control={props.control}
      name={props.name || ''}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const valueLength = value?.length || 0;
        const isAllSelected = optionsLength === valueLength;

        const sizeDescriptions = options
          ? options
              .filter((x) => value?.includes(x.id))
              .map((x) => {
                if (x.descripcion.length > maxSizeChip) return (maxSizeChip + maxSizeChipOffset);
                return x.descripcion.length + maxSizeChipOffset;
              })
              .reduce((x, y) => x + y, 0)
          : 0;

        const moreThanOneRow: boolean =
          sizeDescriptions * (value?.length || 0) >= widthSelect;

        const stylesSelect = {
          maxHeight: moreThanOneRow ? '' : '43px',
          minHeight: '43px',
          padding: '0px',
          boxSizing: 'border-box',
          border: '1px solid #BFBFBF',
          '&:hover': {
            border: 'none',
          }
        };

        return (
          <div className={classes.contentMultipleSelect}>
            <FormControl
              {...props}
              variant="outlined"
              size="small"
              focused={!!value && value.length > 0}
              sx={{
                '& > div > div': {
                  cursor: props.disabled
                    ? 'not-allowed !important'
                    : 'default !important',
                },
              }}
            >
              <Stack spacing={1.25}>
                {
                  !!props.label &&
                    <LabelFormBase label={props.label}
                    />
                }
                
                <Select
                  ref={divRef}
                  style={stylesSelect}
                  sx={{
                    '& .MuiSelect-select': {
                      padding: '4px 14px !important',
                      minHeight: '43px !important',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    },
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'inherit',
                      },
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'inherit',
                        borderWidth: '1px',
                      },
                    },
                  }}
                  name={props.name}
                  label={props?.id}
                  id={`${props.id}-multiple-select`}
                  multiple
                  value={value || []}
                  onOpen={() => setIsMenuOpen(true)}
                  onClose={(e) => {
                    if (props.optionsWithTooltip) {
                      setIsMenuOpen(false);
                      setHoveredItemId(null);
                    }
                    
                    if (props.onClose) props.onClose(e);
                  }}
                  error={!!props.error || !!error}
                  onChange={(e) => {
                    const isAll = !!e.target.value.includes('all');
                    if (isAll) {
                      if (isAllSelected) e.target.value = [];
                      else e.target.value = options?.map((x) => x.id) || [];
                    }
                    onChange(e);
                  }}
                  MenuProps={multiSelectProps.MenuProps}
                  IconComponent={multiSelectProps.IconComponent}
                  renderValue={(selected) => (
                    <div className={classes.chipsContainer}>
                      {selected.map((selectedId: number) => {
                        const option = options.find((x) => x.id === selectedId);
                        if (!option) return null;
                        
                        return (
                          <Chip
                            key={`chip_${props.id}_${option.id}`}
                            label={stringFormatter.cutIfHaveMoreThan(
                              option[EntityWithIdAndDescriptionFields.Description],
                              maxSizeChip
                            )}
                            deleteIcon={<X size={themeIconsSizeDefinition.sm} />}
                            onDelete={
                              props.disabled
                                ? undefined
                                : () => onChange({
                                    target: { value: handleDelete(option, value) },
                                  })
                            }
                            className={classes.chip}
                            size="small"
                            color="secondary"
                            variant="filled"
                            onMouseDown={(event) => event.stopPropagation()}
                          />
                        );
                      })}
                    </div>
                  )}
                >
                  {options && (
                    <MenuItem
                      value="all"
                      onClick={() => {
                        onChange({
                          target: {
                            value: options.map((x) => x.id) || [],
                          },
                        });
                      }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={isAllSelected}
                          indeterminate={
                            value && options
                              ? value.length > 0 && value.length < options.length
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
                  
                  {options &&
                    options.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        className={clsx('', {
                          [classes.menuItemSelected]: value?.includes(option.id),
                        })}
                        onMouseEnter={props.optionsWithTooltip ? () => handleMenuItemHover(option.id) : undefined}
                        onMouseLeave={props.optionsWithTooltip ? () => handleMenuItemHover(null) : undefined}
                      >
                        <ListItemIcon>
                          <Checkbox
                            checked={value && value.indexOf(option.id) > -1}
                          />
                        </ListItemIcon>

                        {
                          props.optionsWithTooltip ?
                            <Tooltip
                              title={option.detalle || ''}
                              placement="right"
                              open={isMenuOpen && hoveredItemId === option.id && !value?.includes(option.id)}
                              disableHoverListener={!isMenuOpen || value?.includes(option.id)}
                            >
                              <text>
                                {option[EntityWithIdAndDescriptionFields.Description]}
                              </text>
                            </Tooltip>
                            :
                            <text>
                              {option[EntityWithIdAndDescriptionFields.Description]}
                            </text>
                        }
                      </MenuItem>
                    ))}
                </Select>
              </Stack>

              {
                  !!error &&
                    <HelperInputText text={error.message} error />
              }  

              {!error && props.error && props.helperText && (
                <HelperInputText text={props.helperText} error />
              )}
            </FormControl>
          </div>
        );
      }}
    />
  );
}