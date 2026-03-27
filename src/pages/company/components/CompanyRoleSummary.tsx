import React, { ReactNode } from 'react';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../types/company/companyData';
import { DataWithLabel } from '../../../components/misc/DataWithLabel';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import { CompanyPersonRelationshipFields } from '../../../types/company/companySocietyData';
import { EnumColors } from '../../../types/general/generalEnums';
import { NewAlertIcon } from '../../offerer/components/OffererSolicitation/OffererSolicitationTable/SolicitationAlertIcons';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { grey } from '@mui/material/colors';

interface CompanyRoleSummaryProps {
  company: CompanyViewDTO;
  hideRole?: boolean;
  pendantValidation?: boolean;
  blocked?: boolean;
  tempSuspended?: boolean;
  renderHeader?: () => void;
  renderCuitAction?: () => void;
}

function CompanyRoleSummary({
  company,
  hideRole,
  pendantValidation,
  blocked,
  tempSuspended,
  renderHeader,
  renderCuitAction,
}: CompanyRoleSummaryProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ width: '100% !important', pl: 2, pr: 2 }}
    >
      <Stack spacing={1} width={1}>
        {renderHeader && renderHeader()}
        <Stack
          alignItems={'center'}
          direction={'row'}
          justifyContent={'space-between'}
        >
          <DataWithLabel
            label="CUIT"
            data={stringFormatter.formatCuit(
              company[CompanyPersonRelationshipFields.CUIT],
            )}
            color={EnumColors.BLUE}
            dataProps={blocked ? { color: grey[400] } : undefined}
            rowDirection
          />
          {renderCuitAction && renderCuitAction()}
        </Stack>
        <DataWithLabel
          label="Mi Rol"
          data={
            hideRole
              ? 'Sin Asignar'
              : blocked
                ? 'Suspendido'
                : tempSuspended
                  ? 'Suspendido Temporalmente'
                  : company[
                      CompanyViewDTOFields.UserCompanyRelationshipTypeDesc
                    ]
          }
          color={EnumColors.BLUE}
          dataProps={
            blocked || tempSuspended ? { color: grey[400] } : undefined
          }
          rowDirection
        />
        <DataWithLabel
          label="Vínculo"
          data={
            blocked ? (
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <WarningAmberIcon
                  fontSize="small"
                  sx={{
                    color: blocked ? 'red !important' : '#1565C0 !important',
                  }}
                />
                <Typography color={blocked ? 'red' : '#1565C0'} fontSize={11}>
                  {blocked
                    ? 'Se han quitado los permisos'
                    : company[CompanyViewDTOFields.CompanyUserQueryStateDesc]}
                </Typography>
              </Stack>
            ) : (
              company[CompanyViewDTOFields.UserCompanyBondTypeDesc]
            )
          }
          color={EnumColors.BLUE}
          rowDirection
        />
      </Stack>
      {pendantValidation ? (
        <Box>
          <Tooltip title="Pendiente de Validación">
            <WarningAmberIcon color="warning" />
          </Tooltip>
        </Box>
      ) : (
        <Box>
          <NewAlertIcon AlertCode={company[CompanyViewDTOFields.AlertCode]} />
        </Box>
      )}
    </Stack>
  );
}

export default CompanyRoleSummary;
