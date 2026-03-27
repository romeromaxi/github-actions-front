import React, {useContext, useMemo} from "react";
import {Alert} from "@mui/lab";
import {AlertTitle, Grid, Stack} from "@mui/material";
import {BureauInformationContext, BureauInformationSourceType} from "hooks/contexts/BureauInformationContext";
import {
    CurrentDebtDetailFields,
    CurrentDebtFields,
    NosisDetailQueryFields,
    NosisTabSection,
    PublicDataProvidersFields
} from "types/nosis/nosisData";
import BureauSectionInformationBox from "../components/BureauSectionInformationBox";
import {dateFormatter} from "util/formatters/dateFormatter";
import BureauSectionHeader from "../components/BureauSectionHeader";
import BCRAQuantityTable from "./BCRAQuantityTable";
import EntityEvolutionSituationTable from "./EntityEvolutionSituationTable";
import {LightbulbIcon} from "lucide-react";
import LastTwelveMonthsReportCard from "./LastTwelveMonthsReportCard";
import EntityEvolutionDebtTable from "./EntityEvolutionDebtTable";
import DebtFinancialInfoEmpty from "./DebtFinancialInfoEmpty";

function DebtFinancialInfoTab() {
    const { loading, error, nosisQuery, dataSource } = useContext(BureauInformationContext);
    const isPersonalInfo = dataSource === BureauInformationSourceType.Company;

    const showEmptyState = useMemo(() => {
        if (loading || !nosisQuery) return false;

        const noHasCurrentDebtData = 
            !nosisQuery[NosisDetailQueryFields.CurrentDebt][CurrentDebtFields.SitOneQuantity] &&
            !nosisQuery[NosisDetailQueryFields.CurrentDebt][CurrentDebtFields.SitTwoQuantity] &&
            !nosisQuery[NosisDetailQueryFields.CurrentDebt][CurrentDebtFields.SitThreeQuantity] &&
            !nosisQuery[NosisDetailQueryFields.CurrentDebt][CurrentDebtFields.SitFourQuantity] &&
            !nosisQuery[NosisDetailQueryFields.CurrentDebt][CurrentDebtFields.SitFiveQuantity] &&
            !nosisQuery[NosisDetailQueryFields.CurrentDebt][CurrentDebtFields.SitSixQuantity];
        
        return (
            noHasCurrentDebtData && 
            !(nosisQuery?.[NosisDetailQueryFields.CurrentDebtDetailList].length) &&
            !(nosisQuery?.[NosisDetailQueryFields.DebtHistoryDetailList].length) &&
            !(nosisQuery?.[NosisDetailQueryFields.CurrentDebtLastTwelveMonthsLst].length)
        )
    }, [loading, nosisQuery])

    const irregularSituationQuantity = useMemo(() => {
        if (!nosisQuery) return 0;

        const currentDebtList = nosisQuery?.[NosisDetailQueryFields.CurrentDebtDetailList] || []

        return currentDebtList.filter(x => x[CurrentDebtDetailFields.SituationCode] > 1).length;
    }, [nosisQuery])

    const subheaderComponent = (
        <Stack direction={{ xs: 'column', md: 'row'}}
               spacing={2}
        >
            {
                !showEmptyState &&
                    <BureauSectionInformationBox label={'Entidades'}
                                                 data={`${nosisQuery?.[NosisDetailQueryFields.CurrentDebtDetailList].length || '-'}`}
                                                 width={1}
                    />
            }

            <BureauSectionInformationBox label={'Fuente'}
                                         data={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.CurrentEndebtness][PublicDataProvidersFields.ProviderName]}
                                         width={1}
            />

            <BureauSectionInformationBox label={'Último mes informado'}
                                         data={dateFormatter.toShortDate(nosisQuery?.[NosisDetailQueryFields.ProcessDateDebt])}
                                         width={1}
            />

            <BureauSectionInformationBox label={'Última actualización'}
                                         data={dateFormatter.toShortDate(nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.CurrentEndebtness][PublicDataProvidersFields.RequestDate])}
                                         width={1}
            />
        </Stack>
    )

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <BureauSectionHeader title={'Créditos en el sistema financiero'}
                                     subtitle={`Acá podés ver cómo ${isPersonalInfo ? 'te' : 'la'} evalúan las entidades financieras y de riesgo crediticio. Esta información reúne ${isPersonalInfo ? 'tus' : 'los'} vínculos crediticios, la situación de cada uno, la evolución en el tiempo y los montos informados, para que entiendas mejor ${isPersonalInfo ? 'tu' : 'el'} perfil financiero.`}
                >
                    {subheaderComponent}
                </BureauSectionHeader>
            </Grid>
            
            {
                showEmptyState ?
                    <Grid item xs={12}>
                        <DebtFinancialInfoEmpty label={`Aún no ${isPersonalInfo ? 'tenés' : 'tiene'} financiamiento activo con ninguna entidad.`} />
                    </Grid>
                    :
                    <React.Fragment>
                        {
                            irregularSituationQuantity > 0 &&
                            <Grid item xs={12}>
                                <Alert color={'warning'}
                                       severity={'warning'}
                                       role={'disclaimer'}
                                       variant={'filled'}
                                       size={'small'}
                                       icon={false}
                                >
                                    <AlertTitle>
                                        {
                                            irregularSituationQuantity > 1 ?
                                                'Algunas entidades informan una situación crediticia irregular asociada a tu PyME'
                                                :
                                                'Una de las entidades informa una situación crediticia irregular asociada a tu PyME'
                                        }
                                    </AlertTitle>
                                    Te recomendamos intentar regularizarla contactándote con la entidad, ya que esto puede ayudarte a acceder a mejores condiciones al buscar financiamiento. <strong>Tené en cuenta que esta información se actualiza de forma periódica y los datos informados pueden no estar completamente actualizados</strong>.
                                </Alert>
                            </Grid>
                        }
            
                        <Grid item xs={12}>
                            <BCRAQuantityTable title={isPersonalInfo ? 'Tu situación crediticia por entidad' : 'Situación crediticia por entidad'}
                                               subtitle={`Acá podés ver todas las entidades financieras con las que ${isPersonalInfo ? 'tenés' : 'tiene'} una relación crediticia. Para cada una, mostramos el monto total y la situación en la que ${isPersonalInfo ? 'te encontrás' : 'se encuentra'} actualmente.`}
                                               debtList={nosisQuery?.[NosisDetailQueryFields.CurrentDebtDetailList] || []}
                                               loading={loading}
                                               error={error}
                            />
                        </Grid>
            
                        <Grid item xs={12}>
                            <EntityEvolutionSituationTable title={'Evolución anual de la situación por entidad'}
                                                           subtitle={`Acá podés ver, por cada entidad, cómo fue cambiando ${isPersonalInfo ? 'tu' : 'la'} situación crediticia a lo largo del año.`}
                                                           latestDebts={nosisQuery?.[NosisDetailQueryFields.CurrentDebtLastTwelveMonthsLst]}
                                                           loading={loading}
                                                           error={error}
                            />
                        </Grid>
            
                        <Grid item xs={12}>
                            <Alert color={'info'}
                                   severity={'info'}
                                   role={'disclaimer'}
                                   variant={'filled'}
                                   size={'small'}
                                   icon={<LightbulbIcon />}
                            >
                                <AlertTitle>
                                    ¿Sabías que el concepto de deuda no siempre es negativo?
                                </AlertTitle>
                                Lo que estás viendo no representa pagos vencidos ni obligaciones impagas, sino el nivel de relación crediticia que tu PyME mantiene con cada entidad financiera.
                            </Alert>
                        </Grid>
            
                        <Grid item xs={12}>
                            <LastTwelveMonthsReportCard title={'Evolución de Deuda Informada'}
                                                        subtitle={<React.Fragment>{`Este gráfico muestra cómo fue variando en el tiempo el monto total informado de ${isPersonalInfo ? 'tu' : 'la'} PyME en el sistema financiero`}. <strong>No representa deuda vencida ni pagos pendientes</strong>, sino el nivel de relación crediticia informado por las entidades.</React.Fragment>}
                                                        debtHistoryDetailList={nosisQuery?.[NosisDetailQueryFields.DebtHistoryDetailList]}
                            />
                        </Grid>
            
                        <Grid item xs={12}>
                            <EntityEvolutionDebtTable title={'Detalle de la evolución de deuda informada por entidad'}
                                                      subtitle={<React.Fragment>Esta tabla muestra el monto informado por cada entidad financiera, mes a mes. Los valores reflejan la relación crediticia registrada y <strong>no implican deuda vencida ni pagos pendientes</strong>.</React.Fragment>}
                                                      latestDebts={nosisQuery?.[NosisDetailQueryFields.CurrentDebtLastTwelveMonthsLst]}
                                                      loading={loading}
                                                      error={error}
                            />
                        </Grid>
                    </React.Fragment>
            }
        </Grid>
    )
}

export default DebtFinancialInfoTab;