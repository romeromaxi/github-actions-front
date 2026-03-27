import {
  CompanyFields,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../types/company/companyData';
import React, { useState } from 'react';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { Box, Stack, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CardActionButton from '../../../components/cards/CardActionButton';
import CompanyRoleSummary from './CompanyRoleSummary';
import { useNavigate } from 'react-router-dom';
import { DefaultStylesButton } from '../../../components/buttons/Buttons';
import CompanyInviteThroughMailDrawer from './CompanyInviteThroughMailDrawer';

interface CompanyCardUnconfirmedApprovalProps {
  company: CompanyViewDTO;
  onReload?: () => void;
}

const CompanyCardUnconfirmedApproval = ({
  company,
  onReload,
}: CompanyCardUnconfirmedApprovalProps) => {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const onOpenDrawer = (e: any) => {
    e.stopPropagation();
    setOpenDrawer(true);
  };

  const renderSummaryHeader = () => (
    <Stack
      direction={'row'}
      alignItems={'center'}
      spacing={0.5}
      justifyContent={'center'}
    >
      <WarningAmberIcon fontSize="small" sx={{ color: '#1565C0 !important' }} />
      <Typography color={'#1565C0'} fontSize={11}>
        {company[CompanyViewDTOFields.CompanyUserQueryStateDesc]}
      </Typography>
    </Stack>
  );

  const renderCuitAction = () => {
    if (company[CompanyViewDTOFields.AllowResponsibleInvitation])
      return (
        <DefaultStylesButton size="small" onClick={onOpenDrawer}>
          Invitar
        </DefaultStylesButton>
      );
  };
  const afterSubmit = () => {
    setOpenDrawer(false);
    onReload && onReload();
  };

  return (
    <Box>
      <CardActionButton
        title={company[CompanyFields.BusinessName]}
        subtitleContent={
          <div
            style={{
              marginTop:
                company[CompanyFields.BusinessName].length < 44 ? 10 : 0,
            }}
          >
            <CompanyRoleSummary
              company={company}
              tempSuspended
              renderCuitAction={renderCuitAction}
              renderHeader={renderSummaryHeader}
            />
          </div>
        }
        onClick={
          company[CompanyViewDTOFields.AllowCompanyAccess]
            ? company[CompanyViewDTOFields.AllowFullAccess]
              ? () =>
                  navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}`)
              : () =>
                  navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}?tab=sentSolicitations`)
            : () => {}
        }
        company
        headerProps={
          company[
            CompanyViewDTOFields.CompanyQueryStateUserClassificationCode
          ] == 1
            ? { backgroundColor: '#3884c7', borderRadius: '1em 1em 0em 0em' }
            : { backgroundColor: '#6fade3', borderRadius: '1em 1em 0em 0em' }
        }
        headerText={
          company[CompanyViewDTOFields.CompanyQueryStateUserClassificationDesc]
        }
      />
      <CompanyInviteThroughMailDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onConfirm={afterSubmit}
        companyId={company[EntityWithIdFields.Id]}
        companyCuit={company[CompanyViewDTOFields.CUIT]}
        companyName={company[CompanyViewDTOFields.BusinessName]}
        companyInvMail={company[CompanyViewDTOFields.MailInvitationResponsible]}
        inProcess
      />
    </Box>
  );
};

export default CompanyCardUnconfirmedApproval;
