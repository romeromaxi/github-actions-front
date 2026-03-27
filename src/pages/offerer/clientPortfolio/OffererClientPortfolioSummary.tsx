import {Alert, Box, Button, Card, CardContent, Grid, Link, Stack} from "@mui/material";
import {ChartLineUp, CurrencyCircleDollar, Shuffle} from "@phosphor-icons/react";
import TabSectionCardHeader from "components/cards/TabSectionCardHeader";
import {OffererClientPortfolioDetail} from "types/offerer/clientPortfolioData";
import {Skeleton} from "@mui/lab";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import CompanyFlowYearlyTotals from "../../company/flow/CompanyFlowYearlyTotals";
import CompanyFlowChart from "../../company/flow/CompanyFlowChart";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {FlowUseContext} from "../../../hooks/contexts/FlowUseContext";
import {BalancesContext, BalancesSourceType} from "../../../hooks/contexts/BalancesContext";
import {FinancialIndicators, FinancialYearFields} from "../../../types/general/generalFinanceData";
import {HttpClientPortfolioPatrimonial} from "../../../http/clientPortfolio/httpClientPortfolioPatrimonial";
import {HttpClientPortfolioIncome} from "../../../http/clientPortfolio/HttpClientPortfolioIncome";
import {EntityWithIdFields} from "../../../types/baseEntities";
import CompanyFinancialPatrimonialYearlyTotals
    from "../../companyFile/finance/components/CompanyFinancialPatrimonialYearlyTotals";
import {
    ClientPortfolioIncomeLastYearStatementFields,
    ClientPortfolioPatrimonialStatementFields
} from "../../../types/offerer/clientPortfolioFinancialData";
import {CompanyFinancialTotalsFields} from "../../../types/company/companyFinanceInformationData";
import CompanyFinancialResultYearlyTotals
    from "pages/companyFile/finance/components/CompanyFinancialResultYearlyTotals";
import {useNavigate} from "react-router-dom";
import OffererClientPortfolioSummaryBasicData from "./components/OffererClientPortfolioSummaryBasicData";
import {LufeInformationContext} from "../../../hooks/contexts/LufeInformationContext";
import {Document} from "../../../types/files/filesData";
import {HttpFilesClientPortfolio} from "../../../http/files/httpFilesClientPortfolio";
import {LufeDetailFields} from "../../../types/lufe/lufeData";
import {LufeFinanceIndicatorFields} from "../../../types/lufe/lufeFinanceIndicators";
import OffererClientPortfolioSummaryFinancialIndicators
    from "./components/OffererClientPortfolioSummaryFinancialIndicators";
import {HttpClientPortfolioBalances} from "../../../http/clientPortfolio/httpClientPortfolio";
import FinancialYearDetail from "../../company/finance/components/FinancialYearDetail";
import OffererClientPortfolioSourceData from "./components/OffererClientPortfolioSourceData";
import {PublicEntityEnums} from "../../../util/typification/publicEntityEnums";

interface OffererClientPortfolioSummaryProps {
    prospect?: OffererClientPortfolioDetail
}

export enum LastYearSource {
    Lufe = 1,
    Own = 2,
    Both = 3
}

