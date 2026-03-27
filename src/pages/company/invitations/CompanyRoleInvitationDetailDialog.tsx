import {
  CompanyInvitationRoleNewFields,
  Role,
  RoleFields,
} from '../../../types/company/rolesData';
import { userStorage } from '../../../util/localStorage/userStorage';
import {
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect } from 'react';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import {
  CloseButton,
  ConfirmButton,
} from '../../../components/buttons/Buttons';
import { HttpCacheCompany, HttpCompanyRoles } from '../../../http';
import { AsyncSelect } from '../../../components/forms';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RequiredSelectSchema } from '../../../util/validation/validationSchemas';
import useAxios from 'hooks/useAxios';
import { useAction } from '../../../hooks/useAction';
import { EntityWithIdFields } from '../../../types/baseEntities';

interface CompanyRoleInvitationDetailDialogProps {
  open: boolean;
  onClose: () => void;
  companyId: number;
  role: Role;
  onReload: () => void;
}

export interface CompanyRoleInvitationDetailDialogForm {
  [CompanyInvitationRoleNewFields.UserRelationshipCompanyCode]: number;
}

const CompanyRoleInvitationDetailDialog = ({
  open,
  onClose,
  companyId,
  role,
  onReload,
}: CompanyRoleInvitationDetailDialogProps) => {
  const username = userStorage.getDisplayName();
  const userCompanyBondDesc =
    role[CompanyInvitationRoleNewFields.UserCompanyBondDesc] || '-';
  const { fetchData } = useAxios();
  const { snackbarSuccess, snackbarError } = useAction();

  const { control, handleSubmit, reset } =
    useForm<CompanyRoleInvitationDetailDialogForm>({
      resolver: yupResolver(
        yup.object().shape({
          [RoleFields.UserRelationshipCode]: RequiredSelectSchema,
        }),
      ),
    });
  const onAccept = (data: CompanyRoleInvitationDetailDialogForm) => {
    fetchData(
      () =>
        HttpCompanyRoles.acceptAtCompany(
          companyId,
          role[EntityWithIdFields.Id],
          data[CompanyInvitationRoleNewFields.UserRelationshipCompanyCode],
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
        HttpCompanyRoles.rejectAtCompany(
          companyId,
          role[EntityWithIdFields.Id],
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
    <Dialog open={open} onClose={onClose} maxWidth={'xs'} fullWidth>
      <DialogContent>
        <Stack direction={'row'} justifyContent={'end'}>
          <IconButton onClick={onClose} color={'secondary'} id={"company-role-invitation-detail-close-btn"}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack spacing={4} mt={2}>
          <Typography
            fontSize={23}
            fontWeight={600}
            textAlign={'center'}
          >{`Hola, ${username ?? ''}`}</Typography>
          <Typography
            component="div"
            color="text.disabled"
            sx={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}
          >
            <Typography component="span" fontWeight={600} color="#007aff">
              {role[RoleFields.LegalName]}
            </Typography>
            {` (`}
            <Typography component="span" fontWeight={600} color="#007aff">
              {userCompanyBondDesc.toUpperCase()}
            </Typography>
            {`) con CUIT: `}
            <Typography component="span" fontWeight={600} color="#007aff">
              {stringFormatter.formatCuit(role[RoleFields.CUIT])}
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
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-around'}
            pb={6}
          >
            <CloseButton onClick={onReject} size={'small'} id={"company-invitation-incorporation-reject-btn"}>
              Rechazar invitación
            </CloseButton>
            <ConfirmButton
              onClick={handleSubmit(onAccept)}
              color={'primary'}
              size={'small'}
              id={"company-invitation-incorporation-accept-btn"}
            >
              Aceptar invitación
            </ConfirmButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyRoleInvitationDetailDialog;
