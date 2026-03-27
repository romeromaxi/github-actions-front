import { Control, Controller } from "react-hook-form";
import React, {ReactNode, useEffect, useState} from "react";

import { ControlledTextFieldFilled } from "./ControlledTextField";
import { Autocomplete, Chip, createFilterOptions, Stack, TextField } from "@mui/material";
import {
    EntityWithIdAndDescription, EntityWithIdAndDescriptionFields, EntityWithIdFields
} from "types/baseEntities";
import HelperInputText from "components/text/HelperInputText";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LabelFormBase from "./LabelFormBase";

interface FilterEntity extends EntityWithIdAndDescription {
    title: string
}
const filter = createFilterOptions<FilterEntity>();

interface ControlledAutocompleteProps /*extends AutocompleteProps<any, boolean, boolean, boolean>*/ {
    loadOptions: () => Promise<any[]> | undefined,
    control: Control<any>,
    name: string,
    label?: string | null,
    defaultValues?: any[];
    disabled?: boolean,
    multiple?: boolean,
    valueField?: string,
    optionField?: string
    onAddOption?: (value: string, prevValues: any[]) => void,
    required?: boolean,
    readOnly?: boolean
    placeholder?: string,
    limitTags?: number,
    getOption?: (option: any) => string,
    helperText?: ReactNode,
    renderOption?: (props: Object, option: any, state: Object, ownerState: Object) => ReactNode,

    disableClearable?: boolean,
    noOptionsText?: string
}

