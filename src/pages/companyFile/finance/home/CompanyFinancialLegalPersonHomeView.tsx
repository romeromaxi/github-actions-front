import React, { useContext, useEffect, useState } from 'react';
import {
  CompanyBasePatrimonialStatement,
  CompanyBasePatrimonialStatementFields,
  CompanyFinancialTotals,
  CompanyFinancialTotalsFields,
  CompanyIncomeLastYearStatement,
  CompanyIncomeLastYearStatementFields,
  CompanyIncomeStatement,
  CompanyPatrimonialStatement,
  CompanyPatrimonialStatementFields,
} from 'types/company/companyFinanceInformationData';
import { EntityWithIdFields } from 'types/baseEntities';
import {
  HttpCompanyFile,
  HttpCompanyFinance,
  HttpCompanyIncomeStatement,
  HttpCompanyPatrimonialStatement,
} from 'http/index';
import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material';
import { CompanyViewDTOFields } from 'types/company/companyData';
import { DataWithLabel } from 'components/misc/DataWithLabel';
import CompanyFinancialLastYear from '../CompanyFinancialLastYear';
import { Alert } from '@mui/lab';
import { CompanyFinancialHomeContext } from '../CompanyFinancialHome';
import CompanyPatrimonialStatementTableDetail from '../components/CompanyPatrimonialStatementTableDetail';
import CompanyIncomeStatementTableDetail from '../components/CompanyIncomeStatementTableDetail';
import { CompanyFinancialPersonHomeViewProps } from './CompanyFinancialHomeView';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CompanyFinanceIndicatorsDialog from '../components/CompanyFinanceIndicatorsDialog';
import { CompanyFileSourceType } from '../../../../types/company/companyEnums';
import { PersonTypes } from '../../../../types/person/personEnums';
import { useNavigate } from 'react-router-dom';
import CompanyLegalFinanceTabs from './CompanyLegalFinanceTabs';
import { CompanyPersonalInformationContext } from '../../company/CompanyPersonalInformationHome';
import { useAction } from '../../../../hooks/useAction';
import {FinancialYearFields} from "../../../../types/general/generalFinanceData";

export const sortByDateDesc = (
  a: CompanyFinancialTotals,
  b: CompanyFinancialTotals,
): number => {
  return a[CompanyFinancialTotalsFields.Date] <
    b[CompanyFinancialTotalsFields.Date]
    ? 1
    : -1;
};

