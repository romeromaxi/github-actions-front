import { Role, RoleFields } from '../../../types/company/rolesData';
import { Card, CardContent, Chip, Grid, Stack, Tooltip } from '@mui/material';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import React, { useState } from 'react';
import TitleWithSubtitleCard from '../../../components/text/TitleWithSubtitleCard';
import { SearchButton } from '../../../components/buttons/Buttons';
import CompanyRoleInvitationDetailDialog from './CompanyRoleInvitationDetailDialog';

interface CompanyRoleInvitationCardProps {
  role: Role;
  companyId: number;
  onReload: () => void;
}

const CompanyRoleInvitationCard = ({
  role,
  companyId,
  onReload,
}: CompanyRoleInvitationCardProps) => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const userCompanyBondDesc = role[RoleFields.UserCompanyBondDesc] || '-';

  const onView = () => setShowDetail(true);

  const onCloseDetail = () => setShowDetail(false);

  return (
    <>
      <Card>
        <CardContent>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={9}>
              <TitleWithSubtitleCard
                title={role[RoleFields.LegalName]}
                subtitle={`Te ha enviado una solicitud para incorporarse al equipo de trabajo de la empresa  
                                                   (${userCompanyBondDesc.toUpperCase()}).`}
                subtitleProps={{ fontStyle: 'italic' }}
              />
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1} alignItems={'end'}>
                <Tooltip arrow title="CUIT" placement="top">
                  <Chip
                    color="info"
                    size="small"
                    label={stringFormatter.formatCuit(role[RoleFields.CUIT])}
                  />
                </Tooltip>
                <SearchButton onClick={onView} size={'small'} id={"company-invitation-incorporation-view-btn"}>
                  Ver
                </SearchButton>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <CompanyRoleInvitationDetailDialog
        open={showDetail}
        onClose={onCloseDetail}
        companyId={companyId}
        role={role}
        onReload={onReload}
      />
    </>
  );
};

export default CompanyRoleInvitationCard;
