import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Stack } from '@mui/material';
import { ControlledTextFieldFilled } from 'components/forms';
import {InternalUserCreateFields} from 'types/user';
import { InternalUserNewContext } from './InternalUserNewDrawer';
import { DisclaimerNosis } from 'components/text/DisclaimerNosis';
import {ControlledMultipleSelectAsync} from "components/forms/ControlledMultipleSelectAsync";
import {HttpCacheInternalUser} from "http/cache/httpCacheUser";


function InternalUserNewForm() {
  const { control } = useFormContext();
  const { confirmedMainData, nosisMainData } = useContext(InternalUserNewContext);
  
  return (
    <Stack spacing={2}>
      <ControlledTextFieldFilled
        label="CUIT"
        control={control}
        name={InternalUserCreateFields.CUIT}
        fullWidth
        disabled={!!nosisMainData && !confirmedMainData}
      />
      <ControlledTextFieldFilled
        label="Email"
        control={control}
        name={InternalUserCreateFields.Mail}
        fullWidth
        disabled={!!nosisMainData && !confirmedMainData}
      />
      <ControlledMultipleSelectAsync
        id="internal-user-groups-multiselect"
        label="Grupos"
        control={control}
        loadOptions={HttpCacheInternalUser.getGroups}
        name={InternalUserCreateFields.GroupIds}
        fullWidth
        disabled={!!nosisMainData && !confirmedMainData}
      />
      <DisclaimerNosis opacity={!!nosisMainData} />
    </Stack>
  );
}

export default InternalUserNewForm;

