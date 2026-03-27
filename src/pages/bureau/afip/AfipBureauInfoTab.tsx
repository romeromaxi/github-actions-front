import React, {useContext} from "react";
import {BureauInformationContext, BureauInformationSourceType} from "hooks/contexts/BureauInformationContext";
import {AlertTitle, Grid, Link, Stack} from "@mui/material";
import BureauSectionHeader from "../components/BureauSectionHeader";
import BureauSectionInformationBox from "../components/BureauSectionInformationBox";
import {NosisDetailQueryFields, NosisTabSection, PublicDataProvidersFields} from "types/nosis/nosisData";
import AfipIdentityMainData from "./AfipIdentityMainData";
import {Alert} from "@mui/lab";
import {LightbulbIcon} from "lucide-react";
import AfipActivitiesTable from "./AfipActivitiesTable";
import AfipIdentityTaxesTable from "./AfipIdentityTaxesTable";
import {dateFormatter} from "util/formatters/dateFormatter";
import {PublicEntityEnums} from "util/typification/publicEntityEnums";

function AfipBureauInfoTab() {
    const { loading, error, nosisQuery, dataSource } = useContext(BureauInformationContext);
    const isPersonalInfo = dataSource === BureauInformationSourceType.Company;
    const providerName = nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.AfipActivity][PublicDataProvidersFields.ProviderName] || PublicEntityEnums.ARCA;
    
    const openArcaTab = () =>
        window.open('https://www.afip.gob.ar/', '_blank');

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <BureauSectionHeader title={'Información fiscal'}
                                     subtitle={`Esta sección muestra información pública de ${isPersonalInfo ? 'tu' : 'la'} PyME provista por ${providerName}. Los datos no pueden ser editados desde LUC y son los que las entidades financieras utilizan para evaluar ${isPersonalInfo ? 'tu' : 'su'} perfil.`}
                >
                    <Stack direction={{ xs: 'column', md: 'row'}}
                           spacing={2}>
                        <BureauSectionInformationBox label={'Fuente'}
                                                     data={providerName}
                                                     width={1}
                        />
                        
                        <BureauSectionInformationBox label={'Última actualización'}
                                                     data={dateFormatter.toShortDate(nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.PersonIdentity][PublicDataProvidersFields.RequestDate])}
                                                     width={1}
                        />
                    </Stack>
                </BureauSectionHeader>
            </Grid>

            <Grid item xs={12}>
                <AfipIdentityMainData identity={nosisQuery?.[NosisDetailQueryFields.Identity]}
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
                        ¿Crees que alguno de estos datos es incorrecto?
                    </AlertTitle>
                    Nosotros extraemos esta información de ARCA. SI crees que algún dato es incorrecto, podes solicitar ayuda <Link color={'inherit'} onClick={openArcaTab}>acá</Link>.
                </Alert>
            </Grid>

            <Grid item xs={12}>
                <AfipActivitiesTable title={'Actividades en las que se encuentra inscripto'}
                                     subtitle={`Detalle de las actividades económicas declaradas por ${isPersonalInfo ? 'tu' : 'la'} PyME ante ${providerName}. Esta información ayuda a las entidades a entender el tipo de operación y rubro de ${isPersonalInfo ? 'tu' : 'su'} negocio.`}
                                     activities={nosisQuery?.[NosisDetailQueryFields.AfipActivityList]}
                                     loading={loading}
                                     error={error}
                />
            </Grid>

            <Grid item xs={12}>
                <AfipIdentityTaxesTable title={'Impuestos en las que se encuentra inscripto'}
                                        subtitle={`Listado de los impuestos y regímenes en los que ${isPersonalInfo ? 'tu' : 'la'} PyME se encuentra registrada según ${providerName}. Incluye el período informado y es utilizado como referencia fiscal por las entidades financieras.`}
                                        taxes={nosisQuery?.[NosisDetailQueryFields.IdentityTaxesList]}
                                        loading={loading}
                                        error={error}
                />
            </Grid>
        </Grid>
    )
}

export default AfipBureauInfoTab;