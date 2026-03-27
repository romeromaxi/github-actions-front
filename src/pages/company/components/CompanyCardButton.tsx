import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Chip, Stack, Tooltip} from '@mui/material';
import {CompanyViewDTO, CompanyViewDTOFields,} from 'types/company/companyData';
import {EntityWithIdFields} from 'types/baseEntities';
import CompanyInviteThroughMailDrawer from './CompanyInviteThroughMailDrawer';
import CompanyAfipFormDrawer from './CompanyAfipFormDrawer';
import CompanyCardAction from './cardButton/CompanyCardAction';

import { BadgeAlertIcon, BellDotIcon, ClockIcon } from "lucide-react";


interface CompanyCardButtonProps {
  company: CompanyViewDTO;
  onReload: () => void;
}

function CompanyCardButton({ company, onReload }: CompanyCardButtonProps) {
  const navigate = useNavigate();
  const [openInviteResponsible, setOpenInviteResponsible] =
      useState<boolean>(false);
  const [openProveResponsibility, setOpenProveResponsibility] =
      useState<boolean>(false);
  const [showParentTooltip, setShowParentTooltip] = useState<boolean>(false);
  const [inProcess, setInProcess] = useState<boolean>(false)
  
  const handleChildMouseEnter = () => setShowParentTooltip(false);
  const handleChildMouseLeave = () => setShowParentTooltip(true);
  
  const temporaryAccess = company[CompanyViewDTOFields.AllowCompanyAccess] && !company[CompanyViewDTOFields.AllowFullAccess];

  const mailInvited = !!company[CompanyViewDTOFields.MailInvitationResponsible]

  const onNavigateRole = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}?tab=roles`);
  };

  const onOpenInviteResponsibleDrawer = (e: any) => {
    e.stopPropagation();
    setOpenInviteResponsible(true);
  };

  const onCloseInviteResponsibleDrawer = () => {
    setOpenInviteResponsible(false);
    setInProcess(false);
  }

  const afterSubmitInviteResponsible = () => {
    onCloseInviteResponsibleDrawer();
    onReload();
  };

  const onOpenProveResponsibilityDrawer = (e: any) => {
    e.stopPropagation();
    setOpenProveResponsibility(true);
  };

  const onCloseProveResponsibilityDrawer = () => {
    setOpenProveResponsibility(false);
    setInProcess(false);
  }

  const afterSubmitProveResponsibility = () => {
    onCloseProveResponsibilityDrawer();
    onReload();
  };

  return (
      <Box height={'100%'}>
        <CompanyCardAction company={company} showParentTooltip={showParentTooltip} setShowParentTooltip={setShowParentTooltip}>
          <Stack spacing={1}>
              {
                  (company[CompanyViewDTOFields.AllowFullAccess] &&
                  company[CompanyViewDTOFields.UsersPendingApprovalQuantity] > 0) ? (
                          <Tooltip title={`${company[CompanyViewDTOFields.UsersPendingApprovalQuantity]} usuario${company[CompanyViewDTOFields.UsersPendingApprovalQuantity] === 1 ? "" : "s"} pendiente de aprobación`}>
                              <Chip id={"company-pendant-user-btn"}
                                    size={'small'}
                                    color={'info'}
                                    variant={'strong'}
                                    label={`${company[CompanyViewDTOFields.UsersPendingApprovalQuantity]} pendiente${company[CompanyViewDTOFields.UsersPendingApprovalQuantity] === 1 ? "" : "s"}`}
                                    onClick={onNavigateRole}
                                    onMouseEnter={handleChildMouseEnter}
                                    onMouseLeave={handleChildMouseLeave}
                                    icon={<BellDotIcon />}
                              />
                          </Tooltip>
                      )
                      :
                      undefined
              }
          </Stack>
        </CompanyCardAction>

        <CompanyInviteThroughMailDrawer
            open={openInviteResponsible}
            onClose={onCloseInviteResponsibleDrawer}
            onConfirm={afterSubmitInviteResponsible}
            company={company}
            inProcess={inProcess}
        />

        <CompanyAfipFormDrawer
            show={openProveResponsibility}
            companyId={company[EntityWithIdFields.Id]}
            companyName={company[CompanyViewDTOFields.BusinessName]}
            onClose={onCloseProveResponsibilityDrawer}
            onConfirmed={afterSubmitProveResponsibility}
            viewFiles={!company[CompanyViewDTOFields.AllowGetResponsability]}
            alreadySent={company[CompanyViewDTOFields.AllowViewDocumentationResponsability]}
            inProcess={inProcess}
        />
      </Box>
  );
}

/*{company[CompanyViewDTOFields.AllowResponsibleInvitation] ? (
                mailInvited ? (
                        <Tooltip title={'Verificación en proceso'}>
                            <Chip id={"company-verify-processing-btn"}
                                  size={'small'}
                                  label={'Verificando'}
                                  color={'info'}
                                  variant={'strong'}
                                  onClick={(e) => {
                                      onOpenInviteResponsibleDrawer(e)
                                      setInProcess(true)
                                  }}
                                  onMouseEnter={handleChildMouseEnter}
                                  onMouseLeave={handleChildMouseLeave}
                                  icon={<ClockIcon />}
                            />
                        </Tooltip>
                    )
                    :
                    (
                        <Chip id={"company-verify-btn"}
                              size={'small'}
                              color={'warning'}
                              variant={'strong'}
                              label={'Verificar cuenta'}
                              onClick={onOpenInviteResponsibleDrawer}
                              onMouseEnter={handleChildMouseEnter}
                              onMouseLeave={handleChildMouseLeave}
                              icon={<BadgeAlertIcon />}
                        />
                    )                
            ) : company[CompanyViewDTOFields.AllowGetResponsability]
                ? (
                    <Chip id={"company-verify-responsability-btn"}
                          size={'small'}
                          color={'warning'}
                          variant={'strong'}
                          label={'Verificar cuenta'}
                          onClick={onOpenProveResponsibilityDrawer}
                          onMouseEnter={handleChildMouseEnter}
                          onMouseLeave={handleChildMouseLeave}
                          icon={<BadgeAlertIcon />}
                    />
                ) :
                company[CompanyViewDTOFields.AllowViewDocumentationResponsability] ?
                    (
                        <Tooltip title={'Verificación en proceso'}>
                            <Chip id={"company-verification-in-process-btn"}
                                  size={'small'}
                                  color={'info'}
                                  variant={'strong'}
                                  label={'Verificando'}
                                  onClick={(e) => {
                                      onOpenProveResponsibilityDrawer(e)
                                      setInProcess(true)
                                  }}
                                  onMouseEnter={handleChildMouseEnter}
                                  onMouseLeave={handleChildMouseLeave}
                                  icon={<ClockIcon />}
                            />
                        </Tooltip>
                    )
                    : company[CompanyViewDTOFields.AllowFullAccess] &&
                    company[CompanyViewDTOFields.UsersPendingApprovalQuantity] > 0 ? (
                        <Tooltip title={`${company[CompanyViewDTOFields.UsersPendingApprovalQuantity]} usuario${company[CompanyViewDTOFields.UsersPendingApprovalQuantity] === 1 ? "" : "s"} pendiente de aprobación`}>
                            <Chip id={"company-pendant-user-btn"}
                                  size={'small'}
                                  color={'info'}
                                  variant={'strong'}
                                  label={`${company[CompanyViewDTOFields.UsersPendingApprovalQuantity]} pendiente${company[CompanyViewDTOFields.UsersPendingApprovalQuantity] === 1 ? "" : "s"}`}
                                  onClick={onNavigateRole}
                                  onMouseEnter={handleChildMouseEnter}
                                  onMouseLeave={handleChildMouseLeave}
                                  icon={<BellDotIcon />}
                            />
                        </Tooltip>
                    ) : undefined}*/


export default CompanyCardButton;