import React from 'react';
import * as yup from 'yup';
import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useAxios from 'hooks/useAxios';
import { useAction } from 'hooks/useAction';
import { AsyncSelect } from 'components/forms';
import { SaveButton, UpdateButton } from 'components/buttons/Buttons';
import { HttpCacheCompany, HttpCompanyRolesInvitation } from 'http/index';
import { RequiredSelectSchema } from 'util/validation/validationSchemas';
import { CompanyUnconfirmedRegisterDataFields } from '../../../types/company/companyData';
import { PersonTypes } from '../../../types/person/personEnums';

interface CompanyAlreadyValidatedFormProps {
  companyId?: number;
  personTypeCode?: number;
  onSubmitNewRole: () => void;
  onChargeAnotherCuit: () => void;
}

export interface CompanyAlreadyValidatedFormData {
  [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]: number;
}

const CompanyAlreadyValidatedForm = ({
  companyId,
  personTypeCode,
  onSubmitNewRole,
  onChargeAnotherCuit,
}: CompanyAlreadyValidatedFormProps) => {
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();

  const { control, handleSubmit } = useForm<CompanyAlreadyValidatedFormData>({
    resolver: yupResolver(
      yup.object().shape({
        [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]:
          RequiredSelectSchema,
      }),
    ),
  });

  const onSubmit = (data: CompanyAlreadyValidatedFormData) => {
    if (companyId) {
      fetchData(
        () => HttpCompanyRolesInvitation.insertNew(companyId, data),
        true,
      ).then(() => {
        snackbarSuccess('La solicitud de rol fue enviada correctamente');
        onSubmitNewRole();
      });
    }
  };

  const loadBondOptions =
    personTypeCode === PersonTypes.Legal
      ? HttpCacheCompany.getBondsForLegalPerson
      : HttpCacheCompany.getBondsForPhysicalPerson;

  return (
    <Stack width={1} spacing={4}>
      <AsyncSelect
        label="Vínculo"
        control={control}
        name={CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode}
        loadOptions={loadBondOptions}
        fullWidth
        required
      />
      <Stack
        direction={'row'}
        spacing={{ xs: 2, sm: 4, md: 8 }}
        justifyContent={'space-between'}
      >
        <UpdateButton color={'inherit'} fullWidth onClick={onChargeAnotherCuit}>
          Cargar otro CUIT
        </UpdateButton>

        <SaveButton onClick={handleSubmit(onSubmit)} fullWidth>
          Enviar
        </SaveButton>
      </Stack>
    </Stack>
  );
};

export default CompanyAlreadyValidatedForm;
