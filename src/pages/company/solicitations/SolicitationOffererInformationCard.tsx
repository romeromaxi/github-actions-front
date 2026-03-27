import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Divider, Stack } from '@mui/material';
import { HttpOffererRoles } from '../../../http';
import {
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from '../../../types/solicitations/solicitationData';
import { Role } from '../../../types/offerer/rolesData';
import SolicitationResponsibleContact from './SolicitationResponsibleContact';

interface SolicitationOffererInformationCardProps {
  solicitation: SolicitationViewDTO;
}

function SolicitationOffererInformationCard({
  solicitation,
}: SolicitationOffererInformationCardProps) {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    HttpOffererRoles.getListByOffererId(
      solicitation[SolicitationViewDTOFields.OffererId],
    ).then(setRoles);
  }, [solicitation]);

  return (
    <Card>
      <CardHeader title={'Datos del Oferente'} subheader={'Responsables'} />
      <CardContent>
        <Stack gap={2}>
          {roles.map((r, idx) => (
            <div>
              <SolicitationResponsibleContact role={r} />
              {idx < roles.length - 1 && <Divider sx={{ mt: 2 }} />}
            </div>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SolicitationOffererInformationCard;
