
import {Alert, Skeleton, Stack} from "@mui/material";
import { DataWithLabel } from "components/misc/DataWithLabel";
import { stringFormatter } from "util/formatters/stringFormatter";
import {LufePymeRequest, LufePymeRequestFields} from "../../../../../../../types/lufe/lufePymeData";
import {dateFormatter} from "../../../../../../../util/formatters/dateFormatter";


interface OffererLufePymeGeneralDataProps {
    data?: LufePymeRequest
    loading: boolean
}


const OffererLufePymeGeneralData = ({data, loading}: OffererLufePymeGeneralDataProps) => {
    
    
    return (
        loading ?
            <Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Skeleton sx={{width: '30%'}}/>
                    <Skeleton sx={{width: '30%'}}/>
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Skeleton sx={{width: '30%'}}/>
                    <Skeleton sx={{width: '30%'}}/>
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Skeleton sx={{width: '30%'}}/>
                    <Skeleton sx={{width: '30%'}}/>
                </Stack>
            </Stack>
            :
            data ?
                <Stack>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <DataWithLabel rowDirection
                                       label={'CUIT'}
                                       data={stringFormatter.formatCuit(data[LufePymeRequestFields.CUIT])}
                        />
                        <DataWithLabel rowDirection
                                       label={'Últ. actualización'}
                                       data={dateFormatter.toShortDate(data[LufePymeRequestFields.ModifiedDate])}
                        />
                    </Stack>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <DataWithLabel rowDirection
                                       label={'Nombre'}
                                       data={data[LufePymeRequestFields.Name]}
                        />
                        <DataWithLabel rowDirection
                                       label={'Cód. actividad principal'}
                                       data={data[LufePymeRequestFields.MainActivityCode]}
                        />
                    </Stack>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <DataWithLabel rowDirection
                                       label={'Forma jurídica'}
                                       data={data[LufePymeRequestFields.LegalForm]}
                        />
                        <DataWithLabel rowDirection
                                       label={'Fecha contrato social'}
                                       data={dateFormatter.toShortDate(data[LufePymeRequestFields.SocialContractDate])}
                        />
                    </Stack>
                </Stack>
                :
                <Alert severity='error'>Ocurrió un error al cargar los datos de LUFE</Alert>
    )
}


export default OffererLufePymeGeneralData