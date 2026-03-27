import TabSectionCardHeader from "components/cards/TabSectionCardHeader";
import {AddressBookTabs} from "@phosphor-icons/react";
import {Divider, Grid, Stack} from "@mui/material";
import BCRAQuantityTable from "../../../bureau/BCRA/BCRAQuantityTable";
import {
    AfipActivityFields,
    BouncedChequesFields,
    CurrentDebtFields,
    DebtHistoryDetailFields,
    IdentityFields,
    MetricsFields,
    NosisDetailQueryFields,
    NosisTabSection, PublicDataProvidersFields
} from "types/nosis/nosisData";
import React, {useContext, useMemo} from "react";
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";
import {DataWithLabel} from "components/misc/DataWithLabel";
import {PersonTypes} from "types/person/personEnums";
import {AddressFormatter} from "util/formatters/addressFormatter";
import {EntityAddress, EntityAddressFields} from "types/general/generalReferentialData";
import {dateFormatter} from "util/formatters/dateFormatter";
import TotalBoxComponent from "components/misc/TotalBoxComponent";
import {LufeInformationContext} from "hooks/contexts/LufeInformationContext";
import {LufeDetailFields} from "types/lufe/lufeData";
import {
    LufePymeActivityFields,
    LufePymeCertificateFields,
    LufePymeEmploymentFields,
    LufePymeRequestFields
} from "types/lufe/lufePymeData";
import OffererClientPortfolioSourceData from "./OffererClientPortfolioSourceData";
import {PublicEntityEnums} from "util/typification/publicEntityEnums";

