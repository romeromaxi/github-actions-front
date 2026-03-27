import React, { useEffect } from 'react';
import DrawerBase from '../../../components/misc/DrawerBase';
import { CardContent, Stack, Button } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { InternalUserGroupUpdate, InternalUserGroupUpdateFields, UserSummary, UserSummaryFields } from '../../../types/user';
import { HttpCacheInternalUser } from '../../../http/cache/httpCacheUser';
import { BaseRequestFields, BaseResponseFields } from '../../../types/baseEntities';
import { HttpInternalUser } from '../../../http/user/httpInternalUser';
import useAxios from '../../../hooks/useAxios';
import { useSnackbarActions } from '../../../hooks/useSnackbarActions';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import {TextFieldFilled} from "../../../components/forms/StyledTextField";
import {ControlledMultipleSelectAsync} from "../../../components/forms/ControlledMultipleSelectAsync";
import { RequiredMultipleSelectSchema } from 'util/validation/validationSchemas';


interface InternalUserEditDrawerProps {
    open: boolean;
    onClose: (reloadUsers: boolean) => void;
    onReload: () => void;
    user?: UserSummary;
}


const InternalUserEditDrawer = ({
                                   open,
                                   onClose,
                                   onReload,
                                   user
                               }: InternalUserEditDrawerProps) => {
    const { fetchData } = useAxios();
    const { addSnackbarSuccess, addSnackbarError } = useSnackbarActions();

    const userGroupFormSchema = yup.object().shape({
        [InternalUserGroupUpdateFields.GroupIds]: RequiredMultipleSelectSchema,
    });

    const methods = useForm<InternalUserGroupUpdate>({
        resolver: yupResolver(userGroupFormSchema),
        defaultValues: {
            [InternalUserGroupUpdateFields.GroupIds]: [],
        }
    });

    useEffect(() => {
        if (open && user) {
            const groupIds = user[UserSummaryFields.GroupIds]
                ? user[UserSummaryFields.GroupIds].split(',').map(id => parseInt(id.trim(), 10))
                : [];
            
            methods.reset({
                [InternalUserGroupUpdateFields.GroupIds]: groupIds,
            });
        }
    }, [open, user]);

    const onSubmit = (data: InternalUserGroupUpdate) => {
        if (!user?.id) return;

        const submitData: InternalUserGroupUpdate = {
            ...data,
            [BaseRequestFields.ModuleCode]: 1,
            [BaseRequestFields.OriginCode]: 1,
        };

        fetchData(
            () => HttpInternalUser.updateGroups(user.id, submitData),
            true
        ).then((response) => {
            if (response && response[BaseResponseFields.HasError]) {
                addSnackbarError(response[BaseResponseFields.ErrorDescription]);
            } else {
                addSnackbarSuccess('Los grupos del usuario han sido actualizados con éxito.');
                onReload();
                onClose(true);
            }
        }).catch(() => {
            addSnackbarError('Al parecer hubo un error');
        });
    };

    return (
        <DrawerBase show={open}
                    onCloseDrawer={() => onClose(false)}
                    title={'Editar Usuario'}
                    action={
                        <Button variant="contained" onClick={methods.handleSubmit(onSubmit)}>
                            Guardar
                        </Button>
                    }
        >
            <CardContent sx={{ mt: 2 }}>
                <FormProvider {...methods}>
                    <Stack spacing={2}>
                        <TextFieldFilled
                            label="CUIT"
                            fullWidth
                            disabled
                            value={user?.[UserSummaryFields.Cuit] ? stringFormatter.formatCuit(user[UserSummaryFields.Cuit]) : ''}
                        />
                        <ControlledMultipleSelectAsync
                            id="internal-user-groups-edit-multiselect"
                            label="Grupos"
                            control={methods.control}
                            loadOptions={HttpCacheInternalUser.getGroups}
                            name={InternalUserGroupUpdateFields.GroupIds}
                            fullWidth
                        />
                    </Stack>
                </FormProvider>
            </CardContent>
        </DrawerBase>
    )
}


export default InternalUserEditDrawer;