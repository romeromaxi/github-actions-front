import React, { useEffect, useState } from 'react';
import { useQuery } from 'hooks/useQuery';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import { Grid, Slide } from '@mui/material';

import { LoaderBlockUI } from 'components/loader';
import { CloseIconButton } from 'components/buttons/Buttons';
import CardHeaderWithBorder from 'components/cards/CardHeaderWithBorder';

import { CompanyFileHomeBaseProps } from '../CompanyFileHome';

import { EntityWithIdFields } from 'types/baseEntities';
import { EnumColors } from 'types/general/generalEnums';

import { getBaseColor } from 'util/typification/generalColors';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CompanyFinancialYearEdit from '../finance/CompanyFinancialYearEdit';

import {
  HttpCompanyFinance,
  HttpCompanyIncomeStatement,
  HttpCompanyPatrimonialStatement,
} from 'http/index';
import {
  CompanyFinancialTotals,
  CompanyFinancialTotalsFields,
  CompanyFinancialYearEditForm
} from 'types/company/companyFinanceInformationData';
import CompanyFinancialSummaryFinancialYear from '../finance/CompanyFinancialSummaryFinancialYear';
import {IncomeStatementFields, PatrimonialStatementFields} from "../../../types/general/generalFinanceData";
import { FinancialYearEditFormFields } from 'pages/company/finance/components/CompanyFinancialYearDetail';

interface CompanyFileHomeEditFinanceProps extends CompanyFileHomeBaseProps {
  physicalPerson?: boolean;
}

