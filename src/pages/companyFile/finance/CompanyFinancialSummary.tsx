import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid } from '@mui/material';

import { CompanyFileHomeContext } from '../CompanyFileHome';
import {
  CompanyFileCompletenessFields,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import {
  CompanyDeclarationOfAssets,
  CompanyFinancialTotals,
} from 'types/company/companyFinanceInformationData';
import { CompanyFlowTotals } from 'types/company/companyFlowData';
import { PersonTypes } from 'types/person/personEnums';
import { MonetizationOnTwoTone } from '@mui/icons-material';
import CardActionButton from '../../../components/cards/CardActionButton';
import { LinearProgressWithTitle } from '../../../components/misc/LinearProgressWithLabel';

export const CompanyFinancialSummaryContext = React.createContext({
  lstFinancialTotals: {} as CompanyFinancialTotals[] | undefined,
  flowTotals: {} as CompanyFlowTotals | undefined,
  declarationOfAssets: {} as CompanyDeclarationOfAssets | undefined,
});

function CompanyFinancialSummary() {
  const { company } = useContext(CompanyFileHomeContext);

  return company &&
    company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Physical ? (
    <CompanyFinancialPhysicalPerson />
  ) : (
    <CompanyFinancialLegalPerson />
  );
}

function CompanyFinancialPhysicalPerson() {
  const navigate = useNavigate();
  //const classes = CompanyFinancialSummaryStyles();

  const { company, companyFileCompleteness } = useContext(
    CompanyFileHomeContext,
  );

  /*    const [declarationOfAssets, setDeclarationOfAssets] = useState<CompanyDeclarationOfAssets>();
        const [flowTotals, setFlowTotals] = useState<CompanyFlowTotals>();

        useEffect(() => {
            if (company) {
                let companyId : number = company[EntityWithIdFields.Id];

                HttpCompanyDeclarationOfAssets.getLastByCompany(companyId)
                    .then(setDeclarationOfAssets);

                HttpCompanyFlow.getList(companyId)
                    .then(flows => {
                        let reduceFlows =
                            flows.slice(0, 12)
                                .reduce((a, b) => {
                                    return {
                                        [CompanyFlowFields.CompanyId]: companyId,
                                        [CompanyFlowFields.Income]: a[CompanyFlowFields.Income] + b[CompanyFlowFields.Income],
                                        [CompanyFlowFields.Outflow]: a[CompanyFlowFields.Outflow] + b[CompanyFlowFields.Outflow]
                                    } as CompanyFlowView
                                });
                        setFlowTotals(reduceFlows)
                    });
            }
        }, [company]);*/

  const goToView = () => (company ? navigate(`eco-financiera`) : null);

  return (
    <CardActionButton
      title={'Información Económica Financiera'}
      subtitle={'Hacé click para ver más de información eco financiera.'}
      icon={<MonetizationOnTwoTone sx={{ fontSize: '80px' }} />}
      content={
        <Grid container>
          {companyFileCompleteness && (
            <LinearProgressWithTitle
              title={'Porcentaje de completitud'}
              value={
                companyFileCompleteness[
                  CompanyFileCompletenessFields
                    .FinancialInformationCompletenessPercentage
                ]
              }
            />
          )}
        </Grid>
      }
      onClick={goToView}
    />
  );
}

function CompanyFinancialLegalPerson() {
  const navigate = useNavigate();
  const { companyFileCompleteness } = useContext(CompanyFileHomeContext);
  /*    const classes = CompanyFinancialSummaryStyles();

        const { company, labelButton } = useContext(CompanyFileHomeContext);

        const [lstFinancialTotals, setFinancialTotals] = useState<CompanyFinancialTotals[]>();
        const [flowTotals, setFlowTotals] = useState<CompanyFlowTotals>();

        useEffect(() => {
            if (company) {
                let companyId : number = company[EntityWithIdFields.Id];

                HttpCompanyFinance.getTotalsByCompanyId(companyId)
                    .then(setFinancialTotals);

                HttpCompanyFlow.getList(companyId)
                    .then(flows => {
                        let reduceFlows = flows.reduce((a, b) => {
                            return {
                                [CompanyFlowFields.CompanyId]: companyId,
                                [CompanyFlowFields.Income]: a[CompanyFlowFields.Income] + b[CompanyFlowFields.Income],
                                [CompanyFlowFields.Outflow]: a[CompanyFlowFields.Outflow] + b[CompanyFlowFields.Outflow]
                            } as CompanyFlowView
                        });
                        setFlowTotals(reduceFlows)
                    });
            }
        }, [company]);*/

  // const goToView = () => company ? navigate(`eco-financiera`) : null;
  const goToView = () => navigate(`eco-financiera`);

  return (
    <CardActionButton
      title={'Información Económica Financiera'}
      subtitle={'Hacé click aquí para ver más de información eco-financiera'}
      icon={<MonetizationOnTwoTone sx={{ fontSize: '80px' }} />}
      content={
        <Grid container>
          {companyFileCompleteness && (
            <LinearProgressWithTitle
              title={'Porcentaje de completitud'}
              value={
                companyFileCompleteness[
                  CompanyFileCompletenessFields
                    .FinancialInformationCompletenessPercentage
                ]
              }
            />
          )}
        </Grid>
      }
      onClick={goToView}
    />
  );
}

/*<CardHeader className={classes.contentHeader} title={"Información Eco Financiera"}/>
                <CompanyFinancialSummaryContext.Provider value={{ lstFinancialTotals, flowTotals, declarationOfAssets: undefined }}>
                    <Grid container
                          spacing={2}
                          pt={1} pr={2} pl={2}
                    >
                        <Grid item xs={6}>
                            {
    
                                company && (!company[CompanyViewDTOFields.DayClosing]) ?
                                    <Typography component="span"
                                                className={classes.dateDescription}
                                    >
                                        Para ver está sección debe completar primero la fecha de cierre
                                    </Typography>
                                    :
                                    <CompanyPatrimonialStatementTable />
                            }
                        </Grid>
                        <Grid item xs={6} container spacing={2} justifyContent="center">
                            <Grid item xs={12}>
                                <CompanyFlowTable />
                            </Grid>
                        </Grid>
                    </Grid>
                </CompanyFinancialSummaryContext.Provider>*/

export default CompanyFinancialSummary;
