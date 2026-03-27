import {Box, Button, Card, Stack} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {stringFormatter} from 'util/formatters/stringFormatter';
import {useAction} from 'hooks/useAction';
import useAxios from 'hooks/useAxios';
import {DialogAlert} from 'components/dialog';
import {userStorage} from "util/localStorage/userStorage";
import {ValidationStatesType} from "types/person/personEnums";
import {UserInvitationFromCompany, UserInvitationFromCompanyFields} from "types/invitations/invitationData";
import {EntityWithIdFields} from 'types/baseEntities';
import {HttpInvitations} from 'http/invitations';
import {TypographyBase} from "components/misc/TypographyBase";

interface CompanyInvitesBoxProps {
  invite: UserInvitationFromCompany;
  onSubmit: () => void;
}

const CompanyInvitesAsResponsibleBox = ({
  invite,
  onSubmit
}: CompanyInvitesBoxProps) => {
  const { fetchData } = useAxios();
  const { snackbarSuccess, snackbarWarning, reloadUserSummary } = useAction();
  const [showConfirmOwnAccept, setShowConfirmOwnAccept] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(
      userStorage.getValidatedIdentityCode() === ValidationStatesType.PendingValidation
  );
  
  const handleAcceptClick = () => 
      invite[UserInvitationFromCompanyFields.CompanyCuit] === userStorage.getCuit() ?
          onOpenConfirmOwnAccept() :
          onOpenConfirmOwnAccept();
  
  const onCloseConfirmOwnAccept = () => setShowConfirmOwnAccept(false);
  const onOpenConfirmOwnAccept = () => setShowConfirmOwnAccept(true);
  const onCloseReject = () => setShowReject(false);
  const onOpenReject = () => setShowReject(true);

  const onReject = () =>
    fetchData(
      () => HttpInvitations.rejectInvitation(invite[EntityWithIdFields.Id]),
      true,
    ).then(() => {
      snackbarSuccess('La invitación fue rechazada correctamente');
      reloadUserSummary();
      onSubmit();
      onCloseReject();
    });
  
  const onAcceptOwnCompany = () => 
      userStorage.getValidatedIdentityCode() === ValidationStatesType.Validated ? 
          fetchData(
              () => HttpInvitations.acceptInvitationCompany(invite[EntityWithIdFields.Id]), 
              true
          ).then(onAfterAccept)
          :
          snackbarWarning('No puedes aceptar esta invitación hasta que se valide tu identidad');
  
  const onAfterAccept = () => {
    if (showConfirmOwnAccept) onCloseConfirmOwnAccept();
    snackbarSuccess('La invitación fue aceptada correctamente');
    onSubmit();
    reloadUserSummary();
  }
  
  useEffect(() => {
    const handleStorageUpdate = () => {
      const validateIdentityCode = userStorage.getValidatedIdentityCode();
      if (validateIdentityCode === ValidationStatesType.PendingValidation) {
        if (!pending) {
          onSubmit();
        }
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
                          <CompanyLogoById companyId={invite[UserInvitationFromCompanyFields.CompanyId]}
                                           isPhysicalPerson={invite[UserInvitationFromCompanyFields.CompanyPersonTypeCode] === PersonTypes.Physical}
                                           size={'lg'}
                          />

                          <Stack>
                              <TypographyBase variant={'h5'} tooltip maxLines={1}>
                                  {stringFormatter.toTitleCase(invite[UserInvitationFromCompanyFields.CompanyLegalName])}
                              </TypographyBase>
                              <TypographyBase variant={'button3'} fontWeight={400}>
                                  {stringFormatter.formatCuit(invite[UserInvitationFromCompanyFields.CompanyCuit])}
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
                              {`${stringFormatter.toTitleCase(invite[UserInvitationFromCompanyFields.UserWhoInvitesBusinessName])} te invitó para dar de alta esta PyME como ${invite[UserInvitationFromCompanyFields.UserRelationshipDesc]}.`}
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

                          {/*             
                            <ValidateIdentityHandle onClick={handleAcceptClick}>
                                <ConfirmButton color={'primary'} size={'small'}
                                    tooltipTitle={'Al aceptar estás dando de alta la empresa y validando el vínculo de quien te envió la solicitud. Podrás modificarlo desde “Roles”, ingresando a tu empresa.'}
                                >
                                    Aceptar
                                </ConfirmButton>
                            </ValidateIdentityHandle>
                          */}
                          
                          <Button variant={'contained'}
                                  color={'primary'}
                                  size={'small'}
                                  onClick={handleAcceptClick}
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

          <DialogAlert open={showConfirmOwnAccept}
                       title={'Aceptar invitación'}
                       textContent={'¿Estás seguro que deseás aceptar esta invitación?'}
                       children={'Al aceptar estás dando de alta la empresa y validando el vínculo de quien te envió la solicitud. Podrás modificarlo desde “Roles”, ingresando a tu empresa.'}
                       onClose={onCloseConfirmOwnAccept} 
                       onConfirm={onAcceptOwnCompany}
                       validateIdentity
                       waitValidationProcessing
          />
      </Box>
  );
};

export default CompanyInvitesAsResponsibleBox;
