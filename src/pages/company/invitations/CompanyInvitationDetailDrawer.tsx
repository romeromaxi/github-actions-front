import {
  CompanyInvitationRoleNew,
  CompanyInvitationRoleNewFields,
} from 'types/company/rolesData';
import { userStorage } from 'util/localStorage/userStorage';
import {
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { stringFormatter } from 'util/formatters/stringFormatter';
import {
  CloseButton,
  ConfirmButton,
} from 'components/buttons/Buttons';
import { HttpCacheCompany, HttpCompanyRolesInvitation } from 'http/index';
import { AsyncSelect } from 'components/forms';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RequiredSelectSchema } from 'util/validation/validationSchemas';
import useAxios from 'hooks/useAxios';
import { useAction } from 'hooks/useAction';
import { EntityWithIdFields } from 'types/baseEntities';
import DrawerBase from "components/misc/DrawerBase";

interface CompanyInvitationDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  companyId: number;
  invitation: CompanyInvitationRoleNew;
  onReload: () => void;
}

export interface CompanyInvitationDetailDrawerForm {
  [CompanyInvitationRoleNewFields.UserRelationshipCompanyCode]: number;
}

const CompanyInvitationDetailDrawer = ({
  open,
  onClose,
  companyId,
  invitation,
  onReload,
}: CompanyInvitationDetailDrawerProps) => {
  const username = userStorage.getDisplayName();
  const userCompanyBondDesc =
    invitation[CompanyInvitationRoleNewFields.UserCompanyBondDesc] || '-';
  const { fetchData } = useAxios();
  const { snackbarSuccess, snackbarError } = useAction();

  const { control, handleSubmit, reset } =
    useForm<CompanyInvitationDetailDrawerForm>({
      resolver: yupResolver(
        yup.object().shape({
          [CompanyInvitationRoleNewFields.UserRelationshipCompanyCode]:
            RequiredSelectSchema,
        }),
      ),
    });
  const onAccept = (data: CompanyInvitationDetailDrawerForm) => {
    fetchData(
      () =>
        HttpCompanyRolesInvitation.accept(
          companyId,
          invitation[EntityWithIdFields.Id],
          data,
        ),
      true,
    )
      .then(() => {
        snackbarSuccess('La invitación fue aceptada');
        onHandleClose(true);
      })
      .catch(() => snackbarError('Ocurrió un error al aceptar la invitación'));
  };

  const onReject = () => {
    fetchData(
      () =>
        HttpCompanyRolesInvitation.delete(
          companyId,
          invitation[EntityWithIdFields.Id],
        ),
      true,
    )
      .then(() => {
        snackbarSuccess('La invitación fue rechazada');
        onHandleClose(true);
      })
      .catch(() => snackbarError('Ocurrió un error al rechazar la invitación'));
  };

  const onHandleClose = (reload: boolean = false) => {
    onClose();
    if (reload) onReload();
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  return (
      <DrawerBase show={open}
                  onCloseDrawer={onClose}
                  action={
        <Stack spacing={1}>
          <CloseButton onClick={onReject} variant={'text'} id={"company-invitation-incorporation-reject-btn"}>
            Rechazar invitación
          </CloseButton>
          <ConfirmButton
              onClick={handleSubmit(onAccept)}
              color={'primary'}
              id={"company-invitation-incorporation-accept-btn"}
          >
            Aceptar invitación
          </ConfirmButton>
        </Stack>
                  }
      >
          <Stack spacing={4}>
            <Typography
              fontSize={23}
              fontWeight={600}
              textAlign={'center'}
            >{`Hola, ${username || ''}`}</Typography>
            <Typography
              component="div"
              color="text.disabled"
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              <Typography component="span" fontWeight={600} color="#007aff">
                {invitation[CompanyInvitationRoleNewFields.BusinessName]}
              </Typography>
              {` (`}
              <Typography component="span" fontWeight={600} color="#007aff">
                {userCompanyBondDesc.toUpperCase()}
              </Typography>
              {`) con CUIT: `}
              <Typography component="span" fontWeight={600} color="#007aff">
                {stringFormatter.formatCuit(
                  invitation[CompanyInvitationRoleNewFields.CUIT],
                )}
              </Typography>
              {` te ha enviado una solicitud para incorporarse al equipo de trabajo`}
            </Typography>
            <AsyncSelect
              label="Ocupando el rol de"
              control={control}
              name={CompanyInvitationRoleNewFields.UserRelationshipCompanyCode}
              loadOptions={HttpCacheCompany.getRolesTypes}
              fullWidth
              required
            />
          </Stack>
      </DrawerBase>
  );
};

export default CompanyInvitationDetailDrawer;
