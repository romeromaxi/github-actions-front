import React, {useEffect, useRef, useState} from 'react';
import NumberFormat from 'react-number-format';
import { Control, Controller } from 'react-hook-form';
import {
  CircularProgress,
  InputAdornment,
  MenuItem,
  Stack,
  StandardTextFieldProps,
  SxProps,
  TextField, Tooltip, Typography,
} from '@mui/material';
import HelperInputText from '../text/HelperInputText';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ControlledTextFieldStyles from "./ControlledTextField.styles";
import LabelFormBase from "./LabelFormBase";

export interface ControlledTextFieldProps extends StandardTextFieldProps {
    control: Control<any>;
    options?: any[];
    currency?: boolean;
    percentage?: boolean;
    onFocus?: (event: any) => void;
    currencyPrefix?: string;
    currencySuffix?: string;
    roundDecimals?: boolean;
    loadPending?: boolean;
    inputSx?: SxProps;
    disabled?: boolean;
    textAlign?: 'left' | 'right' | 'center';
    optionsWithTooltip?: boolean;
    disableEmpty?: boolean;
}

export const ControlledTextField = ({
    helperText,
    required,
    label,
    ...props
}: ControlledTextFieldProps) => (
    <Controller
        control={props.control}
        name={props.name || ''}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Stack sx={{ width: '100%' }}>
                <TextField
                    {...props}
                    label={required ? `${label} *` : label}
                    variant="outlined"
                    size="small"
                    type={props.type}
                    value={
                        props.type === 'number'
                            ? +value
                            : !props.select
                                ? value
                                : !props.options || !value
                                    ? 0
                                    : value
                    }
                    onChange={onChange}
                    error={!!error}
                    disabled={props.disabled}
                    defaultValue={
                        props.defaultValue
                            ? props.defaultValue
                            : !props.select
                                ? value
                                : !props.options
                                    ? 0
                                    : value
                    }
                    SelectProps={{
                        MenuProps: {
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                            },
                            transformOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                            },
                        },
                    }}
                    inputProps={{
                        prefix: props?.currencyPrefix,
                        suffix: props?.currencySuffix,
                        style: {
                            textAlign: props?.textAlign,
                        },
                    }}
                    InputProps={{
                        inputComponent: props.currency
                            ? (NumberFormatCustom as any)
                            : 'input',
                        endAdornment: (
                            <InputAdornment position="end">
                                {!props.options && props.select && (
                                    <CircularProgress size={25} />
                                )}
                            </InputAdornment>
                        ),
                        sx: props.inputSx,
                        ...props.InputProps,
                    }}
                    InputLabelProps={{
                        shrink:
                            props.type === 'number'
                                ? value + 1
                                : value !== 0
                                    ? value ?? undefined
                                    : !props.select,
                        ...props.InputLabelProps,
                    }}
                >
                    {props.select && <MenuItem value={0}></MenuItem>}
                    {props.options &&
                        props.select &&
                        props.options.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.descripcion}
                            </MenuItem>
                        ))}
                </TextField>

                {error && <HelperInputText text={error.message} error />}

                {helperText && !error && <HelperInputText text={helperText} />}
            </Stack>
        )}
    />
);

