import React, {useContext} from "react";
import {Alert, Card, CardContent, CardHeader} from "@mui/material";
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";
import {IdentityFields, NosisDetailQueryFields} from "types/nosis/nosisData";
import {PersonTypes} from "types/person/personEnums";
import {BalancesSourceType} from "../../../hooks/contexts/BalancesContext";
import FinancialIndicatorsTable from "../../companyFile/finance/components/FinancialIndicatorsTable";


interface CompanyBureauFinanceProps {
    companyId: number
}


const CompanyBureauFinance = ({companyId} : CompanyBureauFinanceProps) => {
    const {error, nosisQuery} = useContext(BureauInformationContext);
    
    return (
        nosisQuery?.[NosisDetailQueryFields.Identity][IdentityFields.PersonTypeCode] === PersonTypes.Legal ?
            <FinancialIndicatorsTable error={error}
                                      dataId={companyId}
                                      dataSource={BalancesSourceType.Company}
            />
            :
            <Card>
                <CardHeader title={'Indicadores financieros'}/>
                <CardContent>
                    <Alert severity={'info'}>No es posible ver esta solapa para la persona seleccionada</Alert>
                </CardContent>
            </Card>
    )
}

export default CompanyBureauFinance