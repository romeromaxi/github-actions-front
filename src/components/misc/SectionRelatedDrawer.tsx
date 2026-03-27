import {Sections} from "types/general/generalEnums";
import FinancialDrawerNew from "pages/company/finance/FinancialDrawerNew";
import React from "react";
import NewRelatedPersonMultipleDrawer from "pages/company/relatedPeople/NewRelatedPersonMultipleDrawer";
import {FinancialYearInsert} from "types/general/generalFinanceData";
import useAxios from "hooks/useAxios";
import {HttpCompanyDeclarationOfAssets, HttpCompanyFinance} from "http/index";
import {BaseResponseFields} from "types/baseEntities";
import {useAction} from "hooks/useAction";
import CompanyFinanceHeaderDrawer from "pages/company/finance/CompanyFinanceHeaderDrawer";

interface SectionRelatedDrawerProps {
    open: boolean,
    section: number,
    companyId: number,
    isLegalPerson: boolean,
    onClose: () => void,
    onReloadRelatedData: () => void,
}

const SectionRelatedDrawer = (props: SectionRelatedDrawerProps) => {
    const { fetchData } = useAxios()
    const { snackbarSuccess } = useAction()
    
    const onCreateFinancial = (data: FinancialYearInsert) => {
        fetchData(
            () => HttpCompanyFinance.insert(props.companyId, data),
            true
        ).then((r) => {
            if (!r[BaseResponseFields.HasError]) {
                snackbarSuccess('El estado contable se creó con éxito')
                props.onReloadRelatedData()
            }
        })
    }
    
    const onHandleSubmitClose = () => {
        props.onClose();
        props.onReloadRelatedData();
    }
    
    switch (props.section) {
        case Sections.FinancialYear:
            return <FinancialDrawerNew open={props.open}
                                       onCloseDrawer={props.onClose}
                                       onAfterSubmit={() => {}}
                                       customHandleNew={onCreateFinancial}
            />
        case Sections.DeclarationOfAssets:
            return <CompanyFinanceHeaderDrawer
                show={props.open}
                title="Nueva manifestación de bienes"
                companyId={props.companyId}
                onFinishProcess={onHandleSubmitClose}
                onSubmit={HttpCompanyDeclarationOfAssets.insert}
                onCloseDrawer={props.onClose}
            />
        case Sections.RelatedPerson:
            return <NewRelatedPersonMultipleDrawer show={props.open}
                                                   onCloseDrawer={props.onClose}
                                                   onFinishProcess={onHandleSubmitClose}
                                                   legalPerson={props.isLegalPerson}
                                                   companyId={props.companyId}
            />
        default: return <React.Fragment />
    }
}


export default SectionRelatedDrawer