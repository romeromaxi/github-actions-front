import {
    AllUsersInternalFilter,
    UserCompanyFields,
    UserSummary,
    UserSummaryFields,
    UserTypeCodes
} from "../../../types/user";
import {EntityPagination, EntityPaginationFields} from "../../../types/baseEntities";
import React, {Fragment, useState} from "react";
import {ITableColumn, Pagination, TableColumnType, TableList} from "../../../components/table";
import {Card, CardActions, Chip, Stack, Typography} from "@mui/material";
import {stringFormatter} from "../../../util/formatters/stringFormatter";
import {WrapperIcons} from "../../../components/icons/Icons";
import {ButtonIconDropdown, MenuItemDropdown} from "../../../components/buttons/Buttons";
import {ArrowsClockwise} from "@phosphor-icons/react";
import InternalUserRecoveryPasswordDrawer from "./InternalUserRecoveryPasswordDrawer";
import {UserTypeColorMap} from "../../../util/typification/internalUserColors";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {PencilIcon} from "lucide-react";
import InternalUserEditDrawer from "./InternalUserEditDrawer";


interface InternalUsersTableListProps {
    loading: boolean;
    users?: UserSummary[];
    pagination?: EntityPagination;
    searchUsers: (arg: AllUsersInternalFilter) => void;
    prevFilter: AllUsersInternalFilter;
}

const InternalUsersTableList = ({
                                    loading,
                                    users,
                                    pagination,
                                    searchUsers,
                                    prevFilter,
                                } : InternalUsersTableListProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [userDetail, setUserDetail] = useState<UserSummary>();
    const onPaging = (page: number) => {
        const filter: AllUsersInternalFilter = {
            ...prevFilter,
            [EntityPaginationFields.ActualPage]: page,
        };

        searchUsers(filter);
    };
    
    const onOpenRecoveryPassword = (user: UserSummary) => {
        setOpen(true)
        setUserDetail(user)
    }
    
    const onCloseRecoveryPassword = (reloadUsers: boolean) => {
        setOpen(false)
        setUserDetail(undefined);
        if (reloadUsers) searchUsers(prevFilter);
    }
    
    const onOpenEdit = (user: UserSummary) => {
        const groupIds = user.idsGrupo
            ? user.idsGrupo.split(',').map((id) => parseInt(id.trim(), 10))
            : [];

        setUserDetail({ ...user, groupIds });
        setOpenEdit(true);
    }
    
    
    const onCloseEdit = (reloadUsers: boolean) => {
        setOpenEdit(false);
        setUserDetail(undefined);
        if (reloadUsers) searchUsers(prevFilter);
    }
    
    
    const getDropdownActions = (user: UserSummary) => {
        const items: MenuItemDropdown[] = []
        
        if (user[UserSummaryFields.UserTypeCode] === UserTypeCodes.Internal)
            items.push({
                label: 'Editar',
                icon: <WrapperIcons Icon={PencilIcon} size='sm'/>,
                onClick: () => onOpenEdit(user)
            })
        
        items.push({
            label: 'Restablecer contraseña',
            icon: <WrapperIcons Icon={ArrowsClockwise} size='sm'/>,
            onClick: () => onOpenRecoveryPassword(user)
        })
        
        return items;
    }

    const columns: ITableColumn[] = [
        { 
            label: 'Razón Social', 
            textAlign: 'left',
            value: UserSummaryFields.Fullname,
            onRenderCell: (user: UserSummary) => (
                <Stack>
                    <Typography>{user[UserSummaryFields.Fullname]}</Typography>
                    <TypographyBase variant={'caption'} fontWeight={400} color={'text.lighter'}>
                        {stringFormatter.formatCuit(user[UserSummaryFields.Cuit])}
                    </TypographyBase>
                </Stack>
            )
        },
        {
            label: 'Mail',
            value: UserSummaryFields.Mail
        },
        {
            label: 'Tipo de usuario',
            value: UserSummaryFields.UserTypeDesc,
            onRenderCell: (user: UserSummary) => (
                <Chip label={user[UserSummaryFields.UserTypeDesc]}
                      sx={{
                          color: UserTypeColorMap[user[UserSummaryFields.UserTypeCode]].dark,
                          backgroundColor: UserTypeColorMap[user[UserSummaryFields.UserTypeCode]].light,
                      }}
                      size='small'
                      variant='filled'
                />
            )
        },
        
        {
            label: 'Última modif. contraseña',
            value: UserSummaryFields.PasswordLastModifyDate,
            type: TableColumnType.Date
        },
        {
            label: 'Último acceso',
            value: UserCompanyFields.LastAccessDate,
            type: TableColumnType.Date
        },
        {
            label: '',
            onRenderCell: (user: UserSummary) => (
                <ButtonIconDropdown label={''}
                                    items={getDropdownActions(user)}
                                    size='small'
                />
            )
        }
    ];


    return (
        <Fragment>
            <Card>
                <TableList<UserSummary>
                    entityList={users}
                    columns={columns}
                    isLoading={loading}
                    error={false}
                />
                <CardActions>
                    <Pagination
                        entityPagination={pagination}
                        isLoading={loading}
                        onPaging={onPaging}
                    />
                </CardActions>
            </Card>
            {
                !!userDetail &&
                <InternalUserRecoveryPasswordDrawer user={userDetail}
                                                    open={open}
                                                    onClose={onCloseRecoveryPassword}
                />
            }
            {
                !!userDetail &&
                <InternalUserEditDrawer open={openEdit}
                                        onClose={onCloseEdit}
                                        onReload={() => searchUsers(prevFilter)}
                                        user={userDetail}
                />
            }
        </Fragment>
    );
}



export default InternalUsersTableList