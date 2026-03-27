import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import CompanyFinancialLegalPersonHomeView from '../../../../companyFile/finance/home/CompanyFinancialLegalPersonHomeView';
import React, { Fragment, useEffect, useState } from 'react';
import {
  HttpCompanyFinance,
  HttpCompanyIncomeStatement,
  HttpCompanyPatrimonialStatement,
} from 'http/index';
import { CompanyViewDTO } from 'types/company/companyData';
import {
  BackButton,
  CloseButton,
  EditButton,
  SaveButton,
} from 'components/buttons/Buttons';
import {
  CompanyBasePatrimonialStatementFields,
} from 'types/company/companyFinanceInformationData';
import FinancialYearEditComponent from '../../../finance/components/FinancialYearEditComponent';
import { FormProvider, useForm } from 'react-hook-form';
import { EntityWithIdFields } from 'types/baseEntities';
import { useAction } from 'hooks/useAction';
import { CompanyPersonalInformationContext } from 'pages/companyFile/company/CompanyPersonalInformationHome';
import {
  CompanyFileSourceType,
  CompanyFileType,
} from 'types/company/companyEnums';
import { ButtonExportDropdown } from 'components/buttons/ButtonExportDropdown';
import useAxios from 'hooks/useAxios';
import {
  FinancialYearEditFormFields,
  FinancialYearEditFormType
} from "../../../finance/components/FinancialYearDetail";

interface CompanyFinancialStatementsModelMenuProps {
  onBack: () => void;
  company: CompanyViewDTO;
}

interface CompanyFinancialStatementsModelForm {
  lastFinance: FinancialYearEditFormType;
  prevFinance: FinancialYearEditFormType;
}

const CompanyFinancialStatementsModelMenu = ({
  onBack,
  company,
}: CompanyFinancialStatementsModelMenuProps) => {
  const { snackbarSuccess } = useAction();
  const { fetchAndDownloadFile } = useAxios();

  const [editing, setEditing] = useState<boolean>(false);
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [financialYear, setFinancialYear] = useState<number>();

  const methods = useForm<CompanyFinancialStatementsModelForm>();

  useEffect(() => {
    Promise.all([
      HttpCompanyPatrimonialStatement.getLast(company[EntityWithIdFields.Id]),
      HttpCompanyIncomeStatement.getLast(company[EntityWithIdFields.Id]),
      HttpCompanyPatrimonialStatement.getPrevious(
        company[EntityWithIdFields.Id],
      ),
      HttpCompanyIncomeStatement.getPrevious(company[EntityWithIdFields.Id]),
    ]).then((values) => {
      setFinancialYear(values[0][CompanyBasePatrimonialStatementFields.Year]);

      const lastFinance = {
        [FinancialYearEditFormFields.PatrimonialStatement]: values[0],
        [FinancialYearEditFormFields.IncomeStatement]: values[1],
      };

      const prevFinance = {
        [FinancialYearEditFormFields.PatrimonialStatement]: values[2],
        [FinancialYearEditFormFields.IncomeStatement]: values[3],
      };

      methods.reset({
        lastFinance: lastFinance,
        prevFinance: prevFinance,
      });
    });
  }, [allowEdit, company[EntityWithIdFields.Id]]);

  const onSubmit = (data: CompanyFinancialStatementsModelForm) => {
    const lastFinancial: FinancialYearEditFormType = data.lastFinance;
    const prevFinancial: FinancialYearEditFormType = data.prevFinance;

    Promise.all([
      HttpCompanyPatrimonialStatement.update(
        company[EntityWithIdFields.Id],
        lastFinancial[FinancialYearEditFormFields.PatrimonialStatement][
          EntityWithIdFields.Id
        ],
        lastFinancial[FinancialYearEditFormFields.PatrimonialStatement],
      ),
      HttpCompanyPatrimonialStatement.update(
        company[EntityWithIdFields.Id],
        prevFinancial[FinancialYearEditFormFields.PatrimonialStatement][
          EntityWithIdFields.Id
        ],
        prevFinancial[FinancialYearEditFormFields.PatrimonialStatement],
      ),
      HttpCompanyIncomeStatement.update(
        company[EntityWithIdFields.Id],
        lastFinancial[FinancialYearEditFormFields.IncomeStatement][
          EntityWithIdFields.Id
        ],
        lastFinancial[FinancialYearEditFormFields.IncomeStatement],
      ),
      HttpCompanyIncomeStatement.update(
        company[EntityWithIdFields.Id],
        prevFinancial[FinancialYearEditFormFields.IncomeStatement][
          EntityWithIdFields.Id
        ],
        prevFinancial[FinancialYearEditFormFields.IncomeStatement],
      ),
    ]).then(() => {
      setEditing(false);
      snackbarSuccess('Los estados contables se  actualizaron con éxito');
    });
  };

  const onExportExcel = () =>
    fetchAndDownloadFile(() =>
      HttpCompanyFinance.exportLastToExcel(company[EntityWithIdFields.Id]),
    );

  return (
    <CompanyPersonalInformationContext.Provider
      value={{
        dataId: company[EntityWithIdFields.Id],
        dataSource: CompanyFileSourceType.Company,
        fileType: CompanyFileType.Long,
      }}
    >
      <Stack spacing={2}>
        <FormProvider {...methods}>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography variant="h3" fontWeight={600}>
              Estados Contables
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
                      size={'small'}
                      onClick={() => {
                        setEditing(true);
                      }}
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
            <CompanyFinancialLegalPersonHomeView
              company={company}
              hideFlows
              onAllowEdit={(a: boolean) => {
                setAllowEdit(a);
              }}
            />
          ) : (
            financialYear && (
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        fontWeight={600}
                        fontSize={16}
                        textAlign={'center'}
                      >{`Ejercicio ${financialYear}`}</Typography>
                      <FinancialYearEditComponent
                        year={financialYear}
                        patrimonialNameBase={`lastFinance.${FinancialYearEditFormFields.PatrimonialStatement}`}
                        incomeNameBase={`lastFinance.${FinancialYearEditFormFields.IncomeStatement}`}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        fontWeight={600}
                        fontSize={16}
                        textAlign={'center'}
                      >{`Ejercicio ${financialYear - 1}`}</Typography>
                      <FinancialYearEditComponent
                        year={financialYear - 1}
                        patrimonialNameBase={`prevFinance.${FinancialYearEditFormFields.PatrimonialStatement}`}
                        incomeNameBase={`prevFinance.${FinancialYearEditFormFields.IncomeStatement}`}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )
          )}
        </FormProvider>
      </Stack>
    </CompanyPersonalInformationContext.Provider>
  );
};

export default CompanyFinancialStatementsModelMenu;
