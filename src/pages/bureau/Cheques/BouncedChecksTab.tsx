import React, {useContext, useMemo} from "react";
import {Grid, Stack} from "@mui/material";
import {BureauInformationContext, BureauInformationSourceType} from "hooks/contexts/BureauInformationContext";
import {
    BouncedChequesFields,
    IdentityFields,
    NosisDetailQueryFields,
    NosisTabSection, PublicDataProvidersFields
} from "types/nosis/nosisData";
import {PersonTypes} from "types/person/personEnums";
import BureauSectionHeader from "../components/BureauSectionHeader";
import BureauSectionInformationBox from "../components/BureauSectionInformationBox";
import BouncedChecksEmpty from "./BouncedChecksEmpty";
import BouncedChequesQuantityTable from "./BouncedChequesQuantityTable";
import BouncedChequesTable from "./BouncedChequesTable";
import {dateFormatter} from "util/formatters/dateFormatter";

function BouncedChecksTab() {
    const { loading, error, nosisQuery, dataSource } = useContext(BureauInformationContext);
    const isPersonalInfo = dataSource === BureauInformationSourceType.Company;
    
    const isLegalPerson = useMemo(() =>
            nosisQuery?.[NosisDetailQueryFields.Identity][IdentityFields.PersonTypeCode] === PersonTypes.Legal
        , [nosisQuery]);

    const hasNoDebt = useMemo(() => {
        const cheques = nosisQuery?.[NosisDetailQueryFields.BouncedCheques]

        return (cheques?.[BouncedChequesFields.OthersQuantity] === 0 && cheques?.[BouncedChequesFields.NoFundsPenaltyQuantity] === 0
            && cheques?.[BouncedChequesFields.NoFundsQuantity] === 0
        )
    }, [nosisQuery]);
    
    const showSourceAndUpdateDate = useMemo(() => (
        !loading && !hasNoDebt
    ), [loading, hasNoDebt])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <BureauSectionHeader title={'Cheques'}
                                     subtitle={`En esta sección podés ver el estado de los cheques asociados a ${isPersonalInfo ? 'tu' : 'la'} PyME, incluyendo si existen o no cheques rechazados y su evolución en el tiempo. Esta información es utilizada por las entidades para evaluar el comportamiento financiero.`}
                                     action={
                                         !showSourceAndUpdateDate ?
                                             <BureauSectionInformationBox label={'Fuente'}
                                                                          data={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.RejectedCheques][PublicDataProvidersFields.ProviderName]}
                                                                          width={'130px'}
                                             />
                                             :
                                             undefined
                                     }
                >
                    {
                        showSourceAndUpdateDate ?
                            <Stack direction={{ xs: 'column', md: 'row'}}
                                   spacing={2}>
                                <BureauSectionInformationBox label={'Fuente'}
                                                             data={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.RejectedCheques][PublicDataProvidersFields.ProviderName]}
                                                             width={1}
                                />

                                <BureauSectionInformationBox label={'Última actualización'}
                                                             data={dateFormatter.toShortDate(nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.RejectedCheques][PublicDataProvidersFields.RequestDate])}
                                                             width={1}
                                />
                            </Stack>
                            :
                            undefined
                    }
                </BureauSectionHeader>
            </Grid>

            {
                hasNoDebt ?
                    <Grid item xs={12}>
                        <BouncedChecksEmpty lastDate={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.RejectedCheques][PublicDataProvidersFields.RequestDate]} />
                    </Grid>
                    :
                    <React.Fragment>
                        <Grid item xs={12}>
                            <BouncedChequesQuantityTable bouncedCheques={nosisQuery?.[NosisDetailQueryFields.BouncedChequesDetailList]}
                                                         isLegalPerson={isLegalPerson}
                                                         loading={loading}
                                                         error={error}
                                                         lastDate={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.RejectedCheques][PublicDataProvidersFields.RequestDate]}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <BouncedChequesTable title={'Detalle de cheques rechazados'}
                                                 subtitle={'Detalle individual de cada cheque rechazado y su situación registrada.'}
                                                 bouncedCheques={nosisQuery?.[NosisDetailQueryFields.BouncedChequesDetailList]}
                                                 businessNamePerson={nosisQuery?.[NosisDetailQueryFields.Identity]?.[IdentityFields.BusinessName]}
                                                 isLegalPerson={isLegalPerson}
                                                 loading={loading}
                                                 error={error}
                            />
                        </Grid>
                    </React.Fragment>
            }

        </Grid>
    )
}

export default BouncedChecksTab;