function OffererClientPortfolioSummaryBasicData() {
    const { loading: loadingBureau, error, nosisQuery } = useContext(BureauInformationContext);
    const { lufeData, loading: loadingLufe, error: errorLufe } = useContext(LufeInformationContext);
    
    const hasLufeData = useMemo(() => {
        return lufeData && !loadingLufe && !errorLufe
    }, [loadingLufe, errorLufe, lufeData]);
    
    const identity = nosisQuery?.[NosisDetailQueryFields.Identity];
    const lufePersonery = hasLufeData ? lufeData?.[LufeDetailFields.PymeModelRequest]?.[LufePymeRequestFields.Personery] : undefined;
    const isLegalPerson = !lufePersonery &&
        identity?.[IdentityFields.PersonTypeCode] === PersonTypes.Legal;
    const lufeAddress = hasLufeData ? lufeData?.[LufeDetailFields.PymeModelRequest]?.[LufePymeRequestFields.FiscalAddress] : undefined;
    const address = lufeAddress || AddressFormatter.toFullAddress({
        [EntityAddressFields.Street]:
            identity?.[IdentityFields.FiscalAddressStreet],
        [EntityAddressFields.StreetNumber]:
            identity?.[IdentityFields.FiscalAddressNumber],
        [EntityAddressFields.Floor]: identity?.[IdentityFields.FiscalAddressFloor],
        [EntityAddressFields.Apartment]:
            identity?.[IdentityFields.FiscalAddressApartment],
        [EntityAddressFields.PostalCode]:
            identity?.[IdentityFields.FiscalAddressZipCode],
        [EntityAddressFields.MunicipalityDesc]:
            identity?.[IdentityFields.FiscalAddressMunicipality],
        [EntityAddressFields.ProvinceDesc]:
            identity?.[IdentityFields.FiscalAddressProvince],
    } as EntityAddress);
    
    const mainActivity = useMemo(() => {
        if (!hasLufeData) {
            if (loadingBureau || !nosisQuery) return undefined;
            const act = nosisQuery?.[NosisDetailQueryFields.AfipActivityList]?.find(
                activity => !!(activity?.[AfipActivityFields.MainActivity]),
            )

            return [act?.[AfipActivityFields.ActivityDesc], act?.[AfipActivityFields.SectorDesc]];   
        }
        const act = lufeData?.[LufeDetailFields.PymeModelRequest]?.[LufePymeRequestFields.Activities]?.find(
            (activity) => (activity?.[LufePymeActivityFields.State] === 'AC' && activity?.[LufePymeActivityFields.Current] === 'S'),
        )
        return [act?.[LufePymeActivityFields.ActivityDesc], lufeData?.[LufeDetailFields.PymeModelRequest]?.[LufePymeRequestFields.PymeCertificate]?.[LufePymeCertificateFields.Sector]];
    }, [hasLufeData, loadingBureau, nosisQuery]);
    
    const maxSituation = useMemo(() => {
        if (loadingBureau || !nosisQuery) return undefined;
        
        const debtList = nosisQuery?.[NosisDetailQueryFields.CurrentDebtDetailList];
        
        if (!debtList || !debtList.length) return '-';
        
        return debtList?.reduce(
            (max, current) => {
                return current?.[DebtHistoryDetailFields.SituationCode] > max
                    ? current?.[DebtHistoryDetailFields.SituationCode]
                    : max;
            },
            0,
        );
    }, [loadingBureau, nosisQuery]);

    const currentSituation = useMemo(() => {
        if (loadingBureau || !nosisQuery) return undefined;

        const currentDebt = nosisQuery?.[NosisDetailQueryFields.CurrentDebt];

        if (!currentDebt) return undefined;
        else if (currentDebt[CurrentDebtFields.SitSixQuantity] > 0) return 6;
        else if (currentDebt[CurrentDebtFields.SitFiveQuantity] > 0) return 5;
        else if (currentDebt[CurrentDebtFields.SitFourQuantity] > 0) return 4;
        else if (currentDebt[CurrentDebtFields.SitThreeQuantity] > 0) return 3;
        else if (currentDebt[CurrentDebtFields.SitTwoQuantity] > 0) return 2;
        else if (currentDebt[CurrentDebtFields.SitOneQuantity] > 0) return 1;
        return 0;
    }, [loadingBureau, nosisQuery]);

    const hasNoDebt = useMemo(() => {
        if (loadingBureau || !nosisQuery) return undefined;

        const cheques = nosisQuery?.[NosisDetailQueryFields.BouncedCheques]

        const noDebt = (cheques?.[BouncedChequesFields.OthersQuantity] === 0 && cheques?.[BouncedChequesFields.NoFundsPenaltyQuantity] === 0
            && cheques?.[BouncedChequesFields.NoFundsQuantity] === 0
        );
        
        return noDebt ? "No" : "Sí";
    }, [loadingBureau, nosisQuery]);
    
    const employees = useMemo(() => {
        if (!hasLufeData || !lufeData) return "-";
        
        const employmentList = lufeData?.[LufeDetailFields.PymeModelRequest]?.[LufePymeRequestFields.Employment];
        
        if (!employmentList || employmentList.length === 0) return "-";
        
        const lastEmployment = employmentList.reduce((last, current) => {
            const lastPeriod = Number(last[LufePymeEmploymentFields.Period]) || 0;
            const currentPeriod = Number(current[LufePymeEmploymentFields.Period]) || 0;
            return currentPeriod > lastPeriod ? current : last;
        }, employmentList[0]);
        
        if (!lastEmployment) return "-";
         
        return `${lastEmployment[LufePymeEmploymentFields.EmployeeQuantity] || '-'}`;
    }, [hasLufeData, lufeData])
    
    return (
        <TabSectionCardHeader icon={AddressBookTabs}
                              sectionTitle={"Información General"}>
            <Stack spacing={2}>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Grid container spacing={1}>
                        <Grid item container xs={12} sm={6} spacing={1}>
                            <Grid item xs={12}>
                                <DataWithLabel
                                    label={'Tipo de Persona'}
                                    data={lufePersonery || (isLegalPerson || !identity) ? 'Jurídica' : 'Humana'}
                                    rowDirection
                                    mediumWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DataWithLabel
                                    label={'Actividad Principal'}
                                    data={mainActivity?.[0] ?? "-"}
                                    rowDirection
                                    mediumWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DataWithLabel
                                    label={'Sector'}
                                    data={mainActivity?.[1] ?? "-"}
                                    rowDirection
                                    mediumWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DataWithLabel
                                    label={'Domicilio Fiscal'}
                                    data={address || "-"}
                                    rowDirection
                                    mediumWidth
                                />
                            </Grid>
                        </Grid>

                        <Grid item container xs={12} sm={6} spacing={1}>
                            <Grid item xs={12}>
                                <DataWithLabel
                                    label={'Fecha contrato social'}
                                    data={dateFormatter.toShortDate(
                                        hasLufeData ? lufeData?.[LufeDetailFields.PymeModelRequest]?.[LufePymeRequestFields.SocialContractDate] :
                                        identity?.[IdentityFields.SocialContractDate],
                                    )}
                                    rowDirection
                                    mediumWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DataWithLabel
                                    label={'Categoría PyME'}
                                    data={hasLufeData ? lufeData?.[LufeDetailFields.PymeModelRequest]?.[LufePymeRequestFields.PymeCertificate]?.[LufePymeCertificateFields.Category] :
                                        "-"}
                                    rowDirection
                                    mediumWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DataWithLabel
                                    label={'Fecha Certificado PyME'}
                                    data={hasLufeData ?
                                        dateFormatter.toShortDate(lufeData?.[LufeDetailFields.PymeModelRequest]?.[LufePymeRequestFields.PymeCertificate]?.[LufePymeCertificateFields.EmissionDate]) :
                                        "-"}
                                    rowDirection
                                    mediumWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DataWithLabel
                                    label={'Empleados'}
                                    data={employees}
                                    rowDirection
                                    mediumWidth
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Stack>
                                <OffererClientPortfolioSourceData
                                    source={hasLufeData ? PublicEntityEnums.LUFE : nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.PersonIdentity]?.[PublicDataProvidersFields.ProviderName]}
                                    dateUptade={hasLufeData ? 
                                        lufeData?.[LufeDetailFields.RequestDate] :
                                        nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.PersonIdentity]?.[PublicDataProvidersFields.RequestDate]}
                                />
                            </Stack>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                    </Grid>
                </Stack>
                
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Grid container xs={12} spacing={1}>
                        <Grid item xs={12} sm={4} sx={{ '& > div': { height: '100% !important' } }}>
                            <TotalBoxComponent label={'Score Nosis'}
                                               total={nosisQuery?.[NosisDetailQueryFields.Metrics][MetricsFields.Scoring]}
                                               stackDirection={'column'}
                                               size={'small'}
                                               StackProps={{ alignItems: 'center', height: '100% !important' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ '& > div': { height: '100% !important' } }}>
                                <TotalBoxComponent label={'Máxima Situación BCRA'}
                                                   total={currentSituation}
                                                   stackDirection={'column'}
                                                   subtitle={`Máx. informada últ. 24 meses: ${maxSituation}`}
                                                   size={'small'}
                                                   StackProps={{ alignItems: 'center', height: '100% !important' }}
                                />
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ '& > div': { height: '100% !important' } }}>
                            <TotalBoxComponent label={'¿Tiene Cheques rechazados?'}
                                               total={hasNoDebt || '-'}
                                               stackDirection={'column'}
                                               size={'small'}
                                               StackProps={{ alignItems: 'center', height: '100% !important' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <OffererClientPortfolioSourceData
                                source={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.ScoreMetric]?.[PublicDataProvidersFields.ProviderName]}
                                dateUptade={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.ScoreMetric]?.[PublicDataProvidersFields.RequestDate]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <OffererClientPortfolioSourceData
                                source={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.CurrentEndebtness][PublicDataProvidersFields.ProviderName]}
                                dateUptade={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.CurrentEndebtness][PublicDataProvidersFields.RequestDate]}
                                justifyContent={'center'}
                            />
                        </Grid>
                    </Grid>
                    {/*<TotalBoxComponent label={'¿Adeuda aportes previsionales?'}
                                       total={"No"}
                                       stackDirection={'column'}
                    />*/}
                </Stack>
                
                <Stack spacing={1}>
                    <BCRAQuantityTable debtList={nosisQuery?.[NosisDetailQueryFields.CurrentDebtDetailList] || []}
                                       loading={loadingBureau}
                                       error={error}
                    />
                    
                    <OffererClientPortfolioSourceData
                        source={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.CurrentEndebtness][PublicDataProvidersFields.ProviderName]}
                        dateUptade={nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.CurrentEndebtness][PublicDataProvidersFields.RequestDate]}
                    />
                </Stack>
            </Stack>
        </TabSectionCardHeader>
    )
}

export default OffererClientPortfolioSummaryBasicData;
