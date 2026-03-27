import React, { useEffect, useState } from 'react';
import { useQuery } from 'hooks/useQuery';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { Card, CardContent, Grid, Skeleton, Stack } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import { BackButton } from 'components/buttons/Buttons';
import CardHeaderWithBorder from 'components/cards/CardHeaderWithBorder';

import {
  CompanyFlowInsertRequest,
  CompanyFlowInsertRequestFields,
  CompanyFlowView,
} from 'types/company/companyFlowData';
import {
  CompanyDeclarationOfAssets,
  CompanyFinancialTotals
} from 'types/company/companyFinanceInformationData';

import {
  HttpCompanyDeclarationOfAssets,
  HttpCompanyFinance,
  HttpCompanyFlow,
  HttpCompanyIncomeStatement,
  HttpCompanyPatrimonialStatement,
} from 'http/index';

import { EnumColors } from 'types/general/generalEnums';
import { BaseRequestFields, EntityWithIdFields } from 'types/baseEntities';
import { CompanyViewDTO } from 'types/company/companyData';

import CompanyFlowEdit from './CompanyFlowEdit';
import CompanyFinancialYearEdit from './CompanyFinancialYearEdit';

import { getBaseColor } from 'util/typification/generalColors';
import { PersonTypes } from 'types/person/personEnums';
import CompanyDeclarationOfAssetsEdit from './CompanyDeclarationOfAssetsEdit';
import CompanyFinancialHomeView from './home/CompanyFinancialHomeView';
import { useAction } from '../../../hooks/useAction';
import {
  FinancialYearEditFormFields,
  FinancialYearEditFormType
} from "../../company/finance/components/FinancialYearDetail";
import {FinancialYearFields} from "../../../types/general/generalFinanceData";

export const CompanyFinancialHomeContext = React.createContext({
  company: {} as CompanyViewDTO | undefined,
  lastFinancialTotals: {} as CompanyFinancialTotals[] | undefined,
  dateDeclarationOfAssets: undefined as Date | undefined,
  setDateDeclarationOfAssets: (date: Date | undefined) => {},
});

function CompanyFinancialHome() {
  let { companyId } = useParams();
  let hasParamEdit = useQuery().has('edit');
  let paramEdit = parseInt(useQuery().get('edit') || '0');
  let paramPersonType = parseInt(useQuery().get('type') || '0');

  return hasParamEdit ? (
    paramEdit ? (
      paramPersonType ? (
        paramPersonType === PersonTypes.Physical ? (
          <CompanyDeclarationOfAssetsHomeEdit
            companyId={parseInt(companyId || '0')}
            declarationOfAssetsId={paramEdit}
          />
        ) : (
          <CompanyFinancialHomeEdit
            companyId={parseInt(companyId || '0')}
            financialYearId={paramEdit}
          />
        )
      ) : null
    ) : (
      <CompanyFlowHomeEdit companyId={parseInt(companyId || '0')} />
    )
  ) : (
    <CompanyFinancialHomeView companyId={parseInt(companyId || '0')} />
  );
}

interface CompanyFinancialHomeProps {
  companyId: number;
}

interface CompanyFinancialHomeEditProps extends CompanyFinancialHomeProps {
  financialYearId: number;
}

