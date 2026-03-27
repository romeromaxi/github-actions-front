import React from 'react';
import { Role, RoleFields } from '../../../types/offerer/rolesData';
import { Chip, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import { DataWithIcon } from '../../../components/misc/DataWithIcon';
import { EmailTwoTone, LocalPhoneTwoTone } from '@mui/icons-material';

interface SolicitationResponsibleContactProps {
  role: Role;
}

function SolicitationResponsibleContact({
  role,
}: SolicitationResponsibleContactProps) {
  return (
    <Grid xs={12} container spacing={1}>
      <Grid item xs={12} textAlign={'center'}>
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          <Typography sx={{ fontSize: '0.75em', fontWeight: 600 }}>
            {role[RoleFields.LegalName]}
          </Typography>
          <Tooltip title={'CUIT'}>
            <Chip
              color="info"
              size="small"
              label={stringFormatter.formatCuit(role[RoleFields.CUIT])}
            />
          </Tooltip>
        </Stack>
      </Grid>
      <Grid item xs={12} textAlign={'center'}>
        <Stack justifyContent={'center'} spacing={0.5}>
          <DataWithIcon
            icon={<EmailTwoTone sx={{ color: '#A1A5B7 !important' }} />}
            data={role[RoleFields.Mail] ?? '-'}
          />
          <DataWithIcon
            icon={<LocalPhoneTwoTone sx={{ color: '#A1A5B7 !important' }} />}
            data={
              stringFormatter.phoneNumberWithAreaCode(
                '',
                role[RoleFields.PhoneNumber],
              ) ?? '-'
            }
          />
        </Stack>
      </Grid>
    </Grid>
  );
}

export default SolicitationResponsibleContact;
