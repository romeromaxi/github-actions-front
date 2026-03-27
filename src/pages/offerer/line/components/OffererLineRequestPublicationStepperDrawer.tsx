import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {Box, Grid} from '@mui/material';

import { ControlledDatePicker } from 'components/forms/ControlledDatePicker';

import {
    ProductLineViewDetail,
    RequestPublicationData,
    RequestPublicationFields,
} from 'types/lines/productLineData';
import { useAction } from 'hooks/useAction';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { dateHelper } from 'util/helpers/dateHelper';
import {DATE_OUT_OF_RANGE_MESSAGE, RequiredDateSchema} from 'util/validation/validationSchemas';
import {HttpOffererProductLine, HttpProductLine} from 'http/index';
import {BaseResponseFields, EntityWithIdFields} from 'types/baseEntities';
import DrawerBase from "../../../../components/misc/DrawerBase";
import ProductLineCard from "../../../markets/lines/components/ProductLineCard";
import {Skeleton} from "@mui/lab";
import ProductLineDetailBody from "../../../markets/lines/detail/components/ProductLineDetailBody";
import {ProductLineDetailContext} from "../../../markets/lines/detail/ProductLinePymeDetail";
import OffererLineRequestPublicationStepper from "./OffererLineRequestPublicationStepper";

interface OffererLineRequestPublicationStepperDrawerProps {
    open: boolean;
    offererId: number;
    productLineId: number;
    onCloseDrawer: () => void;
    onSubmitDrawer: () => void;
}

function OffererLineRequestPublicationStepperDrawer(
    props: OffererLineRequestPublicationStepperDrawerProps,
) {

    const steps = [
        {
            label: 'Confirmación de Card Tienda',
            content: <OffererLineRequestPublicationStepOne lineId={props.productLineId}/>
        },
        {
            label: 'Confirmación de detalle',
            content: <OffererLineRequestPublicationStepTwo lineId={props.productLineId}/>
        },
        {
            label: 'Solicitud de Publicación',
            content: <OffererLineRequestPublicationStepThree offererId={props.offererId}
                                                             onSubmitDrawer={props.onSubmitDrawer}
                                                             productLineId={props.productLineId}
            />
        }
    ];

    return (
        <DrawerBase show={props.open} onCloseDrawer={props.onCloseDrawer} title='Solicitar Publicación'>
            <OffererLineRequestPublicationStepper steps={steps} />
        </DrawerBase>
    );
}


interface OffererLineRequestPublicationStepOneProps {
    lineId: number
}

const OffererLineRequestPublicationStepOne = ({lineId} : OffererLineRequestPublicationStepOneProps) => {
    const [productLineDetail, setProductLineDetail] = useState<ProductLineViewDetail>();

    useEffect(() => {
        lineId && HttpProductLine.getByProductLineId(lineId).then(setProductLineDetail)
    }, [lineId]);
    
    return (
        <Box display='flex' justifyContent='center'>
            {
                productLineDetail ?
                    <ProductLineCard productLine={productLineDetail} viewMode />
                    :
                    <Skeleton height={420} width={300}/>    
            }
        </Box>
    )
}


interface OffererLineRequestPublicationStepTwoProps {
    lineId: number
}

const OffererLineRequestPublicationStepTwo = ({lineId} : OffererLineRequestPublicationStepTwoProps) => {
    const [productLineDetail, setProductLineDetail] = useState<ProductLineViewDetail>();

    useEffect(() => {
        lineId && HttpProductLine.getByProductLineId(lineId).then(setProductLineDetail)
    }, [lineId]);

    return (
        <Box display='flex' justifyContent='center'>
            {
                productLineDetail ?
                    <ProductLineDetailContext.Provider value={{
                        idProductLine: productLineDetail[EntityWithIdFields.Id],
                        productLine: productLineDetail
                    }}>
                        <ProductLineDetailBody hideActions />
                    </ProductLineDetailContext.Provider>
                    :
                    <Skeleton height={400} width={400}/>
            }
        </Box>
    )
}


interface OffererLineRequestPublicationStepThreeProps {
    offererId: number;
    productLineId: number;
    onSubmitDrawer: () => void;
}


