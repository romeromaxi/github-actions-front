import { CompanyViewDTO } from '../../../../../types/company/companyData';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import {
  BackButton,
  CloseButton,
  EditButton,
  SaveButton,
} from '../../../../../components/buttons/Buttons';
import React, { Fragment, useEffect, useState } from 'react';
import CompanyFinancialPhysicalPersonHomeView from '../../../../companyFile/finance/home/CompanyFinancialPhysicalPersonHomeView';
import { HttpCompanyDeclarationOfAssets } from '../../../../../http';
import { EntityWithIdFields } from '../../../../../types/baseEntities';
import { FormProvider, useForm } from 'react-hook-form';
import {
  CompanyDeclarationOfAssetsFormFields,
  CompanyDeclarationOfAssetsFormType,
} from '../../../finance/declarationAssets/CompanyDeclarationOfAssetsEditCard';
import CompanyDeclarationOfAssetsEditTabs from '../../../finance/declarationAssets/CompanyDeclarationOfAssetsEditTabs';
import useAxios from '../../../../../hooks/useAxios';
import { useAction } from '../../../../../hooks/useAction';
import { CompanyPersonalInformationContext } from '../../../../companyFile/company/CompanyPersonalInformationHome';
import {
  CompanyFileSourceType,
  CompanyFileType,
} from '../../../../../types/company/companyEnums';
import { ButtonExportDropdown } from '../../../../../components/buttons/ButtonExportDropdown';

interface PersonFinancialStatementsModelMenuProps {
  onBack: () => void;
  company: CompanyViewDTO;
}

interface PersonFinancialStatementsModelMenuForm {
  manifestacionBienes: CompanyDeclarationOfAssetsFormType;
}

const PersonFinancialStatementsModelMenu = ({
  onBack,
  company,
}: PersonFinancialStatementsModelMenuProps) => {
  const { snackbarSuccess } = useAction();
  const { fetchData, fetchAndDownloadFile } = useAxios();
  const [editing, setEditing] = useState<boolean>(false);
  const [allowEdit, setAllowEdit] = useState<boolean>(false);

  const methods = useForm<PersonFinancialStatementsModelMenuForm>();

  useEffect(() => {
    HttpCompanyDeclarationOfAssets.getLastByCompany(
      company[EntityWithIdFields.Id],
    ).then((r) => {
      const declarationOfAssets: CompanyDeclarationOfAssetsFormType = {
        [CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets]: r,
      };
      methods.reset({
        manifestacionBienes: declarationOfAssets,
      });
    });
  }, [company, allowEdit]);

  const onSubmit = (data: PersonFinancialStatementsModelMenuForm) => {
    const declarationOfAssets =
      data.manifestacionBienes[
        CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets
      ];

    fetchData(
      () =>
        HttpCompanyDeclarationOfAssets.update(
          company[EntityWithIdFields.Id],
          declarationOfAssets[EntityWithIdFields.Id],
          declarationOfAssets,
        ),
      true,
    ).then(() => {
      setEditing(false);
      snackbarSuccess(
        'La manifestación de bienes fue actualizada correctamente',
      );
    });
  };

  const onExportExcel = () =>
    fetchAndDownloadFile(() =>
      HttpCompanyDeclarationOfAssets.exportLastToExcel(
        company[EntityWithIdFields.Id],
      ),
    );

  return (
    <Stack spacing={2}>
      <FormProvider {...methods}>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography variant="h3" fontWeight={600}>
            Manifestación de Bienes
          </Typography>
          <Stack direction="row" alignItems={'center'} spacing={2}>
            {allowEdit &&
              (!editing ? (
                <Fragment>
                  <ButtonExportDropdown
                    size={'small'}
                    onExportExcel={onExportExcel}
                  />
                  <EditButton
                    onClick={() => {
                      setEditing(true);
                    }}
                    size={'small'}
                  >
                    Editar
                  </EditButton>
                </Fragment>
              ) : (
                <>
                  <CloseButton
                    color={'inherit'}
                    size={'small'}
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    Cancelar
                  </CloseButton>
                  <SaveButton
                    onClick={methods.handleSubmit(onSubmit)}
                    size={'small'}
                  >
                    Guardar
                  </SaveButton>
                </>
              ))}
            <BackButton onClick={onBack} size={'small'}>
              Mis Presentaciones
            </BackButton>
          </Stack>
        </Stack>
        {!editing ? (
          <CompanyPersonalInformationContext.Provider
            value={{
              dataId: company[EntityWithIdFields.Id],
              dataSource: CompanyFileSourceType.Company,
              fileType: CompanyFileType.Long,
            }}
          >
            <CompanyFinancialPhysicalPersonHomeView
              company={company}
              hideFlows
              onAllowEdit={(a: boolean) => {
                setAllowEdit(a);
              }}
            />
          </CompanyPersonalInformationContext.Provider>
        ) : (
          <Card>
            <CardContent>
              <CompanyDeclarationOfAssetsEditTabs
                nameBase={`manifestacionBienes.${CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets}`}
              />
            </CardContent>
          </Card>
        )}
      </FormProvider>
    </Stack>
  );
};

export default PersonFinancialStatementsModelMenu;
