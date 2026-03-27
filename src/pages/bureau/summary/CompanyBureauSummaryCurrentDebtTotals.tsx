import React, {useMemo} from "react";
import {CurrentDebt, CurrentDebtFields} from "types/nosis/nosisData";
import CompanyBureauSummaryTotalsComponent from "./CompanyBureauSummaryTotalsComponent";

interface CompanyBureauSummaryCurrentDebtTotalsProps {
    debt?: CurrentDebt,
    loading?: boolean,
    onClick: () => void
}

function CompanyBureauSummaryCurrentDebtTotals({debt, loading, onClick}: CompanyBureauSummaryCurrentDebtTotalsProps) {
    
    const componentProps = useMemo(() => {
        let normalSituation = 0
        let irregularSituation = 0
        let returnedProps = {
            title: '',
            color: 'main',
            quantityHighlighted: 0,
            total: 0
        }
        
        if (!debt) {
            return returnedProps
        }

        if (!!debt[CurrentDebtFields.SitOneQuantity] && debt[CurrentDebtFields.SitOneQuantity] !== 0) {
            normalSituation += debt[CurrentDebtFields.SitOneQuantity];
        }

        if (!!debt[CurrentDebtFields.SitTwoQuantity] && debt[CurrentDebtFields.SitTwoQuantity] !== 0) {
            irregularSituation += debt[CurrentDebtFields.SitTwoQuantity];
        }

        if (!!debt[CurrentDebtFields.SitThreeQuantity] && debt[CurrentDebtFields.SitThreeQuantity] !== 0) {
            irregularSituation += debt[CurrentDebtFields.SitThreeQuantity];
        }

        if (!!debt[CurrentDebtFields.SitFourQuantity] && debt[CurrentDebtFields.SitFourQuantity] !== 0) {
            irregularSituation += debt[CurrentDebtFields.SitFourQuantity];
        }

        if (!!debt[CurrentDebtFields.SitFiveQuantity] && debt[CurrentDebtFields.SitFiveQuantity] !== 0) {
            irregularSituation += debt[CurrentDebtFields.SitFiveQuantity];
        }

        if (!!debt[CurrentDebtFields.SitSixQuantity] && debt[CurrentDebtFields.SitSixQuantity] !== 0) {
            irregularSituation += debt[CurrentDebtFields.SitSixQuantity];
        }

        if (irregularSituation > 0) {
            returnedProps.quantityHighlighted = irregularSituation;
            returnedProps.color = 'warning.main';
            returnedProps.title = 'Entidades en situación irregular'
        } else {
            returnedProps.quantityHighlighted = normalSituation;
            returnedProps.color = 'success.main';
            returnedProps.title = 'Entidades en situación normal';
        }
        
        returnedProps.total = normalSituation + irregularSituation
        
        return returnedProps
    }, [debt])
    
    return (
        <CompanyBureauSummaryTotalsComponent title={componentProps.title} 
                                             description={"Con las que tenés vínculo crediticio según BCRA, por estado de situación"} 
                                             quantityHighlighted={componentProps.quantityHighlighted}
                                             total={componentProps.total}
                                             color={componentProps.color} 
                                             onClick={onClick}
                                             loading={loading}
        />
    )
}

export default CompanyBureauSummaryCurrentDebtTotals;