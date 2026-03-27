import React, { useContext, useState } from 'react';

import { DialogAlert } from 'components/dialog';

import { EntityWithIdFields } from 'types/baseEntities';
import { Role, RoleFields } from 'types/company/rolesData';
import { CompanyUserRoleTypes } from 'types/company/companyEnums';

import { HttpCompanyRoles } from 'http/company/httpCompanyRoles';
import {Card, CardContent, Chip, Stack, Typography} from '@mui/material';
import { stringFormatter } from 'util/formatters/stringFormatter';
import { RolesListContext } from './CompanyRolesList';
import {
  ButtonIconDropdown, MenuItemDropdown,
} from 'components/buttons/Buttons';
import EditRoleInvitationDrawer from './components/EditRoleInvitationDrawer';
import useAxios from 'hooks/useAxios';
import { useAction } from 'hooks/useAction';
import { HttpCompanyRolesInvitation } from 'http/index';
import {useModuleNavigate} from "hooks/useModuleNavigate";
import {Module} from "types/form/login/login-enum";
import {WrapperIcons} from "components/icons/Icons";
import {MagnifyingGlass, PencilSimple, Trash, ShareFat} from "@phosphor-icons/react";
import {TypographyBase} from "components/misc/TypographyBase";
import {personFormatter} from "util/formatters/personFormatter";

interface RoleCardProps {
  role: Role;
  toBeConfirmed?: boolean;
}

export const RoleCardContext = React.createContext({
  role: {} as Role,
  toBeConfirmed: false,
});

function RoleCard({ role, toBeConfirmed }: RoleCardProps) {
  const { reloadRoles, onEdit } = useContext(RolesListContext);
  const [open, setOpen] = useState<boolean>(false);
  const [openForward, setOpenForward] = useState<boolean>(false);
  const moduleNavigate = useModuleNavigate(Module.Company);
  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();
  const forwardDisabled: boolean =
    !role[RoleFields.Mail] || role[RoleFields.Mail] === '';

  const onCloseForward = () => setOpenForward(false);

  const isResponsibleAfip: boolean =
    role[RoleFields.UserRelationshipCode] ===
    CompanyUserRoleTypes.ResponsibleAFIP;

  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  const onHandleEdit = () => {
    if (toBeConfirmed) setOpen(true);
    else onEdit(role);
  };

  const onShowConfirmDelete = () => setShowConfirmDelete(true);

  const onCancelDelete = () => setShowConfirmDelete(false);

  const renderTitle = () => {

    return (
        <Stack>
          <TypographyBase maxLines={1} tooltip variant={'h5'} fontWeight={500}>
            {personFormatter.getNameFromRole(role)}
          </TypographyBase>
          <Typography variant={'caption'} color={'text.lighter'}>
            {stringFormatter.formatCuit(role[RoleFields.CUIT])}
          </Typography>
          {
            toBeConfirmed &&
            <Typography variant={'subtitle2'} fontStyle={'italic'} fontWeight={400} color={'text.lighter'}>
              En espera de confirmación por el usuario
            </Typography>
          }
        </Stack>
    );
  };

  const onConfirmDelete = () => {
    if (toBeConfirmed) {
      fetchData(
        () =>
          HttpCompanyRolesInvitation.delete(
            role[RoleFields.CompanyId],
            role[EntityWithIdFields.Id],
          ),
        true,
      ).then(() => {
        setShowConfirmDelete(false);
        reloadRoles();
        if (role[RoleFields.IsOwnUser]) moduleNavigate()
      });
    } else {
      fetchData(
        () =>
          HttpCompanyRoles.deleteById(
            role[RoleFields.CompanyId],
            role[EntityWithIdFields.Id],
          ),
        true,
      ).then(() => {
        setShowConfirmDelete(false);
        reloadRoles();
        if (role[RoleFields.IsOwnUser]) moduleNavigate()
      });
    }
  };

  const onForward = () => {
    fetchData(
      () =>
        HttpCompanyRolesInvitation.forward(
          role[RoleFields.CompanyId],
          role[EntityWithIdFields.Id],
        ),
      true,
    ).then(() => {
      snackbarSuccess('La invitación se reenvió exitosamente');
      onCloseForward();
      reloadRoles();
    });
  };

  const onCloseEditInvitation = () => setOpen(false);

  const onSubmitEditInvitation = () => {
    onCloseEditInvitation();
    reloadRoles();
  };
  
  const getItems = () => {
    const list: MenuItemDropdown[] = []
    if (!isResponsibleAfip) {
      list.push({
        label: 'Editar',
        icon: <WrapperIcons Icon={PencilSimple} size={'sm'} />,
        onClick: onHandleEdit
      })
    } else {
      list.push({
        label: 'Ver',
        icon: <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />,
        onClick: onHandleEdit
      })
    }
    
    if (toBeConfirmed) {
      list.push({
        label: 'Reenviar invitación',
        icon: <WrapperIcons Icon={ShareFat} size={'sm'} />,
        onClick: () => setOpenForward(true),
        disable: forwardDisabled
      })
    }
    
    if (!isResponsibleAfip) {
      list.push({
        label: 'Eliminar',
        icon: <WrapperIcons Icon={Trash} size={'sm'} />,
        onClick: onShowConfirmDelete
      })
    }
    
    return list
  }

  return (
    <RoleCardContext.Provider
      value={{ role, toBeConfirmed: toBeConfirmed ?? false }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%' }}>
          <Stack
            justifyContent={'space-between'}
            sx={{ height: '100%' }}
            spacing={3}
          >
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              {renderTitle()}
              <Stack spacing={1} direction={'row'} alignItems={'center'}>
                <Chip size={'small'} color={'secondary'} label={role[RoleFields.UserRelationshipDesc]}/>
                <ButtonIconDropdown label={''}
                                    items={getItems()}
                                    size={'small'}
                />
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <DialogAlert
        open={showConfirmDelete}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        textContent={`¿Estás seguro que deseás eliminar ${
          toBeConfirmed
            ? `la invitación al usuario ${role[RoleFields.LegalName]}?`
            : `al usuario ${role[RoleFields.LegalName]}?`
        }`}
      />

      <EditRoleInvitationDrawer
        invitation={role}
        open={open}
        onClose={onCloseEditInvitation}
        onSubmit={onSubmitEditInvitation}
      />

      <DialogAlert
        onClose={onCloseForward}
        open={openForward}
        onConfirm={onForward}
        title={'Reenviar invitación'}
        textContent={`¿Estás seguro que deseás reenviar la invitación al mail ${role[RoleFields.Mail]}?`}
      />
    </RoleCardContext.Provider>
  );
}

export default RoleCard;
