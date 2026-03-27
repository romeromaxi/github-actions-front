import { Grid } from '@mui/material';
import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { AsyncSelect, ControlledTextFieldFilled } from 'components/forms';
import { HttpCacheCompany } from 'http/index';
import { Role, RoleFields } from '../../../../types/company/rolesData';
import { CompanyUserRoleTypes } from '../../../../types/company/companyEnums';
import { EntityWithIdAndDescriptionFields } from '../../../../types/baseEntities';
import { PersonTypes } from '../../../../types/person/personEnums';

interface RoleEditComponentProps {
  personT?: PersonTypes;
}

function RoleEditComponent({ personT }: RoleEditComponentProps) {
  const methods = useFormContext<Role>();
  const isResponsibleAfip: boolean =
    methods.watch(RoleFields.UserRelationshipCode) ===
    CompanyUserRoleTypes.ResponsibleAFIP;

  const loadRoleTypes = useCallback(() => {
    if (isResponsibleAfip)
      return Promise.resolve([
        {
          [EntityWithIdAndDescriptionFields.Id]:
            CompanyUserRoleTypes.ResponsibleAFIP,
          [EntityWithIdAndDescriptionFields.Description]: `Responsable`,
        },
      ]);

    return HttpCacheCompany.getRolesTypes();
  }, []);

  const loadBondOptions = useCallback(() => {
    if (!personT) return undefined;

    return personT === PersonTypes.Legal || isResponsibleAfip
      ? HttpCacheCompany.getBondsForLegalPerson(!isResponsibleAfip)
      : HttpCacheCompany.getBondsForPhysicalPerson(!isResponsibleAfip);
  }, [personT]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <AsyncSelect
          label="Rol"
          control={methods.control}
          name={RoleFields.UserRelationshipCode}
          loadOptions={loadRoleTypes}
          disabled={isResponsibleAfip}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <AsyncSelect
          loadOptions={loadBondOptions}
          control={methods.control}
          name={RoleFields.UserCompanyBondCod}
          select
          fullWidth
          label={'Vínculo'}
          disabled={isResponsibleAfip}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ControlledTextFieldFilled
          label={'Mail'}
          control={methods.control}
          name={RoleFields.Mail}
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
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
