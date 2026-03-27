import {Button, Stack} from "@mui/material";
import { ChevronForwardIconButton } from "components/buttons/Buttons";
import { AsyncSelect } from "components/forms";
import { TextFieldFilled } from "components/forms/StyledTextField";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {EntityWithBooleanIdAndDescription, EntityWithIdAndDescriptionQuantity} from "../../../../types/baseEntities";
import { ProductLineFilterContext } from "../ProductLineSearch";
import FilterProductBaseAccordion from "./FilterProductBaseAccordion";
import {FilterProductLineSearchFields} from "../../../../types/lines/productLineData";
import { useForm, useWatch } from "react-hook-form";
import {numberFormatter} from "../../../../util/formatters/numberFormatter";


interface ProductLineInputCurrencyFilterProps {
    title: string;
    name: string;
    options: EntityWithIdAndDescriptionQuantity[]
}


const ProductLineInputCurrencyFilter = ({title, name, options} : ProductLineInputCurrencyFilterProps ) => {
    const { filters, setFieldFilter } = useContext(
        ProductLineFilterContext,
    );
    const fieldName: FilterProductLineSearchFields = name as FilterProductLineSearchFields
    const value = filters[fieldName]
    // @ts-ignore
    const isApplied = !!value && !!value[0];

    // @ts-ignore
    const initialValue = Array.isArray(value) && value.length > 0
        ? parseInt(value[0])
        : value;

    // @ts-ignore
    const [curValue, setCurValue] = useState<number | undefined>(initialValue);

    const filteredCodsCurrency = useMemo(() => {
        return filters[FilterProductLineSearchFields.CodsCurrency]?.filter(Boolean);
    }, [filters[FilterProductLineSearchFields.CodsCurrency]]);

    const { control, setValue } = useForm<{
        [FilterProductLineSearchFields.CodsCurrency]?: number;
    }>({
        defaultValues: {
            [FilterProductLineSearchFields.CodsCurrency]:
                filters[FilterProductLineSearchFields.CodsCurrency]?.[0],
        },
    });

    const watchCurrency = useWatch({
        control: control,
        name: FilterProductLineSearchFields.CodsCurrency,
    });

    useEffect(() => {
        if (watchCurrency) {
            const newEntity: EntityWithBooleanIdAndDescription[] =
                [
                    {
                        id: watchCurrency,
                        descripcion: `Moneda ${watchCurrency == 1 ? '$' : 'U$D'}`
                    }
                ]
            setFieldFilter(
                newEntity, FilterProductLineSearchFields.CodsCurrency,
            );
        }
    }, [watchCurrency]);

    useEffect(() => {
        if (filteredCodsCurrency?.length === 1) {
            setValue(
                FilterProductLineSearchFields.CodsCurrency,
                filteredCodsCurrency?.[0],
            );
        } else {
            setValue(FilterProductLineSearchFields.CodsCurrency, 0);
            update(undefined);
        }
    }, [filteredCodsCurrency]);

    const update = (newcurValue?: string) => {
        const finalcurValue: number | undefined = newcurValue
            ? parseFloat(newcurValue)
            : undefined;
        setCurValue(finalcurValue);
    };

    useEffect(() => {
        window.location.toString().includes('amount') && onApplyFilter()
    }, []);

    const onApplyFilter = () => {
        const entityList: EntityWithBooleanIdAndDescription[] = [
            {id: curValue ? curValue : 0, descripcion: `${title}: $${numberFormatter.toStringWithDecimals(curValue || null)}`}
        ]
        setFieldFilter(entityList, fieldName);
    }

    useEffect(() => {
        if (
            filters[fieldName] == undefined ||
            // @ts-ignore
            filters[fieldName] == ''
        ) {
            // @ts-ignore
            setCurValue(undefined);
        }
    }, [filters[fieldName]]);

    return (
        <FilterProductBaseAccordion title={title} isApplied={isApplied}>
            <Stack direction={'column'} gap={1}>
                <Stack direction='row' spacing={1} alignItems='center'>
                    <TextFieldFilled
                        value={curValue}
                        onBlur={(e) => {
                            update(curValue?.toString());
                        }}
                        onChange={(e) => {
                            setCurValue(parseFloat(e.target.value));
                        }}
                        currency
                        defaultValue={undefined}
                        name={fieldName}
                        disabled={filteredCodsCurrency?.length !== 1}
                        helperText={
                            filteredCodsCurrency?.length !== 1 &&
                            'Debe seleccionar una única moneda'
                        }
                    />
                    <ChevronForwardIconButton onClick={onApplyFilter} size={'small'} sx={{marginBottom: filteredCodsCurrency?.length !== 1 ? 1.5 : 0}} disabled={!curValue} />
                </Stack>
                <AsyncSelect
                    options={options}
                    loadOptions={() => Promise.resolve(options)}
                    name={FilterProductLineSearchFields.CodsCurrency}
                    control={control}
                    label={'Moneda'}
                    sx={{ mb: 2 }}
                />
            </Stack>
            <Stack alignItems={'center'} pt={2}>
                <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => {
                        setFieldFilter([{id: 0, descripcion: ''}], fieldName);
                        setFieldFilter(
                            [{id: 0, descripcion: ''}],
                            FilterProductLineSearchFields.CodsCurrency,
                        );
                        setCurValue(0);
                    }}
                >
                    Limpiar
                </Button>
            </Stack>
        </FilterProductBaseAccordion>
    )
}


export default ProductLineInputCurrencyFilter



interface ProductLineInputCurrencyWithoutSelectFilterProps {
    title: string;
    name: string;
    placeholder: string;
}


export const ProductLineInputCurrencyWithoutSelectFilter = ({title, name, placeholder} : ProductLineInputCurrencyWithoutSelectFilterProps) => {
    const fieldName: FilterProductLineSearchFields = name as FilterProductLineSearchFields
    const { filters, setFieldFilter } = useContext(ProductLineFilterContext);
    const value = filters[fieldName];
    // @ts-ignore
    const isApplied = !!value && !!value[0];
    // @ts-ignore
    const [selectedValue, setSelectedValue] = useState<number | undefined>(value)

    useEffect(() => {
        if (value?.length === 0) {
            setSelectedValue(undefined);
        }
    }, [value]);

    const update = (newValue?: string) => {
        const finalSeniority: number | undefined = newValue
            ? parseInt(newValue)
            : undefined;
        setSelectedValue(finalSeniority)
    };

    const onApplyFilter = () => {
        const newEntity: EntityWithBooleanIdAndDescription[] = [
            {id: selectedValue, descripcion: selectedValue ? `${title}: ${numberFormatter.toStringWithDecimals(selectedValue)}` : ''}
        ]
        setFieldFilter(newEntity, fieldName);
    }
    
    return (
        <FilterProductBaseAccordion
            title={title}
            isApplied={isApplied}
        >
            <Stack direction='row' spacing={1} alignItems='center'>
                <TextFieldFilled
                    value={selectedValue || ''}
                    onChange={(e) => update(e.target.value)}
                    defaultValue={undefined}
                    name={name}
                    helperText={placeholder}
                    currency
                />
                <ChevronForwardIconButton onClick={onApplyFilter} size={'small'} sx={{marginBottom: 1.5}}/>
            </Stack>
        </FilterProductBaseAccordion>
    )
}