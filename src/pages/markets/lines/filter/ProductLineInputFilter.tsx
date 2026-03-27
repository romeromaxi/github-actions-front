import FilterProductBaseAccordion from "./FilterProductBaseAccordion";
import {TextFieldFilled} from "../../../../components/forms/StyledTextField";
import {FilterProductLineSearchFields} from "../../../../types/lines/productLineData";
import {ChevronForwardIconButton} from "../../../../components/buttons/Buttons";
import {Stack} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {ProductLineFilterContext} from "../ProductLineSearch";
import {EntityWithBooleanIdAndDescription} from "../../../../types/baseEntities";


interface ProductLineInputFilterProps {
    title: string;
    name: string;
    placeholder: string;
    numeric?: boolean;
}


const ProductLineInputFilter = ({title, name, placeholder, numeric} : ProductLineInputFilterProps) => {
    const fieldName: FilterProductLineSearchFields = name as FilterProductLineSearchFields
    const { filters, setFieldFilter } = useContext(ProductLineFilterContext);
    const value = filters[fieldName];
    // @ts-ignore
    const isApplied = !!value && !!value[0];
    // @ts-ignore
    const [selectedValue, setSelectedValue] = useState<any | undefined>(value)

    useEffect(() => {
        if (value?.length === 0) {
            setSelectedValue(undefined);
        }
    }, [value]);

    const update = (newValue?: string) => {
        const finalValue: any | undefined = newValue
            ? numeric && parseInt(newValue)
            : undefined;
        setSelectedValue(finalValue)
    };

    const onApplyFilter = () => {
        const newEntity: EntityWithBooleanIdAndDescription[] = [
            {id: selectedValue, descripcion: selectedValue ? `${title}: ${selectedValue}` : ''}
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
                />
                <ChevronForwardIconButton onClick={onApplyFilter} size={'small'} sx={{marginBottom: 1.5}}/>
            </Stack>
        </FilterProductBaseAccordion>
    )
}


export default ProductLineInputFilter