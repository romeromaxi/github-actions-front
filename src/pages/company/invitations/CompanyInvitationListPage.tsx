import {Alert, Card, CardContent, Stack, Typography} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  CompanyInvitationRoleNew,
  Role,
} from '../../../types/company/rolesData';
import { HttpCompanyRoles, HttpCompanyRolesInvitation } from '../../../http';
import CardBaseLoading from '../../../components/cards/CardBaseLoading';
import { EnumColors } from '../../../types/general/generalEnums';
import CompanyInvitationCard from './CompanyInvitationCard';
import CompanyRoleInvitationCard from './CompanyRoleInvitationCard';
import {BaseIconWrapper} from "../../../components/icons/Icons";
import {IdentificationCard} from "phosphor-react";
import CardItemsNotFound from "../../../components/cards/CardItemsNotFound";

interface CompanyInvitationListPageProps {
  companyId: number;
  onReloadAccept: () => void;
}

const CompanyInvitationListPage = ({
  companyId,
  onReloadAccept,
}: CompanyInvitationListPageProps) => {
  const [invitations, setInvitations] = useState<CompanyInvitationRoleNew[]>();
  const [pendingRoles, setPendingRoles] = useState<Role[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const loadInvitations = () => {
    setLoading(false);
    HttpCompanyRolesInvitation.getNews(companyId).then((r) => {
      setInvitations(r);
      setLoading(false);
    });
  };

  const loadPendingRoles = () => {
    setLoading(true);
    HttpCompanyRoles.getPending(companyId).then((r) => {
      setPendingRoles(r);
      setLoading(false);
    });
  };

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      HttpCompanyRolesInvitation.getNews(companyId),
      HttpCompanyRoles.getPending(companyId),
    ]).then((values) => {
      setInvitations(values[0]);
      setPendingRoles(values[1]);
      setLoading(false);
    });
  };

  const onReloadInvitations = () => {
    loadInvitations();
    onReloadAccept();
  };

  const onReloadRolesInv = () => {
    loadPendingRoles();
    onReloadAccept();
  };

  useEffect(() => {
    loadAll();
  }, [companyId]);

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <BaseIconWrapper Icon={IdentificationCard} size={'md'} bg={'#F7FAFC'}/>
            <Typography variant={'h4'} fontWeight={500}>Autorizaciones</Typography>
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={2}>
        {invitations &&
          !loading &&
          invitations.map((inv) => (
              <CompanyInvitationCard
                invitation={inv}
                companyId={companyId}
                onReload={onReloadInvitations}
              />
          ))}
        {pendingRoles &&
          !loading &&
          pendingRoles.map((r) => (
              <CompanyRoleInvitationCard
                role={r}
                companyId={companyId}
                onReload={onReloadRolesInv}
              />
          ))}
        {loading &&
          Array.from({ length: 4 }).map((i) => (
              <CardBaseLoading baseColor={EnumColors.GREY_GRADIENT} />
          ))}
        {!loading && pendingRoles?.length == 0 && invitations?.length == 0 && (
            <CardItemsNotFound title={'No hay invitaciones pendientes'} />
        )}
      </Stack>
    </Stack>
  );
};

export default CompanyInvitationListPage;
