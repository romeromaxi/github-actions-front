import {
    FilterProductLineSearchFields,
    ProductLineFilterGondolaTypes,
    ProductLineGondolaFilter,
    ProductLineGondolaFilterFields
} from "../../../../types/lines/productLineData";
import {Stack} from "@mui/material";
import FilterProductBaseList from "./FilterProductBaseList";
import ProductLineInputFilter from "./ProductLineInputFilter";
import ProductLineInputCurrencyFilter, {
    ProductLineInputCurrencyWithoutSelectFilter
} from "./ProductLineInputCurrencyFilter";
import FilterProductBaseCheckbox from "./FilterProductBaseCheckbox";
import React from "react";
import {Skeleton} from "@mui/lab";


export interface ProductLineGondolaFiltersProps {
    filterOptions?: ProductLineGondolaFilter[]
}


const ProductLineGondolaFilters = ({filterOptions} : ProductLineGondolaFiltersProps) => {
    
    return (
        <Stack spacing={1}>
            {filterOptions ?
                filterOptions.length !== 0 && filterOptions.map((filter) => {
                    switch (filter[ProductLineGondolaFilterFields.ProductLineFilterGondolaType]) {
                        case ProductLineFilterGondolaTypes.Multiselect:
                            return <FilterProductBaseList title={filter[ProductLineGondolaFilterFields.Name]}
                                                          name={filter[ProductLineGondolaFilterFields.FilterFieldName]}
                                                          defaultOptions={filter[ProductLineGondolaFilterFields.Options]}
                            />
                        case ProductLineFilterGondolaTypes.NumberInput:
                            return <ProductLineInputFilter title={filter[ProductLineGondolaFilterFields.Name]}
                                                           name={filter[ProductLineGondolaFilterFields.FilterFieldName]}
                                                           placeholder={filter[ProductLineGondolaFilterFields.Detail]}
                                                           numeric
                            />
                        case ProductLineFilterGondolaTypes.CurrencyInputWithSelect:
                            return <ProductLineInputCurrencyFilter title={filter[ProductLineGondolaFilterFields.Name]}
                                                                   name={filter[ProductLineGondolaFilterFields.FilterFieldName]}
                                                                   options={filter[ProductLineGondolaFilterFields.Options]}
                            />
                        case ProductLineFilterGondolaTypes.Input:
                            return <ProductLineInputFilter title={filter[ProductLineGondolaFilterFields.Name]}
                                                           name={filter[ProductLineGondolaFilterFields.FilterFieldName]}
                                                           placeholder={filter[ProductLineGondolaFilterFields.Detail]}
                            />
                        case ProductLineFilterGondolaTypes.Boolean:
                            return <FilterProductBaseCheckbox title={filter[ProductLineGondolaFilterFields.Name]} 
                                                              name={filter[ProductLineGondolaFilterFields.FilterFieldName] as FilterProductLineSearchFields} 
                                                              label={filter[ProductLineGondolaFilterFields.Detail]}
                            />
                        case ProductLineFilterGondolaTypes.CurrencyInput:
                            return <ProductLineInputCurrencyWithoutSelectFilter title={filter[ProductLineGondolaFilterFields.Name]} 
                                                                                name={filter[ProductLineGondolaFilterFields.FilterFieldName]} 
                                                                                placeholder={filter[ProductLineGondolaFilterFields.Detail]}
                            />
                    }
                }
                )
                :
                Array.from({length: 8}).map((e, idx) => <Skeleton key={`skeleton_filter_${idx}`} height={30} width={'100%'}/>)
            }
        </Stack>
    )
}



export default ProductLineGondolaFilters