function OffererClientPortfolioSummary({ prospect }: OffererClientPortfolioSummaryProps) {
    const navigate = useNavigate();
    const {flowLst} = useContext(FlowUseContext);
    const { balances, loading: loadingBalances, reloadData, clearDetail } = useContext(BalancesContext);
    const { lufeFiles, lufeData, loading: loadingLufe } = useContext(LufeInformationContext)

    const [files, setFiles] = useState<Document[]>();
    const [lastYearSrc, setLastYearSrc] = useState<LastYearSource>(LastYearSource.Both);
    const [lastOwnIndicators, setLastOwnIndicators] = useState<FinancialIndicators>();
    const [editingBalance, setEditingBalance] = useState<boolean>(false);
    const [balanceTotals, setBalanceTotals] = useState<any>(undefined);

    const lastBalance = useMemo(() => {
        if (loadingBalances || !balances) {
            setBalanceTotals(undefined);
            setLastOwnIndicators(undefined);
            return undefined;
        }

        if (balances.length === 0) return undefined;

        return balances.reduce((max, current) => {
            return current[FinancialYearFields.Year] > max[FinancialYearFields.Year] ? current : max;
        });
    }, [balances, loadingBalances]);

    const numberOfDocuments = useMemo(() => {
        if (!lufeFiles && !files) return undefined;

        let quantity = 0;

        if (lufeFiles) quantity += lufeFiles.length;

        if (files) quantity += files.length;

        return quantity;
    }, [lufeFiles, files]);

    const lastFinanceIndicator = useMemo(() => {
        if (!lufeData) return undefined;

        const indicators = lufeData[LufeDetailFields.FinanceIndicatorsModelRequest];

        if (!indicators || indicators.length === 0) return undefined;

        return indicators.reduce((max, current) => {
            const maxPeriod = max[LufeFinanceIndicatorFields.Period] ?? "";
            const curPeriod = current[LufeFinanceIndicatorFields.Period] ?? "";

            return curPeriod > maxPeriod ? current : max;
        });
    }, [lufeData]);

    const indicatorsInfo = useMemo(() => {
        let lastYear: string = '-';
        let yearSource: LastYearSource = LastYearSource.Both;

        if (lastFinanceIndicator && !lastOwnIndicators) {
            yearSource = LastYearSource.Lufe;
            lastYear = lastFinanceIndicator[LufeFinanceIndicatorFields.Period].substring(0, 4);
        }
        else if (lastOwnIndicators && !lastFinanceIndicator) {
            yearSource = LastYearSource.Own;
            lastYear = `${lastOwnIndicators[FinancialYearFields.Year]}`;
        }
        else if (lastOwnIndicators && lastFinanceIndicator) {
            // Tomar el más reciente entre ambos
            const lufeLastYear = Number(lastFinanceIndicator[LufeFinanceIndicatorFields.Period].substring(0, 4));
            const ownLastYear = lastOwnIndicators[FinancialYearFields.Year];

            if (lufeLastYear > ownLastYear) {
                yearSource = LastYearSource.Lufe;
                lastYear = `${lufeLastYear}`;
            }
            else if (ownLastYear > lufeLastYear) {
                yearSource = LastYearSource.Own;
                lastYear = `${ownLastYear}`;
            }
            else {
                lastYear = `${ownLastYear}`;
                yearSource = LastYearSource.Both;
            }
        }

        return { lastYear, yearSource };
    }, [lastFinanceIndicator, lastOwnIndicators]);

    useEffect(() => {
        setLastYearSrc(indicatorsInfo.yearSource);
    }, [indicatorsInfo.yearSource]);

    useEffect(() => {
        const prospectId = prospect?.[EntityWithIdFields.Id];
        if (!!prospectId && !lastOwnIndicators) {
            HttpClientPortfolioBalances.getIndicators(prospectId)
                .then(response => {
                    if (response && !!response.length)
                        setLastOwnIndicators(response[0])
                })
                .catch(console.error);
        }
    }, [prospect, lastOwnIndicators]);

    useEffect(() => {
        const prospectId = prospect?.[EntityWithIdFields.Id];
        if (prospectId && !files) {
            HttpFilesClientPortfolio.getFiles(prospectId)
                .then(setFiles)
                .catch(console.error);
        }
    }, [prospect, files]);

    useEffect(() => {
        const prospectId = prospect?.[EntityWithIdFields.Id];
        if (lastBalance && prospectId && !balanceTotals) {
            Promise.all([
                HttpClientPortfolioPatrimonial.getById(
                    prospectId,
                    lastBalance[FinancialYearFields.PatrimonialStatementId],
                ),
                HttpClientPortfolioIncome.getById(
                    prospectId,
                    lastBalance[FinancialYearFields.PatrimonialStatementId],
                ),
            ])
                .then(([patrimonialData, incomeData]) => {
                    const actualDate = lastBalance[FinancialYearFields.Date];
                    const prevDate = new Date(`${patrimonialData[ClientPortfolioPatrimonialStatementFields.LastPatrimonialStatement][FinancialYearFields.Year]}/01/01`);

                    setBalanceTotals([
                        {
                            ...patrimonialData,
                            ...incomeData,
                            [CompanyFinancialTotalsFields.Date]: actualDate
                        },
                        {
                            ...(patrimonialData[ClientPortfolioPatrimonialStatementFields.LastPatrimonialStatement]),
                            ...(incomeData[ClientPortfolioIncomeLastYearStatementFields.LastYearIncomeStatement]),
                            [CompanyFinancialTotalsFields.Date]: prevDate
                        }
                    ]);
                })
                .catch(console.error);
        }
    }, [prospect, lastBalance, balanceTotals]);

    const goToTab = (tab: string) => {
        navigate(`/offerer/clientPortfolio/${prospect?.id ?? ''}?tab=${tab}`);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const goToDocuments = () => goToTab('files');

    const goToAllBalances = () => {
        reloadData();
        clearDetail();
        setEditingBalance(false);
        goToTab('financial-statements');
    }

    const goToFlowDetail = () => goToTab('post-balance-flows');

    const goToFinancialIndicatorsLufe = () => goToTab('financial-indicators');

    const reloadLastBalance = () => {
        reloadData();
        setEditingBalance(false);
    }

    if (!prospect) {
        return (
            <Stack>
                <Skeleton />
            </Stack>
        )
    }
    
    return (
        <Stack spacing={1.5}>
            <Card>
                <CardContent>
                    <TypographyBase>
                        <Box component="span">
                            {`Tenés ${numberOfDocuments} ${numberOfDocuments === 1 ? 'documento' : 'documentos'} asociados a esta empresa. `}
                            <Link underline='none' onClick={goToDocuments} sx={{ display: 'inline' }}>Visualizalos</Link>
                            {` en la solapa de documentos`}
                        </Box>
                    </TypographyBase>
                </CardContent>
            </Card>

            <OffererClientPortfolioSummaryBasicData />

            <TabSectionCardHeader icon={CurrencyCircleDollar}
                                  sectionTitle={"Último estado contable"}
                                  actions={(
                                      <Stack direction={'row'} spacing={1}>
                                          {
                                              lastBalance ?
                                                  editingBalance ?
                                                      <Button size={'small'}
                                                              onClick={() => setEditingBalance(false)}>
                                                          Cerrar edición
                                                      </Button>
                                                      :
                                                      <Button variant={'contained'} size={'small'}
                                                              onClick={() => setEditingBalance(true)}>
                                                          Editar
                                                      </Button>
                                                  :
                                                  null
                                          }
                                          <Button variant={'contained'} size={'small'}
                                                  onClick={goToAllBalances}>
                                              Ver todos los EECC
                                          </Button>
                                      </Stack>
                                  )}
            >
                {
                    loadingBalances ?
                        <Skeleton variant="rectangular" width="100%" />
                        :
                        lastBalance ?
                            <Stack spacing={3}>
                                {
                                    editingBalance ?
                                        <FinancialYearDetail dataId={prospect[EntityWithIdFields.Id]}
                                                             dataSource={BalancesSourceType.ClientPortfolio}
                                                             financialYear={lastBalance}
                                                             onAfterUpdate={reloadLastBalance}
                                        />
                                        :
                                        <React.Fragment>
                                            <CompanyFinancialPatrimonialYearlyTotals totals={balanceTotals} />
                                            <CompanyFinancialResultYearlyTotals totals={balanceTotals} />
                                        </React.Fragment>
                                }
                            </Stack>
                            :
                            <TypographyBase color="text.secondary">
                                No se encontraron estados contables.
                            </TypographyBase>
                }
            </TabSectionCardHeader>

            {
                flowLst && flowLst.length !== 0 &&
                <TabSectionCardHeader icon={Shuffle}
                                      sectionTitle={"Movimientos Post Balance"}
                                      spacingChildren={2}
                                      actions={(
                                          <Stack direction={'row'} spacing={1}>
                                              <Button variant={'contained'} size={'small'} onClick={goToFlowDetail}>
                                                  Ver más
                                              </Button>
                                          </Stack>
                                      )}
                >
                    <CompanyFlowYearlyTotals flowList={flowLst} />

                    <Stack spacing={0.5}>
                        <TypographyBase fontWeight={500}>Relación entre compras y ventas</TypographyBase>
                        <CompanyFlowChart flowList={flowLst} />
                    </Stack>
                </TabSectionCardHeader>
            }
            {
                !lastFinanceIndicator && !lastOwnIndicators ?
                    <TabSectionCardHeader sectionTitle={"Indicadores Financieros"}
                                          icon={ChartLineUp}
                    >
                        <Alert severity="info">

                            <TypographyBase>
                                <Box component="span">
                                    {`No contás con datos de indicadores financieros. Cargá un `}
                                    <Link underline='none' onClick={goToAllBalances} sx={{ display: 'inline' }}>Estado Contable</Link>
                                    {` para poder observar esta sección.`}
                                </Box>
                            </TypographyBase>
                        </Alert>
                    </TabSectionCardHeader>
                    :
                    (lastFinanceIndicator || lastOwnIndicators) &&
                    <TabSectionCardHeader sectionTitle={"Indicadores Financieros"}
                                          sectionSubheader={`Año analizado: ${indicatorsInfo.lastYear}`}
                                          icon={ChartLineUp}
                                          actions={(
                                              <Stack direction={'row'} spacing={1}>
                                                  <Button variant={'contained'} size={'small'} onClick={goToFinancialIndicatorsLufe}>
                                                      Ver más indicadores
                                                  </Button>
                                              </Stack>
                                          )}
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <OffererClientPortfolioSummaryFinancialIndicators lufeIndicator={lastFinanceIndicator}
                                                                                  financialIndicators={lastOwnIndicators}
                                                                                  yearSrc={lastYearSrc}
                                />
                            </Grid>

                            {
                                lufeData && !loadingLufe &&
                                <Grid item xs={12}>
                                    <OffererClientPortfolioSourceData
                                        source={PublicEntityEnums.LUFE}
                                        dateUptade={lufeData[LufeDetailFields.RequestDate]}
                                        justifyContent={'flex-end'}
                                    />
                                </Grid>
                            }

                        </Grid>
                    </TabSectionCardHeader>
            }
        </Stack>
    )
}

export default OffererClientPortfolioSummary;