function CompanyFileHomeEditFinance({
  company,
  physicalPerson,
}: CompanyFileHomeEditFinanceProps) {
  const navigate = useNavigate();
  let paramId = parseInt(useQuery().get('id') || '0');
  const companyId: number = company ? company[EntityWithIdFields.Id] : 0;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [financeIndex, setFinanceIndex] = useState<number>();

  const [lstFinancialTotals, setFinancialTotals] =
    useState<CompanyFinancialTotals[]>();

  const methods = useForm<CompanyFinancialYearEditForm>();
  const watchActiveCurrent = methods.watch(
    `${FinancialYearEditFormFields.PatrimonialStatement}.${PatrimonialStatementFields.ActiveCurrentTotal}`,
  );
  const watchActiveNotCurrent = methods.watch(
    `${FinancialYearEditFormFields.PatrimonialStatement}.${PatrimonialStatementFields.ActiveNotCurrentTotal}`,
  );
  const watchActiveTotal = methods.watch(
    `${FinancialYearEditFormFields.PatrimonialStatement}.${PatrimonialStatementFields.ActiveTotal}`,
  );

  const watchPassiveCurrent = methods.watch(
    `${FinancialYearEditFormFields.PatrimonialStatement}.${PatrimonialStatementFields.PassiveCurrentTotal}`,
  );
  const watchPassiveNotCurrent = methods.watch(
    `${FinancialYearEditFormFields.PatrimonialStatement}.${PatrimonialStatementFields.PassiveNotCurrentTotal}`,
  );
  const watchPassiveTotal = methods.watch(
    `${FinancialYearEditFormFields.PatrimonialStatement}.${PatrimonialStatementFields.PassiveTotal}`,
  );

  const watchNetPatrimonyTotal = methods.watch(
    `${FinancialYearEditFormFields.PatrimonialStatement}.${PatrimonialStatementFields.NetPatrimonyTotal}`,
  );

  const watchIncomeTotal = methods.watch(
    `${FinancialYearEditFormFields.IncomeStatement}.${IncomeStatementFields.IncomeTotal}`,
  );

  useEffect(() => {
    if (companyId) {
      HttpCompanyFinance.getTotalsByCompanyId(companyId).then((totals) => {
        let totalEdit = totals.filter(
          (x) => x[EntityWithIdFields.Id] === paramId,
        );

        if (totalEdit) {
          Promise.all([
            HttpCompanyPatrimonialStatement.getById(
              companyId,
              totalEdit[0][CompanyFinancialTotalsFields.PatrimonialStatementId],
            ),
            HttpCompanyIncomeStatement.getById(
              companyId,
              totalEdit[0][CompanyFinancialTotalsFields.IncomeStatementId],
            ),
          ]).then((values) => {
            methods.reset({
              [FinancialYearEditFormFields.PatrimonialStatement]: values[0],
              [FinancialYearEditFormFields.IncomeStatement]: values[1],
            });
            setFinancialTotals(totals);
            setFinanceIndex(totals.indexOf(totalEdit[0]));
          });
        } else {
          navigate(-1);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (lstFinancialTotals && financeIndex != undefined) {
      let auxList = [...lstFinancialTotals];

      if (auxList) {
        auxList[financeIndex] = {
          ...auxList[financeIndex],
          [CompanyFinancialTotalsFields.ActiveCurrentTotal]: watchActiveCurrent,
          [CompanyFinancialTotalsFields.ActiveNotCurrentTotal]:
            watchActiveNotCurrent,
          [CompanyFinancialTotalsFields.ActiveTotal]: watchActiveTotal,
          [CompanyFinancialTotalsFields.PassiveCurrentTotal]:
            watchPassiveCurrent,
          [CompanyFinancialTotalsFields.PassiveNotCurrentTotal]:
            watchPassiveNotCurrent,
          [CompanyFinancialTotalsFields.PassiveTotal]: watchPassiveTotal,
          [CompanyFinancialTotalsFields.NetPatrimonyTotal]:
            watchNetPatrimonyTotal,
          [CompanyFinancialTotalsFields.IncomeTotal]: watchIncomeTotal,
        };

        setFinancialTotals(auxList);
      }
    }
  }, [
    watchActiveTotal,
    watchActiveCurrent,
    watchActiveNotCurrent,
    watchPassiveTotal,
    watchPassiveCurrent,
    watchPassiveNotCurrent,
    watchNetPatrimonyTotal,
    watchIncomeTotal,
  ]);

  const onHandleSubmit = (data: CompanyFinancialYearEditForm) => {
    if (lstFinancialTotals && financeIndex != undefined) {
      setLoading(true);

      let financial = lstFinancialTotals[financeIndex];

      let patrimonialStatementId: number =
        financial[CompanyFinancialTotalsFields.PatrimonialStatementId];
      let incomeStatementId: number =
        financial[CompanyFinancialTotalsFields.IncomeStatementId];

      Promise.all([
        HttpCompanyPatrimonialStatement.update(
          companyId,
          patrimonialStatementId,
          data[FinancialYearEditFormFields.PatrimonialStatement],
        ),
        HttpCompanyIncomeStatement.update(
          companyId,
          incomeStatementId,
          data[FinancialYearEditFormFields.IncomeStatement],
        ),
      ])
        .then(() => {
          navigate(-1);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <CardHeaderWithBorder
        baseColor={EnumColors.GREY_GRADIENT}
        title={'Información Económica Financiera'}
        avatar={
          <QueryStatsIcon
            fontSize={'small'}
            sx={{ color: getBaseColor(EnumColors.LIGHTBLUE) }}
          />
        }
        action={<CloseIconButton onClick={() => navigate(-1)} />}
        sx={{ marginBottom: '8px' }}
      />

      <Slide direction="right" in mountOnEnter timeout={600}>
        <Grid container spacing={2} justifyContent="end">
          <Grid item xs={12} sx={{ zoom: '85%' }}>
            <CompanyFinancialSummaryFinancialYear
              lstFinancialTotals={lstFinancialTotals}
            />
          </Grid>
          <Grid item xs={12}>
            <FormProvider {...methods}>
              <CompanyFinancialYearEdit onSubmit={onHandleSubmit} />
            </FormProvider>
          </Grid>
        </Grid>
      </Slide>

      {isLoading && <LoaderBlockUI />}
    </>
  );
}

export default CompanyFileHomeEditFinance;
