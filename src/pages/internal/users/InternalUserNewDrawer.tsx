import { FormProvider, useForm } from "react-hook-form";
import DrawerBase from "../../../components/misc/DrawerBase";
import React, { useEffect, useState } from "react";
import { InternalUserCreate, InternalUserCreateFields } from "../../../types/user";
import { BaseRequestFields, BaseResponseFields } from "../../../types/baseEntities";
import useAxios from "../../../hooks/useAxios";
import { HttpInternalUser } from "../../../http/user/httpInternalUser";
import { useSnackbarActions } from "../../../hooks/useSnackbarActions";
import InternalUserNewForm from "./InternalUserNewForm";
import InternalUserNewConfirmData from "./InternalUserNewConfirmData";
import { Stack, CardContent } from "@mui/material";
import { NosisMainDataResponse, NosisMainDataResponseFields } from "../../../types/person/personData";
import { HttpPersonNosis } from "../../../http";
import { PersonTypes } from "../../../types/person/personEnums";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    RequiredCuitSchema,
    RequiredMailSchema,
    RequiredMultipleSelectSchema
} from "../../../util/validation/validationSchemas";
import { DefaultStylesButton } from "../../../components/buttons/Buttons";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {ModuleCodes} from "../../../types/general/generalEnums";


interface InternalUserNewDrawerProps {
    open: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

interface InternalUserNewContextType {
    nosisMainData: NosisMainDataResponse | undefined;
    setNosisMainData: (dataNosis: NosisMainDataResponse | undefined) => void;
    confirmedMainData: boolean;
    setConfirmedMainData: (isConfirm: boolean) => void;
    loadingNosis: boolean;
}

export const InternalUserNewContext = React.createContext<InternalUserNewContextType>({
    nosisMainData: undefined,
    setNosisMainData: () => {},
    confirmedMainData: false,
    setConfirmedMainData: () => {},
    loadingNosis: false,
});

const InternalUserNewDrawer = ({
                                   open,
                                   onClose,
                                   onUserCreated
                               }: InternalUserNewDrawerProps) => {
    const { fetchData } = useAxios();
    const { addSnackbarSuccess, addSnackbarError } = useSnackbarActions();
    const [confirmedMainData, setConfirmedMainData] = useState<boolean>(false);
    const [nosisMainData, setNosisMainData] = useState<NosisMainDataResponse>();
    const [userInvitation, setUserInvitation] = useState<InternalUserCreate>();
    const [loadingNosis, setLoadingNosis] = useState<boolean>(false);

    const internalUserFormSchema = yup.object().shape({
        [InternalUserCreateFields.CUIT]: RequiredCuitSchema,
        [InternalUserCreateFields.GroupIds]: RequiredMultipleSelectSchema,
        [InternalUserCreateFields.Mail]: RequiredMailSchema,
    });

    const methods = useForm<InternalUserCreate>({
        resolver: yupResolver(internalUserFormSchema),
        defaultValues: {
            [InternalUserCreateFields.GroupIds]: [],
        }
    });

    const resetForm = () => {
        setNosisMainData(undefined);
        setConfirmedMainData(false);
        setUserInvitation(undefined);
        setLoadingNosis(false);
        methods.reset({
            [InternalUserCreateFields.CUIT]: '',
            [InternalUserCreateFields.Mail]: '',
            [InternalUserCreateFields.GroupIds]: [],
        });
    };

    const onHandleClose = () => {
        onClose();
        resetForm();
    };

    const onSynchronizeWithNosis = (data: InternalUserCreate) => {
        setUserInvitation(undefined);

        if (!data[InternalUserCreateFields.CUIT]) {
            return;
        }

        setLoadingNosis(true);

        HttpPersonNosis.synchronizeWithNosisMainData(
            data[InternalUserCreateFields.CUIT], ModuleCodes.UserRegistration
        )
            .then((nosisData) => {
                if (nosisData[NosisMainDataResponseFields.Valid]) {
                    if (
                        nosisData[NosisMainDataResponseFields.PersonTypeCode] ===
                        PersonTypes.Physical
                    ) {
                        setNosisMainData(nosisData);
                        setUserInvitation(data);
                    }
                }
            })
            .finally(() => {
                setLoadingNosis(false);
            });
    };

    useEffect(() => {
        if (nosisMainData && confirmedMainData && userInvitation) {
            setLoadingNosis(true);
            
            HttpPersonNosis.synchronizeWithNosisAndGetPersonId(
                userInvitation[InternalUserCreateFields.CUIT]!, ModuleCodes.UserRegistration
            )
                .then((response) => {
                    const submitData: InternalUserCreate = {
                        [InternalUserCreateFields.Mail]: userInvitation[InternalUserCreateFields.Mail],
                        [InternalUserCreateFields.GroupIds]: userInvitation[InternalUserCreateFields.GroupIds],
                        [InternalUserCreateFields.PersonId]: response.idPersona,
                        [BaseRequestFields.ModuleCode]: 1,
                        [BaseRequestFields.OriginCode]: 1,
                    };

                    return fetchData(
                        () => HttpInternalUser.create(submitData),
                        true
                    )
                })
                .then((response) => {
                    if (response && response[BaseResponseFields.HasError]) {
                        addSnackbarError(response[BaseResponseFields.ErrorDescription]);
                        setConfirmedMainData(false);
                    } else {
                        addSnackbarSuccess('El usuario ha sido creado con éxito.');
                        onUserCreated();
                        onHandleClose();
                    }
                })
                .catch(() => {
                    setNosisMainData(undefined);
                    setConfirmedMainData(false);
                })
                .finally(() => {
                    setLoadingNosis(false);
                });
        }
    }, [nosisMainData, confirmedMainData, userInvitation]);

    return (
        <DrawerBase
            show={open}
            onCloseDrawer={onHandleClose}
            title={'Nuevo Usuario Interno'}
            action={
                !nosisMainData ? (
                    <DefaultStylesButton
                        endIcon={<KeyboardDoubleArrowRightIcon />}
                        onClick={methods.handleSubmit(onSynchronizeWithNosis)}
                        disabled={loadingNosis}
                    >
                        {loadingNosis ? 'Sincronizando...' : 'Sincronizar'}
                    </DefaultStylesButton>
                ) : (
                    <></>
                )
            }
        >
            <CardContent sx={{ mt: 2 }}>
                <InternalUserNewContext.Provider
                    value={{
                        nosisMainData,
                        setNosisMainData,
                        confirmedMainData,
                        setConfirmedMainData,
                        loadingNosis,
                    }}
                >
                    <Stack spacing={2}>
                        <FormProvider {...methods}>
                            <InternalUserNewForm />
                        </FormProvider>
                        <InternalUserNewConfirmData />
                    </Stack>
                </InternalUserNewContext.Provider>
            </CardContent>
        </DrawerBase>
    )
}


export default InternalUserNewDrawer;
