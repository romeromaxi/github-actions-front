import React, {useContext} from "react";
import {BureauInformationContext, BureauInformationSourceType} from "hooks/contexts/BureauInformationContext";
import {AlertTitle, Grid, Link, Stack} from "@mui/material";
import {
    NosisDetailQueryFields,
    NosisDetailSummaryFields,
    NosisTabSection,
    PublicDataProvidersFields
} from "types/nosis/nosisData";
import MetricsTable from "./MetricsTable";
import BureauSectionHeader from "../components/BureauSectionHeader";
import ScoreCard from "./ScoreCard";
import BureauSectionInformationBox from "../components/BureauSectionInformationBox";
import {dateFormatter} from "util/formatters/dateFormatter";
import {Alert} from "@mui/lab";
import {LightbulbIcon} from "lucide-react";

function ScoreTab() {
    const { loading, error, nosisQuery, dataSource } = useContext(BureauInformationContext);
    const isPersonalInfo = dataSource === BureauInformationSourceType.Company;

    const openNosisTab = () =>
        window.open('https://www.nosis.com/es', '_blank');

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <BureauSectionHeader title={'Score crediticio'}
                                     subtitle={`Puntaje de riesgo crediticio calculado por Nosis en base a información de burós y registros públicos. Es uno de los indicadores que las entidades financieras consideran al evaluar solicitudes de financiamiento.`}
                >
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                        <BureauSectionInformationBox label={'Fuente'}
                                                     data={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.ScoreMetric]?.[PublicDataProvidersFields.ProviderName]}
                                                     width={1}
                        />

                        <BureauSectionInformationBox label={'Información actualizada'}
                                                     data={dateFormatter.toShortDate(nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.ScoreMetric]?.[PublicDataProvidersFields.RequestDate])}
                                                     width={1}
                        />
                    </Stack>
                </BureauSectionHeader>
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
                        ¿Cómo leer este score?
                    </AlertTitle>
                    El score es provisto por Nosis y es una de las referencias que utilizan las entidades financieras al evaluar solicitudes.
                    <strong> Puede no reflejar cambios recientes o la situación completa de {isPersonalInfo ? 'tu' : 'la'} PyME</strong>, por lo que suele analizarse junto con otros indicadores y documentación.
                    Si tenés más dudas sobre este indicador podés <Link color={'inherit'} onClick={openNosisTab}>consultar la web de Nosis</Link>.
                </Alert>
            </Grid>

            <Grid item xs={12}>
                <ScoreCard title={isPersonalInfo ? 'Tu score' : 'Score'}
                           description={`Este es el valor actual ${isPersonalInfo ? 'de tu' : 'del'} score crediticio según la información disponible. Las entidades utilizan este indicador como una de las referencias para evaluar solicitudes de financiamiento.`}
                           scoring={nosisQuery?.[NosisDetailQueryFields.Metrics]?.[NosisDetailSummaryFields.Scoring]}
                           loading={loading}
                           includeReferences
                />
            </Grid>

            <Grid item xs={12}>
                <MetricsTable title={'Tendencia'} 
                              description={`Evolución ${isPersonalInfo ? 'de tu' : 'del'} score crediticio en distintos períodos de tiempo. Permite identificar si el riesgo crediticio de ${isPersonalInfo ? 'tu' : 'la'} PyME se mantiene estable, mejora o empeora.`}
                              metrics={nosisQuery?.[NosisDetailQueryFields.Metrics]}
                              loading={loading}
                              error={error}
                />
            </Grid>
        </Grid>
    )
}

export default ScoreTab;
