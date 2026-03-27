import {
  CompanyInvitationUpdate,
  Role,
  RoleFields,
  RoleInvitationPostFields,
} from 'types/company/rolesData';
import {Stack} from '@mui/material';
import {AsyncSelect, ControlledTextFieldFilled} from 'components/forms';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { HttpCacheCompany, HttpCompanyRolesInvitation } from 'http/index';
import { CloseButton, SaveButton } from 'components/buttons/Buttons';
import { useAction } from 'hooks/useAction';
import { EntityWithIdFields } from 'types/baseEntities';
import useAxios from 'hooks/useAxios';
import DrawerBase from "components/misc/DrawerBase";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import {RequiredMailSchema, RequiredSelectSchema} from "util/validation/validationSchemas";

interface EditRoleInvitationDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  invitation: Role;
}

const EditRoleInvitationDrawer = ({
  open,
  onClose,
  onSubmit,
  invitation,
}: EditRoleInvitationDrawerProps) => {
  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();

  const assignEditRoleFormSchema = yup.object().shape({
    [RoleInvitationPostFields.UserRelationshipCode]: RequiredSelectSchema,
    [RoleInvitationPostFields.Mail]: RequiredMailSchema,
  });
  
  const methods = useForm<CompanyInvitationUpdate>({
      defaultValues: invitation,
      resolver: yupResolver(assignEditRoleFormSchema)
  });

  const loadRoleTypes = useCallback(() => {
    return HttpCacheCompany.getRolesTypes();
  }, []);

  const onCloseDrawer = () => {
    onClose();
    methods.reset(invitation);
  };

  const onSubmitForm = (data: CompanyInvitationUpdate) => {
    fetchData(
      () =>
        HttpCompanyRolesInvitation.update(
          invitation[RoleFields.CompanyId],
          invitation[EntityWithIdFields.Id],
          data,
        ),
      true,
    ).then(() => {
      snackbarSuccess('La invitación se actualizó correctamente');
      onSubmit();
    });
  };

  return (
      <DrawerBase show={open}
                  onCloseDrawer={onCloseDrawer}
                  title='Editar invitación'
                  action={
                      <Stack spacing={2} direction='row' alignItems='center'>
                          <CloseButton onClick={onCloseDrawer} variant='outlined' fullWidth>Cancelar</CloseButton>
                          <SaveButton onClick={methods.handleSubmit(onSubmitForm)} fullWidth>Confirmar</SaveButton>
                      </Stack>
                  }
      >
          <Stack spacing={1}>
              <AsyncSelect
                  label="Rol"
                  control={methods.control}
                  name={RoleInvitationPostFields.UserRelationshipCode}
                  loadOptions={loadRoleTypes}
                  fullWidth
                  optionsWithTooltip
              />
              
              <ControlledTextFieldFilled
                  label={'Mail'}
                  control={methods.control}
                  name={RoleInvitationPostFields.Mail}
                  fullWidth
              />
          </Stack>
      </DrawerBase>
  );
};

export default EditRoleInvitationDrawer;
