import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {useAction} from 'hooks/useAction';
import {yupResolver} from '@hookform/resolvers/yup';

import {SendButton} from 'components/buttons/Buttons';
import ControlledPin from 'components/forms/ControlledPin';
import {Box, Stack} from '@mui/material';
import {RequiredMailSchema, RequiredPinSchema} from 'util/validation/validationSchemas';
import {HttpAuth} from 'http/index';
import {PinGenerationRequestFields, PinValidationRequestFields,} from 'types/user';
import DrawerBase from 'components/misc/DrawerBase';
import MailChangeForm, {MailChangeFormData,} from '../PersonalData/MailChangeForm';
import {BaseResponseFields} from 'types/baseEntities';
import { useMediaQuery, useTheme } from '@mui/system';

export enum PinFormFields {
    ReferentialData = 'referentialData',
    PIN = 'PIN',
}

type PinFormData = {
    [PinFormFields.ReferentialData]: string;
    [PinFormFields.PIN]: string;
};

interface PinFormNewProps {
    referentialData: string;
    onPinConfirmed: (data: PinFormData) => void;
    initConfirmed?: boolean;
    isMobile?: boolean;
    onReferentialDataChange?: (newReferentialData: string) => void;
    refreshPin?: boolean;
    openMailDrawer: boolean;
    setOpenMailDrawer: (arg: boolean) => void;
    onFinishComplete?: () => void;
}

function PinFormNew({
                     referentialData,
                     onPinConfirmed,
                     initConfirmed,
                     isMobile,
                     onReferentialDataChange,
    refreshPin,
    openMailDrawer, setOpenMailDrawer, onFinishComplete
                 }: PinFormNewProps) {
    const theme = useTheme();
    const isMediumScreenSize = useMediaQuery(theme.breakpoints.down("md"));

    const { snackbarError, snackbarSuccess, showLoader, hideLoader } =
        useAction();

    const [pinConfirmed, setPinConfirmed] = useState(!!initConfirmed);
    const mailPinFormSchema = yup.object().shape({
        [PinFormFields.ReferentialData]: RequiredMailSchema,
        [PinFormFields.PIN]: RequiredPinSchema,
    });
    const { control, getValues, setValue, handleSubmit } = useForm<PinFormData>({
        defaultValues: {
            [PinFormFields.ReferentialData]: referentialData,
        },
        resolver: yupResolver(mailPinFormSchema),
    });

    const authMethod = HttpAuth.mailPinValidation

    const refreshMethod =HttpAuth.mailPinGeneration

    const closeDrawer = () => setOpenMailDrawer(false);

    const onRefreshPin = () => {
        refreshMethod({
            [PinGenerationRequestFields.ReferentialData]: getValues(
                PinFormFields.ReferentialData,
            ),
        })
            .then(() => {
                snackbarSuccess('PIN generado correctamente');
                setPinConfirmed(false);
            })
            .catch((error) => {
                snackbarError(error.message);
            });
    };

    useEffect(() => {
        if (refreshPin) 
            onRefreshPin();
    }, [refreshPin]);

    const onSubmit = (data: PinFormData) => {
        const { PIN } = data;
        showLoader();
        authMethod({
            [PinValidationRequestFields.PIN]: PIN,
        })
            .then((response) => {
                if (response[BaseResponseFields.HasError]) {
                    snackbarError(response[BaseResponseFields.ErrorDescription]);
                } else {
                    setPinConfirmed(true);
                    onPinConfirmed(data);
                    if (onFinishComplete) {
                        setTimeout(() => {
                            onFinishComplete();
                        }, 100);
                    }
                }
            })
            .catch(() => snackbarError('Un error ocurrió'))
            .finally(() => hideLoader());
    };

    const onMailChanged = (data: MailChangeFormData) => {
        setValue(PinFormFields.ReferentialData, data.mail);
        onRefreshPin();
        setOpenMailDrawer(false);
        onReferentialDataChange && onReferentialDataChange(data.mail);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} id="pin-new-mail-form">
            {isMobile ?
                <Stack direction={'column'} spacing={2}>
                    {!pinConfirmed && (
                        <Stack
                            direction={'column'}
                            alignItems={'center'}
                            spacing={1}
                        >
                                <Stack direction={'row'} spacing={1} sx={{ width: isMobile ? 'auto' : 'auto' }}>
                                    <ControlledPin control={control} name={PinFormFields.PIN} sx={{ width: isMobile ? '20%' : 'auto' }} />
                                </Stack>
                        </Stack>
                    )}
                </Stack>
                :
                <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems={'center'}>
                    {!pinConfirmed && (
                        <Stack
                            direction={isMobile ? 'column' : 'row'}
                            alignItems={'center'}
                            spacing={1}
                            sx={{ width: isMobile ? '100%' : 'auto' }}
                        >
                            <ControlledPin control={control} name={PinFormFields.PIN} sx={{ width: isMobile ? '20%' : 'auto' }} />
                        </Stack>
                    )}
                </Stack>
            }
            <DrawerBase show={openMailDrawer} title={'Cambio de Email'} onCloseDrawer={closeDrawer}
                        action={<SendButton type="submit" form="pin-mail-change-form" fullWidth>Enviar</SendButton>}
            >
                <Box mt={3}>
                    <MailChangeForm onMailChanged={onMailChanged} />
                </Box>
            </DrawerBase>
        </form>
    );

}

export default PinFormNew;
