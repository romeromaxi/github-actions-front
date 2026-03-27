import {Box, Button, Card, Stack} from '@mui/material';
import {CompanyUserInvitation, CompanyUserInvitationFields} from 'types/user/userInvitation';
import React, {useEffect, useState} from 'react';
import {stringFormatter} from 'util/formatters/stringFormatter';
import {HttpUserInvitations} from 'http/user/httpUserInvitations';
import {EntityWithIdFields} from 'types/baseEntities';
import {useAction} from 'hooks/useAction';
import useAxios from 'hooks/useAxios';
import {DialogAlert} from 'components/dialog';
import {userStorage} from "util/localStorage/userStorage";
import {ValidationStatesType} from "types/person/personEnums";
import ValidateUserIdentityDialog from "../../user/components/ValidateUserIdentityDialog";
import {TypographyBase} from "components/misc/TypographyBase";
import {UserInvitationFromCompanyFields} from "../../../types/invitations/invitationData";


interface CompanyInvitesBoxProps {
  invite: CompanyUserInvitation;
  onSubmit: () => void;
}

const CompanyInvitesBox = ({
  invite, onSubmit
}: CompanyInvitesBoxProps) => {
  const { fetchData } = useAxios();
  const { snackbarSuccess, reloadUserSummary } = useAction();
  const [showValidateUser, setShowValidateUser] = useState<boolean>(false);
  const [showAccept, setShowAccept] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(
      userStorage.getValidatedIdentityCode() === ValidationStatesType.PendingValidation
  );
  
  const closeValidateUser = () => setShowValidateUser(false);
  const onCloseAccept = () => setShowAccept(false);
  const onOpenAccept = () => setShowAccept(true);
  const onCloseReject = () => setShowReject(false);
  const onOpenReject = () => setShowReject(true);
  
  const acceptInvitation = () =>
    fetchData(
      () => HttpUserInvitations.acceptInvitation(invite[EntityWithIdFields.Id]),
      true,
    ).then(() => {
      onCloseAccept();
      snackbarSuccess('La invitación fue aceptada correctamente');
      onSubmit();
      reloadUserSummary();
    });

  const onReject = () => {
    fetchData(
      () => HttpUserInvitations.rejectInvitation(invite[EntityWithIdFields.Id]),
      true,
    ).then(() => {
      snackbarSuccess('La invitación fue rechazada correctamente');
      reloadUserSummary();
      onSubmit();
      onCloseReject();
    });
  };
  
  useEffect(() => {
    const handleStorageUpdate = () => {
      const validateIdentityCode = userStorage.getValidatedIdentityCode();
      if (validateIdentityCode === ValidationStatesType.PendingValidation) {
        onCloseAccept();
        onSubmit();
      } else {
        setPending(false);
      }
    };

    const unsubscribe = userStorage.subscribe(handleStorageUpdate);
    return () => unsubscribe();
  }, []);

  return (
      <Box height={'100%'}>
          <Card variant={'card-button'}>
              <Stack spacing={1.875}
                     justifyContent={'space-between'}
                     height={1}
              >
                  {/*<Stack direction={{ xs: 'column-reverse', md: 'row' }}
                         justifyContent={'space-between'}
                         spacing={1}
                  >
                      <Stack direction={'row'} spacing={1.875}>
                          <CompanyLogoById companyId={invite[CompanyUserInvitationFields.CompanyId]}
                                           isPhysicalPerson={invite[CompanyUserInvitationFields.CompanyPersonTypeCode] === PersonTypes.Physical}
                                           size={'lg'}
                          />

                          <Stack>
                              <TypographyBase variant={'h5'} tooltip maxLines={1}>
                                  {stringFormatter.toTitleCase(invite[CompanyUserInvitationFields.CompanyBusinessName])}
                              </TypographyBase>
                              <TypographyBase variant={'button3'} fontWeight={400}>
                                  {stringFormatter.formatCuit(invite[CompanyUserInvitationFields.CompanyCuit])}
                              </TypographyBase>
                          </Stack>
                      </Stack>

                      <Stack alignItems={{ xs: 'center', md: 'end' }}>
                          <WrapperIcons Icon={MailIcon} size={'md'} color={themeColorDefinition.UIElements.texts.lighter} />
                      </Stack>
                  </Stack>*/}

                  <Stack spacing={1} justifyContent={'space-between'} height={1}>
                      <Stack spacing={0.5}>
                          <TypographyBase variant={'body1'} fontWeight={600}>
                              {`Tenés una nueva invitación para colaborar en ${invite[UserInvitationFromCompanyFields.CompanyLegalName]}`}
                          </TypographyBase>
                          <TypographyBase variant={'body3'}>
                              {`${stringFormatter.toTitleCase(invite[CompanyUserInvitationFields.OwnUserInvitationBusinessName])} quiere que te sumes a esta PyME con el rol de ${invite[CompanyUserInvitationFields.CompanyUserRelationshipDesc]}.`}
                          </TypographyBase>
                      </Stack>
                      
                      <Stack spacing={1.875}
                             direction={{ xs: 'column-reverse', md: 'row' }}
                      >
                          <Button color={'error'}
                                  size={'small'}
                                  onClick={onOpenReject}
                                  fullWidth
                          >
                              Rechazar
                          </Button>

                          <Button variant={'contained'}
                                  color={'primary'}
                                  size={'small'}
                                  onClick={onOpenAccept}
                                  fullWidth
                          >
                              Aceptar
                          </Button>
                      </Stack>
                  </Stack>
              </Stack>
          </Card>

          <DialogAlert open={showReject} 
                       title={'Rechazar invitación'} 
                       textContent={'¿Estás seguro que deseás rechazar esta invitación?'}
                       severity={'error'}
                       onClose={onCloseReject}
                       onConfirm={onReject}
          />

          <DialogAlert open={showAccept}
                       onClose={onCloseAccept} 
                       title={'Aceptar invitación'} 
                       textContent={'¿Estás seguro que deseás aceptar esta invitación?'}
                       children={'Al aceptar estás confirmando tu participación en la empresa y validando el rol que se te asignó. La empresa estará disponible en "Mis Empresas".'} 
                       onConfirm={acceptInvitation} 
                       validateIdentity
                       waitValidationProcessing
          />

          <ValidateUserIdentityDialog
              open={showValidateUser}
              onClose={closeValidateUser}
              onReload={acceptInvitation}
          />
      </Box>
  );
};

export default CompanyInvitesBox;
