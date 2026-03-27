import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';

import { AsyncSelect } from 'components/forms';

import { RoleInvitationPostFields } from 'types/offerer/rolesData';
import { HttpCacheOfferer } from 'http/cache/httpCacheOfferer';
import { AssignNewRoleContext } from 'pages/offerer/roles/AssignNewRoleDialog';
import { DisclaimerNosis } from '../../../components/text/DisclaimerNosis';
import { DefaultStylesButton } from '../../../components/buttons/Buttons';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ControlledTextFieldFilled } from '../../../components/forms';

function AssignNewRoleForm() {
  const { control } = useFormContext();
  const { confirmedMainData, nosisMainData } = useContext(AssignNewRoleContext);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <AsyncSelect
          label="Rol"
          control={control}
          name={RoleInvitationPostFields.UserRelationshipCode}
          loadOptions={HttpCacheOfferer.getRolesTypes}
          disabled={!!nosisMainData && !confirmedMainData}
          fullWidth
          filled
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

      <Grid item xs={12} textAlign={'end'}>
        {!nosisMainData && (
          <DefaultStylesButton
            type="submit"
            endIcon={<KeyboardDoubleArrowRightIcon />}
          >
            Enviar
          </DefaultStylesButton>
        )}
      </Grid>
    </Grid>
  );
}

export default AssignNewRoleForm;
