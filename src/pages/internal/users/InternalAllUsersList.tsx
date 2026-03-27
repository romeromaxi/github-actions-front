import {Card, CardContent, Grid, Stack} from "@mui/material";
import {ControlledTextFieldFilled} from "../../../components/forms";
import {AddButton, SearchButton} from "../../../components/buttons/Buttons";
import React, {useEffect, useState} from "react";
import {
    EntityListWithPagination,
    EntityListWithPaginationFields,
    EntityPaginationFields
} from "../../../types/baseEntities";
import {
    AllUsersInternalFilter,
    AllUsersInternalFilterFields,
    UserCompanyFilterFields,
    UserSummary
} from "../../../types/user";
import {useForm} from "react-hook-form";
import {HttpInternalUser} from "../../../http/user/httpInternalUser";
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {UsersThree} from "phosphor-react";
import InternalUsersTableList from "./InternalUsersTableList";
import {ControlledMultipleSelectAsync} from "../../../components/forms/ControlledMultipleSelectAsync";
import {HttpOfferer} from "../../../http";
import {HttpCacheUser} from "../../../http/cache/httpCacheUser";
import InternalUserNewDrawer from "./InternalUserNewDrawer";


export const InternalAllUsersList = () => {
    const [filter, setFilter] =
        useState<AllUsersInternalFilter>({
            [UserCompanyFilterFields.BusinessName]: '',
            [UserCompanyFilterFields.CUIT]: '',
            [AllUsersInternalFilterFields.Mail]: '',
            [AllUsersInternalFilterFields.UserTypeCodes]: [],
            [AllUsersInternalFilterFields.OffererIds]: [],
            [EntityPaginationFields.PageSize]: 10,
            [EntityPaginationFields.ActualPage]: 1,
        });
    const [users, setUsers] =
        useState<EntityListWithPagination<UserSummary>>();
    const [loading, setLoading] = useState<boolean>(false);
    const [openNew, setOpenNew] = useState<boolean>(false);

    const { control, handleSubmit } = useForm<AllUsersInternalFilter>({
        defaultValues: { ...filter },
    });

    const searchUsers = (currentFilter: AllUsersInternalFilter) => {
        setLoading(true);
        HttpInternalUser.getAllUsersBySearch(currentFilter).then((r) => {
            setUsers(r);
            setLoading(false);
        });
    };

    useEffect(() => {
        searchUsers(filter);
    }, []);

    const onSubmit = (data: AllUsersInternalFilter) => {
        setFilter(data);
        searchUsers(data);
    };

    return (
        <Stack spacing={3}>
            <TabSectionCardHeader icon={UsersThree}
                                  sectionTitle={'Administrador de usuarios'}
                                  actions={<AddButton onClick={() => setOpenNew(true)}>Nuevo</AddButton>}
            />
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container alignItems={'center'} spacing={2}>
                            <Grid item md={4} xs={6}>
                                <ControlledTextFieldFilled
                                    control={control}
                                    label={'Razón Social'}
                                    name={UserCompanyFilterFields.BusinessName}
                                />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ControlledTextFieldFilled
                                    control={control}
                                    label={'CUIT'}
                                    name={UserCompanyFilterFields.CUIT}
                                />
                            </Grid>
                            <Grid item md={3.5} xs={6}>
                                <ControlledTextFieldFilled
                                    control={control}
                                    label={'Mail'}
                                    name={AllUsersInternalFilterFields.Mail}
                                />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ControlledMultipleSelectAsync control={control}
                                                               label={'Tipos de usuario'}
                                                               name={AllUsersInternalFilterFields.UserTypeCodes}
                                                               id={'internal-user-type-mulSelect'}
                                                               fullWidth
                                                               loadOptions={HttpCacheUser.getTypes}
                                />
                            </Grid>
                            <Grid item md={6} xs={6}>
                                <ControlledMultipleSelectAsync control={control}
                                                               label={'Oferentes'}
                                                               name={AllUsersInternalFilterFields.OffererIds}
                                                               id={'internal-users-offererCods-mulSelect'}
                                                               fullWidth
                                                               loadOptions={HttpOfferer.getActiveOffererListForMulSel}
                                />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <SearchButton type={'submit'} id={'search-allUsers-internal'}>
                                    Buscar
                                </SearchButton>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
            <InternalUsersTableList loading={loading}
                                    users={users?.[EntityListWithPaginationFields.List]}
                                    searchUsers={searchUsers}
                                    prevFilter={filter}
                                    pagination={users?.[EntityListWithPaginationFields.Pagination]}
            />
            <InternalUserNewDrawer open={openNew}
                                   onClose={() => setOpenNew(false)}
                                   onUserCreated={() => searchUsers(filter)}
            />
        </Stack>
    )
}


export default InternalAllUsersList