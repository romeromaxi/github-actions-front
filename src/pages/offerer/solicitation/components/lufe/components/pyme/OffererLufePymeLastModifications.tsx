import {LufePymeLastModifications, LufePymeLastModificationsFields} from "../../../../../../../types/lufe/lufePymeData";
import {DataWithLabel} from "../../../../../../../components/misc/DataWithLabel";
import {dateFormatter} from "../../../../../../../util/formatters/dateFormatter";
import {Alert, Stack} from "@mui/material";
import React from "react";
import {Skeleton} from "@mui/lab";


interface OffererLufePymeLastModificationsProps {
    data?: LufePymeLastModifications,
    loading: boolean
}


const OffererLufePymeLastModifications = ({data, loading} : OffererLufePymeLastModificationsProps) => {
    
    return (
        loading ?
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Skeleton sx={{width: '25%'}}/>
                <Skeleton sx={{width: '25%'}}/>
                <Skeleton sx={{width: '25%'}}/>
            </Stack>
            :
            data ?
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <DataWithLabel rowDirection
                                   label={'Indicadores'}
                                   data={dateFormatter.toShortDate(data[LufePymeLastModificationsFields.LastIndicatorsAct])}
                    />
                    <DataWithLabel rowDirection
                                   label={'Documentos'}
                                   data={dateFormatter.toShortDate(data[LufePymeLastModificationsFields.LastDocumentsAct])}
                    />
                    <DataWithLabel rowDirection
                                   label={'Autoridades'}
                                   data={dateFormatter.toShortDate(data[LufePymeLastModificationsFields.LastAuthoritiesAct])}
                    />
                </Stack>
            :
                <Alert severity='error'>No se encontraron datos de las últimas modificaciones</Alert>
    )
}


export default OffererLufePymeLastModifications