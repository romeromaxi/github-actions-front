import {CompanyInvitationRoleNew, CompanyInvitationRoleNewFields} from '../../../types/company/rolesData';
import {Card, CardContent, Stack, Typography} from '@mui/material';
import {stringFormatter} from '../../../util/formatters/stringFormatter';
import React, {useState} from 'react';
import {SearchButton} from '../../../components/buttons/Buttons';
import CompanyInvitationDetailDrawer from './CompanyInvitationDetailDrawer';
import {TypographyBase} from "../../../components/misc/TypographyBase";

interface CompanyInvitationCardProps {
  invitation: CompanyInvitationRoleNew;
  companyId: number;
  onReload: () => void;
}

const CompanyInvitationCard = ({
  invitation,
  companyId,
  onReload,
}: CompanyInvitationCardProps) => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const userCompanyBondDesc =
    invitation[CompanyInvitationRoleNewFields.UserCompanyBondDesc] || '-';

  const onView = () => setShowDetail(true);

  const onCloseDetail = () => setShowDetail(false);

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Stack direction='row' alignItems='center' justifyContent={'space-between'}>
            <Stack>
              <TypographyBase maxLines={1} tooltip variant={'h5'} fontWeight={500}>
                {invitation[CompanyInvitationRoleNewFields.BusinessName]}
              </TypographyBase>
              <Typography variant={'caption'} color={'text.lighter'}>
                {stringFormatter.formatCuit(invitation[CompanyInvitationRoleNewFields.CUIT])}
              </Typography>
              <Typography fontSize={10} fontWeight={400} color={'text.lighter'} fontStyle={'italic'}>
                {`Te ha enviado una solicitud para incorporarse al equipo de trabajo de la empresa (${userCompanyBondDesc.toUpperCase()}).`}
              </Typography>
            </Stack>
            <SearchButton onClick={onView} size={'small'} id={"company-invitation-incorporation-view-btn"}>
              Ver
            </SearchButton>
          </Stack>
        </CardContent>
      </Card>
      <CompanyInvitationDetailDrawer
        open={showDetail}
        onClose={onCloseDetail}
        companyId={companyId}
        invitation={invitation}
        onReload={onReload}
      />
    </React.Fragment>
  );
};

export default CompanyInvitationCard;
