import React, {useContext} from "react";
import {BalancesSourceType} from "hooks/contexts/BalancesContext";
import FinancialIndicatorsTable from "pages/companyFile/finance/components/FinancialIndicatorsTable";
import { NavsTabHorizontal } from "components/navs/NavsTab";
import OffererLufeTabWrapper from "pages/offerer/solicitation/components/lufe/components/OffererLufeTabWrapper";
import { ChartLineUp } from "@phosphor-icons/react";
import OffererLufeFinanceIndicators from "../../solicitation/components/lufe/OffererLufeFinanceIndicators";
import {LufeInformationContext} from "../../../../hooks/contexts/LufeInformationContext";
import { Alert } from "@mui/material";
import BureauFinanceTab from "../../../bureau/finance/BureauFinanceTab";

interface OffererClientPortfolioFinancialIndicatorsProps {
    clientPortfolioGuid?: string
}

function OffererClientPortfolioFinancialIndicators(props: OffererClientPortfolioFinancialIndicatorsProps) {
    const { lufeData } = useContext(LufeInformationContext);
    
    return (
        <div>
            <NavsTabHorizontal lstTabs={[
                {
                    tabList: [
                        {
                            label: 'LUFE',
                            content:
                                (!!lufeData) ?
                                    <OffererLufeTabWrapper icon={ChartLineUp} title={'Indicadores Financieros'}>
                                        <OffererLufeFinanceIndicators />
                                    </OffererLufeTabWrapper>
                                    :
                                    <Alert color="info" severity="info">
                                        Para acceder a las funcionalidades de LUFE, ingresá tu API Key y empezá a usar el servicio
                                    </Alert>,
                            default: !!lufeData
                        },
                        {
                            label: 'Balance',
                            content:
                                <BureauFinanceTab dataId={props.clientPortfolioGuid ?? ''} 
                                                  dataSource={BalancesSourceType.ClientPortfolio}
                                />,
                            default: !lufeData
                        }
                    ]
                }
            ]}
            />
        </div>
    )
}

export default OffererClientPortfolioFinancialIndicators;