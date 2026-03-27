import React from 'react';
import { Grid, Typography } from '@mui/material';
import { CompanyUserInvitation } from 'types/user/userInvitation';

interface CompanyHomeInvitationsProps {
  invites?: CompanyUserInvitation[];
}

function CompanyHomeInvitations({ invites }: CompanyHomeInvitationsProps) {
  const getInvitationsLength = () =>
    invites?.length !== 0 && (
      <Typography fontWeight={500}>
        {`Recibiste ${invites?.length === 1 ? 'una invitación para unirte a una cuenta MiPyME, ir a Invitaciones' : `${invites?.length} para unirte a cuentas MiPyME, ir a Invitaciones`}`}
      </Typography>
    );

  return (
    <Grid container spacing={1}>
      {!!invites && !!invites.length && (
        <Grid item xs={12}>
          {getInvitationsLength()}
        </Grid>
      )}
    </Grid>
  );
}

export default CompanyHomeInvitations;
