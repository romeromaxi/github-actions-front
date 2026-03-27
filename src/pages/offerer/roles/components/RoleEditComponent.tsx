import { Grid } from '@mui/material';
import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { AsyncSelect, ControlledTextFieldFilled } from 'components/forms';
import { Role, RoleFields } from 'types/offerer/rolesData';
import { HttpCacheOfferer } from 'http/cache/httpCacheOfferer';

function RoleEditComponent() {
  const methods = useFormContext<Role>();

  const loadRoleTypes = useCallback(() => {
    return HttpCacheOfferer.getRolesTypes();
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4}>
        <AsyncSelect
          label="Rol"
          control={methods.control}
          name={RoleFields.UserRelationshipCode}
          loadOptions={loadRoleTypes}
          //disabled={isResponsibleAfip}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ControlledTextFieldFilled
          label={'Mail'}
          control={methods.control}
          name={RoleFields.Mail}
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ControlledTextFieldFilled
          label={'Teléfono'}
          control={methods.control}
          name={RoleFields.PhoneNumber}
          fullWidth
          disabled
        />
      </Grid>
    </Grid>
  );
}

export default RoleEditComponent;
