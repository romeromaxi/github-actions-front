import {
    GeneralSolicitationFilter,
    GeneralSolicitationFilterFields,
    SolicitationFilterFields
} from "../../../types/solicitations/solicitationData";
import {HttpCacheProduct} from "../../../http/cache/httpCacheProduct";
import React, {useEffect, useRef, useState} from "react";
import {Product} from "../../../types/product/productData";
import {useForm} from "react-hook-form";
import {Stack} from "@mui/material";
import {ControlledCheckBoxFilter} from "../../../components/forms";
import ChipMultiselect from "../../../components/forms/ChipMultiselect";


interface CompanySolicitationsFilterProps {
    onSearch: (filter: GeneralSolicitationFilter) => void
}

interface CompanyUserSolicitationsForm {
    [GeneralSolicitationFilterFields.ProductCodes]?: number[],
    [GeneralSolicitationFilterFields.OnlyWithAlert]?: boolean,
    actualPage: number
}

const CompanySolicitationsFilter = ({onSearch} : CompanySolicitationsFilterProps) => {
    const [lines, setLines] = useState<Product[]>([])
    const alertDefault = window.location.toString().includes('alert')
    const methods = useForm<CompanyUserSolicitationsForm>({
        defaultValues: {
            [GeneralSolicitationFilterFields.OnlyWithAlert]: alertDefault
        }
    })
    const prevValues = useRef<CompanyUserSolicitationsForm | null>(null)
    const watchValues = methods.watch()
    const getProducts = () => {
        HttpCacheProduct.getList(true).then(setLines)
    }

    useEffect(() => {
        getProducts()
    }, []);

    useEffect(() => {
        if (prevValues.current) {
            const { actualPage: actualPageCurrent, ...currentValues } = watchValues;
            const { actualPage: actualPagePrev, ...previousValues } = prevValues.current;
            if (JSON.stringify(currentValues) !== JSON.stringify(previousValues)) {
                onSearch({
                    ...currentValues,
                    [SolicitationFilterFields.CurrentPage]: 1
                });
            } else if (actualPageCurrent !== actualPagePrev) {
                onSearch({
                    ...currentValues,
                    [SolicitationFilterFields.CurrentPage]: actualPageCurrent
                });
            }
        } else {
            onSearch(watchValues);
        }

        prevValues.current = watchValues;
    }, [watchValues]);
    
    return (
        <Stack direction='row-reverse' alignItems='center' spacing={1}
               sx={{borderRadius: '24px', backgroundColor: 'white', padding: '16px'}}
        >
            <ChipMultiselect control={methods.control}
                             name={GeneralSolicitationFilterFields.ProductCodes}
                             label={'Tipo de producto'}
                             options={lines}
            />
            
            <ControlledCheckBoxFilter label={'Con Alerta'}
                                      name={GeneralSolicitationFilterFields.OnlyWithAlert}
                                      control={methods.control}
            />
        </Stack>
    )
}



export default CompanySolicitationsFilter