import {
  CompanyFields,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../types/company/companyData';
import { Box, Stack, Typography } from '@mui/material';
import CardActionButton from '../../../components/cards/CardActionButton';
import CompanyRoleSummary from './CompanyRoleSummary';
import React from 'react';
import { SolicitationAlertType } from '../../../types/solicitations/solicitationEnums';
import { grey } from '@mui/material/colors';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { useNavigate } from 'react-router-dom';

interface CompanyCardValidatedPendingProps {
  company: CompanyViewDTO;
  blocked?: boolean;
}

const CompanyCardValidatedPending = ({
  company,
  blocked = false,
}: CompanyCardValidatedPendingProps) => {
  const navigate = useNavigate();
  const companyAlert = {
    ...company,
    [CompanyViewDTOFields.AlertCode]: SolicitationAlertType.NewMessage,
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

  return (
    <Box height={'100% !important'}>
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
              company={companyAlert}
              blocked={blocked}
              renderHeader={renderSummaryHeader}
            />
          </div>
        }
        fontProps={blocked ? { color: `${grey[600]} !important` } : undefined}
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
    </Box>
  );
};

export default CompanyCardValidatedPending;