export const ControlledTextFieldFilled = ({
                                              helperText,
                                              label,
                                              required,
                                              loadPending,
                                              sx,
                                              style,
                                              optionsWithTooltip,
                                              disableEmpty,
                                              ...props
                                          }: ControlledTextFieldProps) => {

    const labelRef = useRef(null);
    //const [isLabelHidden, setIsLabelHidden] = useState(false);
    const [isFocused, setFocused] = useState<boolean>(false);
    const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuItemHover = (id: number | null) => {
        if (isMenuOpen) {
            setHoveredItemId(id);
        }
    };
  
    const handleFocus = (event: any) => {
        setFocused(true);
        props?.onFocus && props?.onFocus(event);
    }

    const handleBlur = () => setFocused(false);

    const valueIsValid = (value: any) => {
        if (props.currency && (!!value || value == 0)) return true;
        if (value === null || value == '' || !value) return false;

        if (props.select) return value > 0;

        return true;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (props.type === 'number') {
            const allowedKeys = [
                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                'Tab', 'Enter', 'Escape', 'Home', 'End'
            ];

            if (allowedKeys.includes(event.key) ||
                event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            if (!/^[0-9]$/.test(event.key)) {
                event.preventDefault();
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (props.type === 'number') {
            const numericValue = event.target.value.replace(/[^0-9]/g, '');

            if (event.target.value !== numericValue) {
                event.target.value = numericValue;
            }
        }
    };

    /*useEffect(() => {
        if (labelRef.current)
            setIsLabelHidden(labelRef.current.clientHeight === 0);
    }, [label]);*/

    return (
        <Controller
            control={props.control}
            name={props.name || ''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Stack sx={{ width: '100%' }}>
                    <Stack spacing={1.25}>
                      {
                        !!label &&
                          <LabelFormBase ref={labelRef}
                                         label={label}
                                         required={required}
                                         loadPending={loadPending && !valueIsValid(value)}
                          />
                      }

                      <TextField
                        {...props}
                        sx={{
                          ...sx,
                          ...style,
                        }}
                        variant="filled"
                        type={props.type}
                        size="small"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        onInput={handleInputChange}
                        value={
                          props.type === 'number'
                            ? value ? +value : null
                            : !props.select
                              ? value
                              : !props.options || !value
                                ? 0
                                : props.percentage && !value
                                  ? 9999
                                  : value
                        }
                        onChange={(e) => {
                          if (props.percentage || props.currency || props.type === 'number')
                            onChange(e.target.value === '' ? null : e.target.value)
                          else
                            onChange(e)

                          if (props.onChange) props.onChange(e);
                        }}
                        error={!!error}
                        defaultValue={
                          props.defaultValue
                            ? props.defaultValue
                            : !props.select
                              ? value
                              : !props.options
                                ? 0
                                : value
                        }
                        inputProps={{
                          prefix: props.currency
                            ? props?.currencyPrefix === undefined
                              ? '$'
                              : props.currencyPrefix
                            : undefined,
                          suffix: props.percentage ? '%' : props?.currencySuffix,
                          roundDecimals: props.roundDecimals,
                          ...props.inputProps,
                          style: {
                            ...props.inputProps?.style, 
                            textAlign: props?.textAlign,
                          },
                        }}
                        InputProps={{
                          disableUnderline: true,
                          inputComponent:
                            props.currency || props.percentage
                              ? (NumberFormatCustom as any)
                              : 'input',
                          endAdornment: !props.options && props.select && (
                            <InputAdornment position="end">
                              <CircularProgress size={25} />
                            </InputAdornment>
                          ),
                          ...props.InputProps,
                        }}
                        InputLabelProps={{
                          shrink: isFocused || Boolean(value !== 0 || props.select ? value : value + 1),
                          ...props.InputLabelProps,
                        }}
                        SelectProps={{
                          onOpen: optionsWithTooltip ? () => setIsMenuOpen(true) : undefined,
                          onClose: optionsWithTooltip ? 
                            () => {
                              setIsMenuOpen(false);
                              setHoveredItemId(null);
                            }
                            : undefined,
                          MenuProps: {
                            anchorOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left',
                            },
                            transformOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left',
                            },
                          },
                          IconComponent: KeyboardArrowDownIcon,
                        }}
                    >
                        {props.select && !disableEmpty && (
                          <MenuItem
                            value={0}
                            disableRipple
                          />
                        )}
                        {props.options &&
                          props.select &&
                          props.options.map((option) => (
                            optionsWithTooltip ?
                              <MenuItem key={option.id}
                                        value={option.id}
                                        onMouseEnter={() => handleMenuItemHover(option.id)}
                                        onMouseLeave={() => handleMenuItemHover(null)}
                              >
                                <Tooltip title={option.detalle || ''}
                                         placement={"right"}
                                         open={isMenuOpen && hoveredItemId === option.id && value !== option.id}
                                         disableHoverListener={!isMenuOpen || value === option.id}>
                                  {option.descripcion}
                                </Tooltip>
                              </MenuItem>
                              :
                              <MenuItem
                                key={option.id}
                                value={option.id}
                                disableRipple
                              >
                                {option.descripcion}
                              </MenuItem>
                          ))}
                      </TextField>
                    </Stack>

                    {error && <HelperInputText text={error.message} error />}

                    {helperText && !error && <HelperInputText text={helperText} />}
                </Stack>
            )}
        />
    );
};

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    prefix?: string;
    suffix?: string;
    roundDecimals?: boolean;
    onBlur?: () => void
}

export const NumberFormatCustom = React.forwardRef<
    typeof NumberFormat,
    CustomProps
>(function NumberFormatCustom(props, ref) {
    // @ts-ignore
    const { onChange, value, ...other } = props;
    const [currentValue, setCurrentValue] = useState<string>('');
    
    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onBlur={() => {
                if (props?.roundDecimals && currentValue) {
                    onChange({
                        target: {
                            name: props.name,
                            value:
                                props?.roundDecimals && currentValue
                                    ? Math.round(parseFloat(currentValue)).toString()
                                    : currentValue,
                        },
                    });
                }
                props?.onBlur && props?.onBlur()
            }}
            onValueChange={(values) => {
                setCurrentValue(values.value);
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
            isNumericString
            prefix={props?.prefix ? `${props.prefix} ` : ''}
            suffix={props?.suffix}
        />
    );
});