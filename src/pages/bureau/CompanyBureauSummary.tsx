import React, {ReactElement, useContext, useMemo} from "react";
import {Grid} from "@mui/material";
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";
import {
    BouncedChequesFields,
    NosisDetailQueryFields,
    NosisDetailSummaryFields,
    NosisQueryFields
} from "types/nosis/nosisData";
import CompanyBureauSummaryCurrentDebtTotals from "./summary/CompanyBureauSummaryCurrentDebtTotals";
import ScoreCard from "./Score/ScoreCard";
import CompanyBureauSummaryTotalsComponent from "./summary/CompanyBureauSummaryTotalsComponent";
import {useAppNavigation} from "hooks/navigation";
import {PymeRoute} from "routes/pyme/routeAppPymeData";
import CompanyBureauSummaryIndicators from "./summary/CompanyBureauSummaryIndicators";
import {PersonTypes} from "types/person/personEnums";
import BureauAlertByProfileStatus from "./components/BureauAlertByProfileStatus";

enum BureauSummaryItemFields {
    Indicator = 'indicador',
    IndicatorDesc = 'descIndicador',
    Result = 'resultado',
    Refference = 'referencia'
}

interface BureauSummaryItem {
    [BureauSummaryItemFields.Indicator]: string,
    [BureauSummaryItemFields.IndicatorDesc]: string,
    [BureauSummaryItemFields.Result]: ReactElement,
    [BureauSummaryItemFields.Refference]: string
}


interface CompanyBureauSummaryProps {
    companyId?: number,
}

const CompanyBureauSummary = ({ companyId } : CompanyBureauSummaryProps) => {
    const { navigate } = useAppNavigation();
    const { loading, nosisQuery, optionSelected } = useContext(BureauInformationContext);
    const summary = nosisQuery?.[NosisDetailQueryFields.Summary];
    
    const physicalPerson = useMemo(() => (
        optionSelected && optionSelected[NosisQueryFields.PersonTypeCode] === PersonTypes.Physical
    ), [optionSelected])
    
    const bouncedCheques = useMemo(() => {
        if (!summary) return 0;
        const cheques = summary[NosisDetailSummaryFields.BouncedCheques];
        
        return cheques[BouncedChequesFields.NoFundsQuantity] 
            + cheques[BouncedChequesFields.OthersQuantity] 
            + cheques[BouncedChequesFields.NoFundsPenaltyQuantity];
    }, [summary]);

    const handleGoToCurrentDebtTab = () => {
        if (!!companyId)
            navigate(PymeRoute.PymeInfoBureauBankInfo,
                { companyId: companyId },
                undefined,
                { replace: true }
            )
    }

    const handleGoToChecksTab = () => {
        if (!!companyId)
            navigate(PymeRoute.PymeInfoBureauChecksInfo,
                { companyId: companyId },
                undefined,
                { replace: true }
            )
    }

    const handleGoToScoreTab = () => {
        if (!!companyId)
            navigate(PymeRoute.PymeInfoBureauScoreInfo,
                { companyId: companyId },
                undefined,
                { replace: true }
            )
    }
    
    return (
        <Grid container spacing={3}>
            <BureauAlertByProfileStatus nosisQuery={nosisQuery} />
            
            <Grid item xs={12} md={6}>
                <CompanyBureauSummaryCurrentDebtTotals debt={summary?.[NosisDetailSummaryFields.CurrentDebt]}
                                                       onClick={handleGoToCurrentDebtTab}
                                                       loading={loading}
                />
            </Grid>
            
            <Grid item xs={12} md={6}>
                <CompanyBureauSummaryTotalsComponent title={"Cheques Rechazados"}
                                                     description={"Cantidad de cheques emitidos sin fondos o no pagados por otros motivos, según BCRA en los últimos 12 meses"}
                                                     quantityHighlighted={bouncedCheques}
                                                     color={bouncedCheques > 0 ? 'warning.main' : 'success.main'}
                                                     onClick={handleGoToChecksTab}
                                                     loading={loading}
                />
            </Grid>
            
            <Grid item xs={12}>
                <ScoreCard title={'Score crediticio'}
                           description={"Nivel de riesgo crediticio de una persona o empresa en base a su historial crediticio. Los valores más altos representan un menor riesgo crediticio"}
                           scoring={summary?.[NosisDetailSummaryFields.Scoring]}
                           onClick={handleGoToScoreTab}
                           loading={loading}
                />
            </Grid>

            {
                !physicalPerson &&
                    <Grid item xs={12}>
                        <CompanyBureauSummaryIndicators companyId={companyId}
                                                        indicators={summary?.[NosisDetailSummaryFields.FinanceIndicators]}
                                                        loading={loading}
                        />
                    </Grid>
            }
        </Grid>
    )
}


export default CompanyBureauSummary