export const ControlledAutocomplete = (props: ControlledAutocompleteProps) => {

    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<any[]>([])

    const { loadOptions } = props;

    useEffect(() => {
        const request = loadOptions();

        if (request) {
            setLoading(true);

            request.then(options => {
                setOptions(options);
                setLoading(false);
            }).catch(error => setLoading(false))
        }
        else
            setOptions([]);
    }, [loadOptions])

    return (
        <Controller
            control={props.control}
            name={props.name || ''}
            render={({ field: { onChange, value, ...field }, fieldState: { error } }) => {
                if (props.disabled)
                    return (
                        <ControlledTextFieldFilled
                            {...props}
                            select
                            options={options}
                            SelectProps={{
                                IconComponent: KeyboardArrowDownIcon
                            }}
                        />
                    );
                if (loading)
                    return (
                        <ControlledTextFieldFilled
                            {...props}
                            select
                            options={undefined}
                            SelectProps={{
                                IconComponent: KeyboardArrowDownIcon
                            }}
                        />
                    );

                return (
                    <Autocomplete
                        {...field}
                        noOptionsText={props.noOptionsText || "Sin opciones"}
                        renderOption={props.renderOption}
                        options={options}
                        defaultValue={props.defaultValues}
                        onChange={(_, data) => {
                            if (data && data.length !== 0)
                                if (props.multiple) {
                                    if (!!props.onAddOption) {
                                        let newValue = data.filter((x: any) => !x.id);
                                        if (newValue && newValue.length)
                                            props.onAddOption && props.onAddOption(newValue[0][EntityWithIdAndDescriptionFields.Description], data);
                                    }
                                    //let filtered_data = removeDuplicatesById(data)
                                    //onChange(props.valueField ? filtered_data.map((v: any) => v?.[props.valueField!]) : filtered_data)
                                    onChange(props.valueField ? data.map((v: any) => v?.[props.valueField!]) : data)
                                } else
                                if (!data.id)
                                    props.onAddOption && props.onAddOption(data[EntityWithIdAndDescriptionFields.Description], data);
                                else
                                    onChange(props.valueField ? props.multiple ? data.map((d: any) => d?.[props.valueField!]) : data?.[props.valueField] : data)
                            else {
                                onChange(undefined);
                            }
                        }}
                        onInputChange={(_, data) => {

                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            const { inputValue } = params;
                            const isExisting = options.some((option) => inputValue === option.description);
                            if (inputValue !== '' && !isExisting && !!props.onAddOption) {
                                let input = {
                                    [EntityWithIdFields.Id]: 0,
                                    [EntityWithIdAndDescriptionFields.Description]: inputValue,
                                    [props.optionField || "titleDescription"]: inputValue
                                }
                                filtered.push({
                                    ...input,
                                    title: `Agregar "${inputValue}"`,
                                });
                            }

                            return filtered ?? [];
                        }}
                        multiple={props.multiple}
                        limitTags={props.limitTags}
                        disabled={props.readOnly}
                        disableClearable={props.disableClearable}
                        ChipProps={{ color: 'primary' }}
                        id={`id_${props.name}`}
                        key={`autocomplete_id_${props.name}`}
                        style={{ width: '100%' }}
                        componentsProps={{ popper: { style: { width: 'fit-content' } } }}
                        getOptionLabel={(option) => props.getOption ? props.getOption(option) : props.optionField ? option.title || option[props.optionField] : (option.title ? option.title : option.descripcion)}
                        // getOptionSelected={((option: any, value: any) => value.hasOwnProperty('id') ? (option.id === value?.id) : (option.id === value))}
                        //isOptionEqualToValue={(option: any, value: any) => value.hasOwnProperty('id') ? (option.id === value?.id) : (option.id === value)}
                        isOptionEqualToValue={(option: any, value: any) => value.hasOwnProperty('id') ? (option.id !== 0 && option.id === value?.id) : (option.id !== 0 && option.id === value)}
                        renderTags={(value: any[], getTagProps) =>
                            value.map((option: any, index: number) => (
                                <Chip color="primary"
                                      variant="outlined"
                                      label={props.optionField ? option[props.optionField] : option.descripcion}
                                      sx={{
                                          padding: '0px 10px',
                                          '& > svg': {
                                              fontSize: '1.4rem !important'
                                          }
                                      }}
                                      {...getTagProps({index})}
                                />
                            ))
                        }
                        renderInput={(params) => {
                            if (props.multiple) {
                                return (
                                    <Stack>
                                        <Stack spacing={1.25}>
                                            {
                                                !!props.label &&
                                                <LabelFormBase label={props.label} />
                                            }

                                            <TextField {...params}
                                                       margin="normal"
                                                       variant="filled"
                                                       size="small"
                                                       error={!!error}
                                                       inputProps={{
                                                           ...params.inputProps,
                                                           style: { padding: '0.3rem 1rem' }
                                                       }}
                                                       InputProps={{
                                                           disableUnderline: true,
                                                           ...params.InputProps,
                                                           endAdornment: (
                                                               <React.Fragment>
                                                               </React.Fragment>
                                                           ),
                                                       }}
                                                       focused={!!params.inputProps.value}
                                                       sx={{ marginTop: '3.1px' }}
                                            />
                                        </Stack>                                         
                                        
                                        {error && <HelperInputText text={error.message} error />}
                                    </Stack>
                                );
                            }

                            let optionSelect = options.find(x => x.id === value);

                            return (
                                <Stack>
                                    <Stack spacing={1.25}>
                                        {
                                            !!props.label &&
                                            <LabelFormBase label={props.label} />
                                        }

                                        <TextField {...params}
                                                   margin="normal"
                                                   variant="filled"
                                                   size="small"
                                                   error={!!error}
                                                   placeholder={props.placeholder}
                                                   inputProps={{
                                                       ...params.inputProps,
                                                       style: { padding: '0.3rem 1rem' },
                                                       value: (value && optionSelect) ? // @ts-ignore
                                                           props.optionField ? optionSelect[props.optionField] : optionSelect.descripcion : params.inputProps.value
                                                   }}
                                                   InputProps={{
                                                       disableUnderline: true,
                                                       ...params.InputProps,
                                                       endAdornment: (
                                                           <></>
                                                       )
                                                   }}
                                                   focused={!!params.inputProps.value}
                                                   sx={{ marginTop: '3.1px', marginBottom: '0px !important' }}
                                        />
                                    </Stack>

                                    {(props.helperText && !error) && <HelperInputText text={props.helperText}/>}

                                    {error && <HelperInputText text={error.message} error />}
                                </Stack>
                            )
                        }}
                    />
                )
            }}
        />
    )
}