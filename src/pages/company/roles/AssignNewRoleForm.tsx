import React, { useCallback, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Stack} from '@mui/material';

import { AsyncSelect } from 'components/forms';

import { RoleInvitationPostFields } from 'types/company/rolesData';
import { HttpCacheCompany } from 'http/cache/httpCacheCompany';
import { ControlledTextFieldFilled } from 'components/forms';
import { AssignNewRoleContext } from './AssignNewRoleDrawer';
import { DisclaimerNosis } from 'components/text/DisclaimerNosis';
import { PersonTypes } from '../../../types/person/personEnums';
import { EntityWithIdAndDescriptionAndDetailFields } from '../../../types/baseEntities';

interface AssignNewRoleFormProps {
  personType: PersonTypes;
}
function AssignNewRoleForm({ personType }: AssignNewRoleFormProps) {
  const { control } = useFormContext();
  const { confirmedMainData, nosisMainData } = useContext(AssignNewRoleContext);

  const loadBondOptions = useCallback(() => {
    if (!personType) return undefined;

    return personType === PersonTypes.Legal
      ? HttpCacheCompany.getBondsForLegalPerson()
      : HttpCacheCompany.getBondsForPhysicalPerson();
  }, [personType]);

  const loadRolesOptions = useCallback(async () => {
    const roles = await HttpCacheCompany.getRolesTypes();
    return roles.map(role => ({
      ...role,
      [EntityWithIdAndDescriptionAndDetailFields.Id]: role.id,
      [EntityWithIdAndDescriptionAndDetailFields.Description]: role.descripcion,
      [EntityWithIdAndDescriptionAndDetailFields.Detalle]: role.detalle,
    }));
  }, []);

  return (
      <Stack spacing={1}>
            <AsyncSelect
              label="Rol"
              control={control}
              name={RoleInvitationPostFields.UserRelationshipCode}
              loadOptions={loadRolesOptions}
              disabled={!!nosisMainData && !confirmedMainData}
              optionsWithTooltip
              fullWidth
            />
            <AsyncSelect
              label="Vinculo"
              control={control}
              name={RoleInvitationPostFields.UserBondTypeCode}
              loadOptions={loadBondOptions}
              disabled={!!nosisMainData && !confirmedMainData}
              fullWidth
            />
          <Stack direction='row' alignItems='center' spacing={2}>
                <ControlledTextFieldFilled
                  label="Email"
                  control={control}
                  name={RoleInvitationPostFields.Mail}
                  fullWidth
                  disabled={!!nosisMainData && !confirmedMainData}
                />
                <ControlledTextFieldFilled
                  label="CUIT"
                  control={control}
                  name={RoleInvitationPostFields.CUIT}
                  fullWidth
                  disabled={!!nosisMainData && !confirmedMainData}
                />
          </Stack>
        <DisclaimerNosis opacity={!!nosisMainData} />
      </Stack>
  );
}

export default AssignNewRoleForm;