export function CompanyFinancialHomeEdit({
  companyId,
  financialYearId,
}: CompanyFinancialHomeEditProps) {
  const navigate = useNavigate();
  const { setTitle, snackbarSuccess } = useAction();
  //const titleBase : string = "Edición Información Económica Financiera";
  const [loading, setLoading] = useState<boolean>(true);
  const [financialYear, setFinancialYear] = useState<number>();
  const [secondYear, setSecondYear] = useState<number>();

  const methods = useForm<FinancialYearEditFormType>();

  const goToBack = () => navigate(-1);

  const mapActionTitle = () => (
    <Stack direction="row" spacing={1}>
      <BackButton onClick={goToBack}>Legajo de Contacto</BackButton>
    </Stack>
  );

  const onHandleSubmit = (data: FinancialYearEditFormType) => {
    Promise.all([
      HttpCompanyPatrimonialStatement.update(
        companyId,
        data[FinancialYearEditFormFields.PatrimonialStatement][
          EntityWithIdFields.Id
        ],
        data[FinancialYearEditFormFields.PatrimonialStatement],
      ),
      HttpCompanyIncomeStatement.update(
        companyId,
        data[FinancialYearEditFormFields.IncomeStatement][EntityWithIdFields.Id],
        data[FinancialYearEditFormFields.IncomeStatement],
      ),
    ]).then(() => {
      navigate(-1);
      snackbarSuccess('El año fue actualizado correctamente');
    });
  };

  useEffect(() => {
    HttpCompanyFinance.getById(companyId, financialYearId).then(
      (financialYear) => {
        //setTitle(`${titleBase}: Año ${financialYear[CompanyFinancialYearFields.Year]}`, mapActionTitle());
        Promise.all([
          HttpCompanyPatrimonialStatement.getById(
            companyId,
            financialYear[FinancialYearFields.PatrimonialStatementId],
          ),
          HttpCompanyIncomeStatement.getById(
            companyId,
            financialYear[FinancialYearFields.IncomeStatementId],
          ),
        ])
          .then((values) => {
            methods.reset({
              [FinancialYearEditFormFields.PatrimonialStatement]: values[0],
              [FinancialYearEditFormFields.IncomeStatement]: values[1],
            });
            setFinancialYear(values[0][FinancialYearFields.Year]);
            setSecondYear(values[1][FinancialYearFields.Year]);
          })
          .finally(() => {
            setLoading(false);
          });
      },
    );
  }, []);

  return (
    <Stack mt={3} spacing={1}>
      <Grid container spacing={2}>
        <FormProvider {...methods}>
          {loading ? (
            Array.from(Array(26).keys()).map((item) => (
              <Grid container>
                <Card sx={{ width: '100%' }}>
                  <CardContent sx={{ alignItems: 'center' }}>
                    <Grid
                      item
                      xs={12}
                      key={`keyCardBaseLoading_${item}`}
                      alignItems={'center'}
                    >
                      <Skeleton sx={{ width: '100%' }} />
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <CompanyFinancialYearEdit
              onSubmit={onHandleSubmit}
              currentYear={financialYear}
              lastYear={financialYear - 1}
            />
          )}
        </FormProvider>
      </Grid>
    </Stack>
  );
}

function CompanyFlowHomeEdit({ companyId }: CompanyFinancialHomeProps) {
  const navigate = useNavigate();
  const { setTitle } = useAction();

  const [flowList, setFlowList] = useState<CompanyFlowView[]>();

  const methods = useForm<CompanyFlowInsertRequest>({
    defaultValues: {
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    },
  });

  const goToBack = () => navigate(-1);

  const mapActionTitle = () => (
    <Stack direction="row" spacing={1}>
      <BackButton size={'small'} onClick={goToBack}>
        Volver
      </BackButton>
    </Stack>
  );

  const loadFlowList = () => {
    HttpCompanyFlow.getList(companyId).then((response) => {
      const editableFlows = response.splice(0, 18);
      setFlowList(response);

      methods.reset(
        {
          ...methods.getValues(),
          [CompanyFlowInsertRequestFields.FlowList]: editableFlows,
        },
        { keepDefaultValues: true },
      );
    });
  };

  useEffect(() => {
    loadFlowList();
  }, []);

  setTitle('Edición Información Eco Financiera', mapActionTitle());

  return (
    <Stack mt={3} spacing={1}>
      <Grid container spacing={2}>
        <FormProvider {...methods}>
          <CompanyFlowEdit />
        </FormProvider>
      </Grid>
    </Stack>
  );
}

interface CompanyDeclarationOfAssetsHomeEditProps
  extends CompanyFinancialHomeProps {
  declarationOfAssetsId: number;
}

function CompanyDeclarationOfAssetsHomeEdit({
  companyId,
  declarationOfAssetsId,
}: CompanyDeclarationOfAssetsHomeEditProps) {
  const navigate = useNavigate();

  const methods = useForm<CompanyDeclarationOfAssets>();

  const goToBack = () => navigate(-1);

  const mapActionTitle = () => (
    <Stack direction="row" spacing={1}>
      <BackButton onClick={goToBack}>Volver</BackButton>
    </Stack>
  );

  const onHandleSubmit = (data: CompanyDeclarationOfAssets) => {
    HttpCompanyDeclarationOfAssets.update(
      companyId,
      declarationOfAssetsId,
      data,
    ).then(() => {
      navigate(-1);
    });
  };

  useEffect(() => {
    HttpCompanyDeclarationOfAssets.getById(
      companyId,
      declarationOfAssetsId,
    ).then(methods.reset);
  }, []);

  return (
    <Stack mt={3} spacing={1}>
      <CardHeaderWithBorder
        baseColor={EnumColors.GREY_GRADIENT}
        title="Edición Información Eco Financiera"
        avatar={
          <QueryStatsIcon
            fontSize={'small'}
            sx={{ color: getBaseColor(EnumColors.LIGHTBLUE) }}
          />
        }
        sx={{ borderRadius: '8px !important', marginTop: '8px' }}
        action={mapActionTitle()}
      />

      <Grid container spacing={2}>
        <FormProvider {...methods}>
          <CompanyDeclarationOfAssetsEdit onSubmit={onHandleSubmit} />
        </FormProvider>
      </Grid>
    </Stack>
  );
}

export default CompanyFinancialHome;
