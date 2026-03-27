import React, {useContext, useEffect} from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';

import {
  OffererRoleFields,
  RoleInvitationPostFields,
} from 'types/offerer/rolesData';
import { HttpCacheOfferer } from 'http/cache/httpCacheOfferer';
import { AssignNewRoleContext } from 'pages/offerer/roles/AssignNewOffererRoleDrawer';
import { DisclaimerNosis } from 'components/text/DisclaimerNosis';
import { ControlledTextFieldFilled } from 'components/forms';
import {
  ControlledMultipleSelectAsync,
} from "../../../components/forms/ControlledMultipleSelectAsync";

function AssignNewOffererRoleForm() {
  const {
    control,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const { confirmedMainData, nosisMainData } = useContext(AssignNewRoleContext);

  const watchSelectedGroupList = watch(OffererRoleFields.GroupIds);
  const errorGroupList = !!errors
    ? errors?.[OffererRoleFields.GroupIds]
    : undefined;

  useEffect(() => {
    if (!!watchSelectedGroupList && !!watchSelectedGroupList.length)
      clearErrors(OffererRoleFields.GroupIds);
  }, [watchSelectedGroupList]);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm={6}>
        <ControlledMultipleSelectAsync label="Rol"
                                       loadOptions={HttpCacheOfferer.getRolesTypes}
                                       id={`selMulCodGroupIdsRole`}
                                       name={OffererRoleFields.GroupIds}
                                       control={control}
                                       fullWidth
                                       disabled={!!nosisMainData && !confirmedMainData}
                                       error={!!errorGroupList}
                                       helperText={!!errorGroupList ? errorGroupList.message : undefined}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ControlledTextFieldFilled
          label="Email"
          control={control}
          name={RoleInvitationPostFields.Mail}
          fullWidth
          disabled={!!nosisMainData && !confirmedMainData}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ControlledTextFieldFilled
          label="CUIT"
          control={control}
          name={RoleInvitationPostFields.CUIT}
          fullWidth
          disabled={!!nosisMainData && !confirmedMainData}
        />
      </Grid>

      <Grid item xs={12}>
        <DisclaimerNosis opacity={!!nosisMainData} />
      </Grid>
    </Grid>
  );
}

export default AssignNewOffererRoleForm;
