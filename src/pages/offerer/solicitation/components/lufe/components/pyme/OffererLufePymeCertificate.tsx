import {Alert, Stack} from "@mui/material";
import {DataWithLabel} from "../../../../../../../components/misc/DataWithLabel";
import {LufePymeCertificate, LufePymeCertificateFields} from "../../../../../../../types/lufe/lufePymeData";
import {dateFormatter} from "../../../../../../../util/formatters/dateFormatter";
import React from "react";
import {Skeleton} from "@mui/lab";


interface OffererLufePymeCertificateProps {
    data?: LufePymeCertificate,
    loading: boolean
}


const OffererLufePymeCertificate = ({data, loading} : OffererLufePymeCertificateProps) => {
    return (
        loading ?
            <Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Skeleton sx={{width: '30%'}}/>
                    <Skeleton sx={{width: '30%'}}/>
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Skeleton sx={{width: '40%'}}/>
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
                                   label={'Categoría'}
                                   data={data[LufePymeCertificateFields.Category] ?? '-'}
                    />
                    <DataWithLabel rowDirection
                                   label={'Fecha de emisión'}
                                   data={dateFormatter.toShortDate(data[LufePymeCertificateFields.EmissionDate])}
                    />
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <DataWithLabel rowDirection
                                   label={'Fecha desde - hasta'}
                                   data={`${dateFormatter.toShortDate(data[LufePymeCertificateFields.DateFrom])} - ${dateFormatter.toShortDate(data[LufePymeCertificateFields.DateTo])}`}
                    />
                    <DataWithLabel rowDirection
                                   label={'Nro. registro'}
                                   data={data[LufePymeCertificateFields.RegisterNumber]}
                    />
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <DataWithLabel rowDirection
                                   label={'Sector'}
                                   data={data[LufePymeCertificateFields.Sector] ?? '-'}
                    />
                    <DataWithLabel rowDirection
                                   label={'Transacción'}
                                   data={data[LufePymeCertificateFields.Transaction] ?? '-'}
                    />
                </Stack>
            </Stack>
            :
            <Alert severity='error'>No se encontraron datos del Certificado PyME</Alert>
    )
}


export default OffererLufePymeCertificate