function CompanyFinancialLegalPersonHomeView({
  company,
  hideFlows = false,
  onAllowEdit,
  allowEdit
}: CompanyFinancialPersonHomeViewProps) {
  const { dataId, dataSource } = useContext(CompanyPersonalInformationContext);
  const { snackbarSuccess } = useAction();
  const [isLoading, setLoading] = useState<boolean>();
  const [lastFinancialTotals, setFinancialTotals] =
    useState<CompanyFinancialTotals[]>();
  const [prevFinancialTotals, setPrevFinancialTotals] =
    useState<CompanyFinancialTotals[]>();
  const [lastPatrimonial, setLastPatrimonial] =
    useState<CompanyPatrimonialStatement>();
  const [prevPatrimonial, setPrevPatrimonial] =
    useState<CompanyPatrimonialStatement>();
  const [lastIncome, setLastIncome] =
    useState<CompanyIncomeLastYearStatement>();
  const [prevIncome, setPrevIncome] =
    useState<CompanyIncomeLastYearStatement>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (dataId && dataSource) {
      if (dataSource == CompanyFileSourceType.Company) loadData();
      else loadDataFromFile(dataId);
    }
  }, [company, dataId, dataSource]);

  const loadData = () => {
    if (company) {
      setLoading(true);
      let companyId: number = company[EntityWithIdFields.Id];

      Promise.all([
        HttpCompanyFinance.getTotalsByCompanyId(companyId),
        HttpCompanyFinance.getPreviousTotalsByCompanyId(companyId),
      ]).then((values) => {
        const lastFinancial: CompanyFinancialTotals[] =
          values[0].sort(sortByDateDesc);
        const prevFinancial: CompanyFinancialTotals[] =
          values[1].sort(sortByDateDesc);
        setFinancialTotals(lastFinancial);
        setPrevFinancialTotals(prevFinancial);
        setLoading(false);
        onAllowEdit && onAllowEdit(true);
      });

      Promise.all([
        HttpCompanyPatrimonialStatement.getLast(companyId),
        HttpCompanyPatrimonialStatement.getPrevious(companyId),
      ]).then((values) => {
        setLastPatrimonial(values[0]);
        setPrevPatrimonial(values[1]);
      });

      Promise.all([
        HttpCompanyIncomeStatement.getLast(companyId),
        HttpCompanyIncomeStatement.getPrevious(companyId),
      ]).then((values) => {
        setLastIncome(values[0]);
        setPrevIncome(values[1]);
      });
    }
  };

  const loadDataFromFile = (fileId: number) => {
    setLoading(true);
    Promise.all([
      HttpCompanyFile.getCompanyFinanceLastTotalsByFileId(fileId),
      HttpCompanyFile.getCompanyFinancePreviousTotalsByFileId(fileId),
    ]).then((values) => {
      const lastFinancial: CompanyFinancialTotals[] =
        values[0].sort(sortByDateDesc);
      const prevFinancial: CompanyFinancialTotals[] =
        values[1].sort(sortByDateDesc);
      setFinancialTotals(lastFinancial);
      setPrevFinancialTotals(prevFinancial);
      setLoading(false);
    });

    Promise.all([
      HttpCompanyFile.getCompanyLastPatrimonialStateByFileId(fileId),
      HttpCompanyFile.getCompanyPreviousPatrimonialStateByFileId(fileId),
    ]).then((values) => {
      setLastPatrimonial(values[0]);
      setPrevPatrimonial(values[1]);
    });

    Promise.all([
      HttpCompanyFile.getCompanyLastIncomeStateByFileId(fileId),
      HttpCompanyFile.getCompanyPreviousIncomeStateByFileId(fileId),
    ]).then((values) => {
      setLastIncome(values[0]);
      setPrevIncome(values[1]);
    });
  };

  const onUpdateLastYearClosing = (year: number) => {
    if (company) {
      Promise.all([
        HttpCompanyFinance.insert(company[EntityWithIdFields.Id], {
          [FinancialYearFields.Year]: year,
        }),
        HttpCompanyFinance.insert(company[EntityWithIdFields.Id], {
          [FinancialYearFields.Year]: year - 1,
        }),
      ]).then(() => {
        loadData();
        snackbarSuccess('Se cambió el año de último balance');
      });
    }
  };

  return (
    <CompanyFinancialHomeContext.Provider
      value={{
        company,
        lastFinancialTotals,
        dateDeclarationOfAssets: undefined,
        setDateDeclarationOfAssets: () => {},
      }}
    >
      <Grid container spacing={2}>
        {!window.location.toString().includes('solicitationFile') && (
          <Grid item xs={12}>
            {hideFlows ? (
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {company &&
                        !!company[CompanyViewDTOFields.DayClosing] &&
                        !!company[CompanyViewDTOFields.MonthClosing] && (
                          <DataWithLabel
                            label={'Fecha de Cierre'}
                            data={`${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`}
                            rowDirection
                          />
                        )}
                    </Grid>

                    {company && (
                      <Grid item xs={12} container alignItems={'center'}>
                        <Grid item xs={12}>
                          <CompanyFinancialLastYear allowEdit={allowEdit}
                            onSubmit={onUpdateLastYearClosing}
                          />
                        </Grid>
                        {/*
                                                        window.location.toString().includes("?tipo=2") &&
                                                        <Grid item xs={2}>
                                                            <SearchButton startIcon={<SearchRounded/>}
                                                                          size='medium'
                                                                          onClick={() => {
                                                                              setOpen(true)
                                                                          }}
                                                            >
                                                                Ver indicadores
                                                            </SearchButton>
                                                        </Grid>
                                                         */}
                      </Grid>
                    )}
                    <CompanyFinanceIndicatorsDialog
                      open={open}
                      company={company}
                      loading={isLoading}
                      onClose={() => {
                        setOpen(false);
                      }}
                    />
                  </Grid>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {company &&
                    !!company[CompanyViewDTOFields.DayClosing] &&
                    !!company[CompanyViewDTOFields.MonthClosing] && (
                      <DataWithLabel
                        label={'Fecha de Cierre'}
                        data={`${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`}
                        rowDirection
                      />
                    )}
                </Grid>

                {company && (
                  <Grid item xs={12} container alignItems={'center'}>
                    <Grid item xs={12}>
                      <CompanyFinancialLastYear
                        onSubmit={onUpdateLastYearClosing}
                        allowEdit={allowEdit}
                      />
                    </Grid>
                    {/*
                                                window.location.toString().includes("?tipo=2") &&
                                                <Grid item xs={2}>
                                                    <SearchButton startIcon={<SearchRounded/>}
                                                                  size='medium'
                                                                  onClick={() => {
                                                                      setOpen(true)
                                                                  }}
                                                    >
                                                        Ver indicadores
                                                    </SearchButton>
                                                </Grid>
                                                 */}
                  </Grid>
                )}
                <CompanyFinanceIndicatorsDialog
                  open={open}
                  company={company}
                  loading={isLoading}
                  onClose={() => {
                    setOpen(false);
                  }}
                />
              </Grid>
            )}
          </Grid>
        )}

        <Grid item xs={12} mt={2}>
          {!isLoading &&
          company &&
          !!company[CompanyViewDTOFields.DayClosing] &&
          !!company[CompanyViewDTOFields.MonthClosing] &&
          lastFinancialTotals &&
          lastFinancialTotals.length !== 0 &&
          prevFinancialTotals &&
          prevFinancialTotals.length !== 0 &&
          lastPatrimonial &&
          prevPatrimonial &&
          lastIncome &&
          prevIncome ? (
            <CompanyLegalFinanceTabs
              lastFinancialTotals={lastFinancialTotals}
              prevFinancialTotals={prevFinancialTotals}
              hideFlows={hideFlows}
            />
          ) : (
            <Alert severity="info">
              Para ver esta sección debe completar primero la fecha de cierre
            </Alert>
          )}
        </Grid>
      </Grid>
    </CompanyFinancialHomeContext.Provider>
  );
}

