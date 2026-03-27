import React, { useContext } from 'react';
import {Card, CardActions, CardContent, Grid} from '@mui/material';
import { HttpCompanyRoles } from 'http/index';
import * as yup from 'yup';
import { RequiredSelectSchema } from 'util/validation/validationSchemas';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { EntityWithIdFields } from 'types/baseEntities';
import { useAction } from 'hooks/useAction';
import { stringFormatter } from 'util/formatters/stringFormatter';
import { Role, RoleFields } from 'types/company/rolesData';
import RoleEditComponent from './components/RoleEditComponent';
import { RolesListContext } from './CompanyRolesList';
import { PersonTypes } from 'types/person/personEnums';
import {CompanyUserRoleTypes} from "types/company/companyEnums";
import {SaveButton} from "components/buttons/Buttons";

interface RoleDetailProps {
  role: Role;
  companyPersonType: PersonTypes;
}

export enum RelationshipEditFormFields {
  SocietyPerson = 'relationship',
  PersonInformation = 'personInformation',
  PhoneNumber = 'phoneNumber',
  Mail = 'mail',
  AddressList = 'otherAddresses',
}

function RoleDetail({ role, companyPersonType }: RoleDetailProps) {
  const { showLoader, hideLoader, snackbarSuccess, snackbarError } =
    useAction();
  const { reloadRoles } = useContext(RolesListContext);

  const roleUpdateFormSchema = yup.object().shape({
    [RoleFields.UserRelationshipCode]: RequiredSelectSchema,
  });
  
  const getFullNumber = () => 
      stringFormatter.toFullPhoneNumber(role[RoleFields.PhoneCode], role[RoleFields.AreaCode], role[RoleFields.PhoneNumber]);
  
  const methods = useForm<Role>({
    resolver: yupResolver(roleUpdateFormSchema),
    defaultValues: {
      ...role,
      [RoleFields.PhoneNumber]: getFullNumber()
    },
  });
  const isResponsibleAfip: boolean =
      methods.watch(RoleFields.UserRelationshipCode) ===
      CompanyUserRoleTypes.ResponsibleAFIP;

  const onHandleSumbit = (data: Role) => {
    showLoader();

    HttpCompanyRoles.updateRole(
      data[RoleFields.CompanyId],
      data[EntityWithIdFields.Id],
      data[RoleFields.UserRelationshipCode],
      data[RoleFields.UserCompanyBondCod],
    )
      .then(() => {
        hideLoader();
        reloadRoles();
        snackbarSuccess('El registro se ha guardado correctamente');
      })
      .catch(() => snackbarError('Ocurrió un error al guardar el registro'));
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormProvider {...methods}>
          <Card>
            <CardContent>
              <RoleEditComponent personT={companyPersonType} />
            </CardContent>

            {
              !isResponsibleAfip &&
                <CardActions>
                  <SaveButton variant="contained" 
                              onClick={methods.handleSubmit(onHandleSumbit)} 
                              size={'small'}
                              id={"company-role-detail-save-btn"}
                  >
                    Guardar
                  </SaveButton>
                </CardActions>
            }
          </Card>
        </FormProvider>
      </Grid>
    </Grid>
  );
}
export default RoleDetail;
