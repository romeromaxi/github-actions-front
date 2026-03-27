import React, {useEffect, useRef, useState} from 'react';
import { Control, Controller } from 'react-hook-form';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Stack,
    TextField
} from '@mui/material';
import esLocale from 'date-fns/locale/es/index';
import { parse, isValid } from 'date-fns';
import HelperInputText from "../text/HelperInputText";
import LabelFormBase from "./LabelFormBase";

interface ControlledDatePickerProps {
  control: Control<any>;
  name: string;
  label?: string;
  disabled?: boolean;
  shouldDisableDate?: (day: Date) => boolean;
  shouldDisableYear?: (day: Date) => boolean;
  shouldDisableMonth?: (day: Date) => boolean;
  handleChange?: (argDate: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  inputFormat?: string;
  views?: Array<'day' | 'month' | 'year'>;
  filled?: boolean;
  helperText?: string;
  loadPending?: boolean;

  defaultValue?: Date;
}


export function ControlledDatePicker({
                                         control,
                                         name,
                                         label,
                                         views,
                                         inputFormat,
                                         handleChange,
                                         minDate,
                                         maxDate,
                                         shouldDisableDate,
                                         shouldDisableYear,
                                         shouldDisableMonth,
                                         defaultValue,
                                         helperText,
                                         loadPending,
                                         ...props
                                     }: ControlledDatePickerProps) {
    const [isLabelHidden, setIsLabelHidden] = useState(false);
    const labelRef = useRef(null);
    
    const validateDate = (inputDate: string | null) => {
        if (!inputDate) return null;

        const parsedDate = parse(inputDate, inputFormat || 'dd/MM/yyyy', new Date());

        if (!isValid(parsedDate) || parsedDate.getFullYear() < 1000) {
            return null;
        }

        return parsedDate;
    };

    useEffect(() => {
        if (labelRef.current)
            setIsLabelHidden(labelRef.current.clientHeight === 0);
    }, [label]);

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
                    <DatePicker
                        value={value}
                        onChange={(date: Date | null, keyboardInputValue?: string) => {
                            if (keyboardInputValue) {
                                const validatedDate = validateDate(keyboardInputValue);

                                if (validatedDate) {
                                    validatedDate.setHours(0, 0, 0, 0);
                                    onChange(validatedDate);
                                    handleChange && handleChange(validatedDate);
                                } else {
                                    onChange(null);
                                }
                            } else {
                                onChange(date);
                            }
                        }}
                        inputFormat={inputFormat || 'dd/MM/yyyy'}
                        shouldDisableDate={shouldDisableDate}
                        shouldDisableYear={shouldDisableYear}
                        disabled={props.disabled}
                        minDate={minDate}
                        maxDate={maxDate}
                        views={views}
                        renderInput={(params) => (
                            <Stack>
                                <Stack spacing={1.25}>
                                  {
                                    !!label &&
                                      <LabelFormBase ref={labelRef}
                                                     label={label}
                                                     loadPending={loadPending && !value}
                                      />
                                  }

                                  <TextField
                                    {...params}
                                    variant="filled"
                                    sx={{
                                      '& .MuiFilledInput-input': {
                                        paddingY: isLabelHidden ? '10px'
                                          : '',
                                      }
                                    }}
                                    size="small"
                                    error={!!error || (value === null && params.inputProps?.value)}
                                    InputProps={{
                                      disableUnderline: true,
                                      ...params.InputProps,
                                    }}
                                  />
                                </Stack>

                                {
                                    (!!error || (value === null && params.inputProps?.value)) && 
                                        <HelperInputText text={error?.message || 'Formato inválido. Debe ser dd/mm/aaaa'} error />
                                }
                                
                            </Stack>
                        )}
                    />
                </LocalizationProvider>
            )}
        />
    );
}