const OffererLineRequestPublicationStepThree = (props : OffererLineRequestPublicationStepThreeProps) => {
    const { showLoader, hideLoader, snackbarError, snackbarSuccess } = useAction();
    const today: Date = new Date();today.setHours(0, 0, 0, 0);
    const minDate: Date = today;
    const [startDate, setStartDate] = useState<Date>();

    const OffererLineRequestPublicationSchema = yup
        .object()
        .shape({
            [RequestPublicationFields.DateToPublish]: yup
                .mixed()
                .required('Campo obligatorio')
                .default(() => today),
            [RequestPublicationFields.DateCancelPublication]: RequiredDateSchema
        })
        .test(
            RequestPublicationFields.DateToPublish,
            `La fecha debe ser mayor o igual a ${dateFormatter.toShortDate(today)}`,
            (obj) => {
                if (!obj) return true;

                if (
                    !obj[RequestPublicationFields.DateToPublish] ||
                    obj[RequestPublicationFields.DateToPublish] >= today
                )
                    return true;

                return new yup.ValidationError(
                    `La fecha debe ser mayor o igual a ${dateFormatter.toShortDate(minDate)}`,
                    null,
                    RequestPublicationFields.DateToPublish,
                );
            },
        )
        .test(
            RequestPublicationFields.DateCancelPublication,
            'Debe ser mayor que la Fecha de Publicación',
            (obj) => {
                let dateCancelPub = obj[RequestPublicationFields.DateCancelPublication];
                let dateToPublish = obj[RequestPublicationFields.DateToPublish];

                if (!dateCancelPub) return true;

                if (!dateHelper.isValidDate(dateCancelPub))
                    return new yup.ValidationError(
                        DATE_OUT_OF_RANGE_MESSAGE,
                        null,
                        RequestPublicationFields.DateCancelPublication,
                    );

                if (
                    !!dateToPublish &&
                    (dateCancelPub as Date) <= (dateToPublish as Date)
                )
                    return new yup.ValidationError(
                        'Debe ser mayor que la Fecha de Publicación',
                        null,
                        RequestPublicationFields.DateCancelPublication,
                    );

                if ((dateCancelPub as Date) >= minDate) return true;

                return new yup.ValidationError(
                    `La fecha debe ser mayor o igual a ${dateFormatter.toShortDate(minDate)}`,
                    null,
                    RequestPublicationFields.DateCancelPublication,
                );
            },
        );

    const methods = useForm<RequestPublicationData>({
        resolver: yupResolver(OffererLineRequestPublicationSchema),
    });

    const resetForm = () =>
        methods.reset({
            [RequestPublicationFields.DateToPublish]: undefined,
            [RequestPublicationFields.DateCancelPublication]: undefined,
        });
    

    const handleSubmit = (data: RequestPublicationData) => {
        showLoader();

        if (!data[RequestPublicationFields.DateToPublish])
            data[RequestPublicationFields.DateToPublish] = today;

        HttpOffererProductLine.requestPublication(
            props.offererId,
            props.productLineId,
            data,
        )
            .then((response) => {
                if (response[BaseResponseFields.HasError])
                    snackbarError(response[BaseResponseFields.ErrorDescription]);
                else {
                    snackbarSuccess('La línea fue enviada para publicar correctamente');
                    props.onSubmitDrawer();
                }
            })
            .finally(() => hideLoader());
    };

    return (
            <form id="line-publication-form" onSubmit={methods.handleSubmit(handleSubmit)}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <ControlledDatePicker
                            label={'Fecha de Publicación'}
                            control={methods.control}
                            name={RequestPublicationFields.DateToPublish}
                            minDate={minDate}
                            handleChange={(date: Date) => setStartDate(date)}
                            filled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ControlledDatePicker
                            label={'Fecha de Finalización'}
                            control={methods.control}
                            name={RequestPublicationFields.DateCancelPublication}
                            minDate={!!startDate ? startDate : minDate}
                            filled
                        />
                    </Grid>
                </Grid>
            </form>
    );
}

export default OffererLineRequestPublicationStepperDrawer;
