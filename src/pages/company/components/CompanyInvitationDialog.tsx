import {
  CompanyUserInvitation,
  CompanyUserInvitationFields,
} from 'types/user/userInvitation';
import {
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { CloseButton, ConfirmButton } from 'components/buttons/Buttons';
import { HttpUserInvitations } from 'http/user/httpUserInvitations';
import { EntityWithIdFields } from 'types/baseEntities';
import { useAction } from 'hooks/useAction';
import { stringFormatter } from 'util/formatters/stringFormatter';
import useAxios from 'hooks/useAxios';
import React, { useState } from 'react';
import { userStorage } from 'util/localStorage/userStorage';
import { HttpUser } from 'http/index';
import CloseIcon from '@mui/icons-material/Close';
import { UserModelViewFields } from '../../../types/user';
import { ValidationStatesType } from '../../../types/person/personEnums';
import ValidateUserIdentityDialog from "../../user/components/ValidateUserIdentityDialog";

interface CompanyInvitationDialogProps {
  open: boolean;
  onClose: () => void;
  onReloadAccept: () => void;
  onReloadReject: () => void;
  invitation: CompanyUserInvitation;
}

const CompanyInvitationDialog = ({
  open,
  onClose,
  onReloadAccept,
  onReloadReject,
  invitation,
}: CompanyInvitationDialogProps) => {
  const { fetchData } = useAxios();
  const { showLoader, hideLoader } = useAction();
  const username = userStorage.getFullName();
  const { snackbarSuccess, reloadUserSummary } = useAction();

  const [showValidateUser, setShowValidateUser] = useState<boolean>(false);

  const closeValidateUser = () => setShowValidateUser(false);

  const acceptInvitation = () =>
    HttpUser.getValidateIdentity().then((response) => {
      const statusCode =
        response[UserModelViewFields.ValidationIdentityStatusCode];
      userStorage.setValidatedIdentityCode(statusCode);
      if (statusCode == ValidationStatesType.Validated) {
        fetchData(
          () =>
            HttpUserInvitations.acceptInvitation(
              invitation[EntityWithIdFields.Id],
            ),
          true,
        ).then(() => {
          snackbarSuccess('La invitación fue aceptada correctamente');
          reloadUserSummary();
          onReloadAccept();
          onClose();
        });
      } else {
        onClose();
      }
    });

  const onAccept = () => {
    if (userStorage.hasValidatedIdentity()) {
      acceptInvitation();
    } else {
      showLoader();
      HttpUser.getValidateIdentity()
        .then((r) => {
          if (
            r[UserModelViewFields.ValidationIdentityStatusCode] ===
            ValidationStatesType.Validated
          ) {
            acceptInvitation();
          } else {
            setShowValidateUser(true);
          }
        })
        .finally(() => hideLoader());
    }
  };

  const onReject = () => {
    fetchData(
      () =>
        HttpUserInvitations.rejectInvitation(invitation[EntityWithIdFields.Id]),
      true,
    ).then(() => {
      snackbarSuccess('La invitación fue rechazada correctamente');
      reloadUserSummary();
      onReloadReject();
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'xs'} fullWidth>
      <DialogContent>
        <Stack direction={'row'} justifyContent={'end'}>
          <IconButton onClick={onClose} color={'secondary'}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack spacing={7} mt={2}>
          <Typography
            fontSize={23}
            fontWeight={600}
            textAlign={'center'}
          >{`Hola, ${username?.replace(',', ' ')}`}</Typography>
          <Typography
            component="div"
            color="text.disabled"
            sx={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}
          >
            <Typography component="span" fontWeight={600} color="#007aff">
              {
                invitation[
                  CompanyUserInvitationFields.OwnUserInvitationBusinessName
                ]
              }
            </Typography>
            {` Te ha invitado para cumplir el rol de `}
            <Typography component="span" fontWeight={600} color="#007aff">
              {invitation[
                CompanyUserInvitationFields.CompanyUserRelationshipDesc
              ].toUpperCase()}
            </Typography>
            {` en el repositorio de `}
            <Typography component="span" fontWeight={600} color="#007aff">
              {invitation[CompanyUserInvitationFields.CompanyBusinessName]}
            </Typography>
            {` con CUIT: `}
            <Typography component="span" fontWeight={600} color="#007aff">
              {stringFormatter.formatCuit(
                invitation[CompanyUserInvitationFields.CompanyCuit],
              )}
            </Typography>
          </Typography>
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-around'}
            pb={6}
          >
            <CloseButton onClick={onReject} size={'small'}>
              Rechazar invitación
            </CloseButton>
            <ConfirmButton onClick={onAccept} color={'primary'} size={'small'}>
              Aceptar invitación
            </ConfirmButton>
          </Stack>
        </Stack>
      </DialogContent>

      <ValidateUserIdentityDialog
        open={showValidateUser}
        onClose={closeValidateUser}
        onReload={acceptInvitation}
      />
    </Dialog>
  );
};

export default CompanyInvitationDialog;
