import React, {useState} from 'react';
import {UserInvitationFromCompany, UserInvitationFromCompanyFields} from 'types/invitations/invitationData';
import {Box, Button, Card, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";
import {EntityWithIdFields} from "types/baseEntities";
import useAxios from "hooks/useAxios";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import {HttpUserInvitations} from "http/user/httpUserInvitations";
import {DialogAlert} from "components/dialog";

interface CompanySentInvitesCardProps {
  invite: UserInvitationFromCompany;
  onSubmit?: () => void
}

const CompanySentInvitesCard = ({ invite, onSubmit }: CompanySentInvitesCardProps) => {
    const { fetchData } = useAxios();
    const { addSnackbarSuccess } = useSnackbarActions();
    const [showCancelInvitation, setShowCancelInvitation] = useState<boolean>(false);

    const onOpenCancelInvitation = () => setShowCancelInvitation(true);
    
    const onCloseCancelInvitation = () => setShowCancelInvitation(false);
    
    const onCancelInvitation = () => {
        fetchData(
            () => HttpUserInvitations.cancelInvitation(invite[EntityWithIdFields.Id]),
            true,
        ).then(() => {
            addSnackbarSuccess('La invitación fue cancelada correctamente');
            onSubmit && onSubmit();
        });
    };
    
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
                                 
                              </TypographyBase>
                              <TypographyBase variant={'button3'} fontWeight={400}>
                                  {stringFormatter.formatCuit(invite[UserInvitationFromCompanyFields.CompanyCuit])}
                              </TypographyBase>
                          </Stack>
                      </Stack>

                      <Stack alignItems={{ xs: 'center', md: 'end' }}>
                          <WrapperIcons Icon={ClockIcon} size={'md'} color={themeColorDefinition.UIElements.texts.lighter} />
                      </Stack>
                  </Stack>*/}

                  <Stack spacing={1} justifyContent={'space-between'} height={1}>
                      <Stack spacing={0.5}>
                          <TypographyBase variant={'body1'}
                                          fontWeight={600}
                          >
                              {`Enviaste una solicitud para unirte a ${stringFormatter.toTitleCase(invite[UserInvitationFromCompanyFields.CompanyLegalName])}`}
                          </TypographyBase>
                          <TypographyBase variant={'body3'}>
                              Podrás acceder cuando sea aceptada
                          </TypographyBase>
                      </Stack>

                      <Stack spacing={1.875}
                             direction={{ xs: 'column-reverse', md: 'row' }}
                      >
                          <Button color={'error'}
                                  size={'small'}
                                  //startIcon={<XIcon />}
                                  onClick={onOpenCancelInvitation}
                                  fullWidth
                          >
                              Cancelar solicitud
                          </Button>
                      </Stack>
                  </Stack>
              </Stack>
          </Card>

          <DialogAlert open={showCancelInvitation}
                       title={'Cancelar solicitud'}
                       textContent={'¿Estás seguro que deseás cancelar esta solicitud?'}
                       severity={'error'}
                       onClose={onCloseCancelInvitation}
                       onConfirm={onCancelInvitation}
          />
      </Box>
  );
};

export default CompanySentInvitesCard;