interface CompanyFinancialYearTabProps {
  dataId: number;
  patrimonial: CompanyPatrimonialStatement | undefined;
  income: CompanyIncomeLastYearStatement | undefined;
  editAllowed?: boolean;
  dataSource?: CompanyFileSourceType;
}

export function CompanyFinancialYearTab({
  dataId,
  patrimonial,
  income,
  editAllowed = true,
  dataSource = CompanyFileSourceType.Company,
}: CompanyFinancialYearTabProps) {
  const navigate = useNavigate();
  const prevPatrimonial: CompanyBasePatrimonialStatement | undefined =
    patrimonial?.[CompanyPatrimonialStatementFields.LastPatrimonialStatement];
  const prevIncome: CompanyIncomeStatement | undefined =
    income?.[CompanyIncomeLastYearStatementFields.LastYearIncomeStatement];

  return (
    <Grid container spacing={2}>
      {patrimonial && prevPatrimonial && (
        <Grid item xs={6}>
          <Card>
            <CardHeader
              title={'Estado de Situación Patrimonial'}
              action={
                editAllowed && (
                  <Button
                    variant={'contained'}
                    id={'hideInPdf'}
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => {
                      navigate(
                        `?edit=${patrimonial[CompanyBasePatrimonialStatementFields.FinancialYearId]}&type=${PersonTypes.Legal}&patrimonial`,
                      );
                    }}
                  >
                    Editar
                  </Button>
                )
              }
            />
            <CardContent>
              <CompanyPatrimonialStatementTableDetail
                firstYear={patrimonial}
                secondYear={prevPatrimonial}
              />
            </CardContent>
          </Card>
        </Grid>
      )}
      {income && prevIncome && (
        <Grid item xs={6}>
          <Card>
            <CardHeader
              title={'Estado de Resultado'}
              action={
                editAllowed && (
                  <Button
                    variant={'contained'}
                    id={'hideInPdf2'}
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => {
                      navigate(
                        `?edit=${income[CompanyBasePatrimonialStatementFields.FinancialYearId]}&type=${PersonTypes.Legal}&income`,
                      );
                    }}
                  >
                    Editar
                  </Button>
                )
              }
            />
            <CardContent>
              <CompanyIncomeStatementTableDetail
                firstYear={income}
                secondYear={prevIncome}
              />
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}

export default CompanyFinancialLegalPersonHomeView;
