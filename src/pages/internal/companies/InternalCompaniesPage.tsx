import { Card, CardContent, Grid, Stack } from '@mui/material';
import { useAction } from 'hooks/useAction';
import { useForm } from 'react-hook-form';
import {
  CompanyQuaFilterSearch,
  CompanyQuaFilterSearchFields,
} from 'types/company/companyData';
import { SearchButton } from 'components/buttons/Buttons';
import React, { useEffect, useState } from 'react';
import { grey } from '@mui/material/colors';
import { ControlledTextFieldFilled } from 'components/forms';
import {
  EntityListWithPagination,
  EntityListWithPaginationFields,
  EntityPaginationFields,
} from 'types/baseEntities';
import InternalCompaniesTableList from './InternalCompaniesTableList';
import {HttpInternalUser} from "../../../http/user/httpInternalUser";
import {UserCompany} from "../../../types/user";
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {FactoryOutlined} from "@mui/icons-material";

const InternalCompaniesPage = () => {
  const { setTitle } = useAction();

  const [companySearchFilter, setCompanySearchFilter] =
    useState<CompanyQuaFilterSearch>({
      [CompanyQuaFilterSearchFields.BusinessName]: '',
      [CompanyQuaFilterSearchFields.Cuit]: '',
      [CompanyQuaFilterSearchFields.CompanyStateCodes]: [],
      [EntityPaginationFields.PageSize]: 10,
      [EntityPaginationFields.ActualPage]: 1,
    });
  const [companies, setCompanies] =
    useState<EntityListWithPagination<UserCompany>>();
  const [loading, setLoading] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<CompanyQuaFilterSearch>({
    defaultValues: { ...companySearchFilter },
  });

  setTitle('Empresas');

  const searchCompanies = (filter: CompanyQuaFilterSearch) => {
    setLoading(true);

    HttpInternalUser.getCompanyUsersBySearch(filter).then((r) => {
      setCompanies(r);
      setLoading(false);
    });
  };

  useEffect(() => {
    searchCompanies(companySearchFilter);
  }, []);

  const onSubmit = (data: CompanyQuaFilterSearch) => {
    setCompanySearchFilter(data);
    searchCompanies(data);
  };

  return (
    <Stack spacing={3}>
      <TabSectionCardHeader icon={FactoryOutlined}
                            sectionTitle={'Usuarios PyME'}
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container alignItems={'center'} spacing={5}>
              <Grid item xs={12} md={6}>
                <ControlledTextFieldFilled
                  control={control}
                  label={'Razón Social'}
                  name={CompanyQuaFilterSearchFields.BusinessName}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <ControlledTextFieldFilled
                  control={control}
                  label={'CUIT'}
                  name={CompanyQuaFilterSearchFields.Cuit}
                />
              </Grid>
              
              <Grid item xs={6} md={2}>
                <SearchButton type={'submit'}>Buscar</SearchButton>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <InternalCompaniesTableList
        loading={loading}
        companies={companies?.[EntityListWithPaginationFields.List]}
        searchCompanies={searchCompanies}
        prevFilter={companySearchFilter}
        pagination={companies?.[EntityListWithPaginationFields.Pagination]}
      />
    </Stack>
  );
};

export default InternalCompaniesPage;
