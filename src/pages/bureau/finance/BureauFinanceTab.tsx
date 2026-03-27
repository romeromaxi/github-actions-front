import React, {useContext, useEffect, useMemo, useState} from "react";
import {Grid} from "@mui/material";
import BureauSectionHeader from "../components/BureauSectionHeader";
import {FinancialIndicators} from "types/general/generalFinanceData";
import {HttpCompanyFinance} from "http/index";
import {BalancesSourceType} from "hooks/contexts/BalancesContext";
import {HttpSolicitationFinance} from "http/solicitations/httpSolicitationFinance";
import {HttpClientPortfolioBalances} from "http/clientPortfolio/httpClientPortfolio";
import BureauFinanceTabContent from "./BureauFinanceTabContent";
import BureauFinanceEmpty from "./BureauFinanceEmpty";
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";
import {IdentityFields, NosisDetailQueryFields } from "types/nosis/nosisData";
import { PersonTypes } from "types/person/personEnums";
import {Alert} from "@mui/lab";
import BureauFinanceHeaderActions from "./BureauFinanceHeaderActions";

interface BureauFinanceTabProps {
    dataId: number | string;
    dataSource: BalancesSourceType;
}

const subtitleBySource: Record<BalancesSourceType, string> = {
    [BalancesSourceType.Company]: 'Indicador que refleja el nivel de riesgo crediticio de tu PyME según su historial financiero. A mayor score, menor es el riesgo percibido por las entidades financieras.',
    [BalancesSourceType.ClientPortfolio]: 'Indicador que refleja el nivel de riesgo crediticio de la PyME según su historial financiero. A mayor score, menor es el riesgo percibido por las entidades financieras.',
    [BalancesSourceType.Solicitation]: 'Indicador que refleja el nivel de riesgo crediticio de la PyME según su historial financiero. A mayor score, menor es el riesgo percibido por las entidades financieras.',
}

function BureauFinanceTab(props: BureauFinanceTabProps) {
    const { nosisQuery } = useContext(BureauInformationContext);
    
    const [loading, setLoading] = useState<boolean>(true);
    const [indicators, setIndicators] = useState<FinancialIndicators>();
    
    const showFinanceInfo = useMemo(() => (
        !(nosisQuery?.[NosisDetailQueryFields.Identity][IdentityFields.PersonTypeCode] === PersonTypes.Physical)
    ), [nosisQuery]) 
    
    const getPromiseType = () => {
        if (!props.dataId) return Promise.resolve<FinancialIndicators[]>([]);

        switch (props.dataSource) {
            case BalancesSourceType.Company:
                return HttpCompanyFinance.getIndicatorsByCompanyId(props.dataId)
            case BalancesSourceType.Solicitation:
                return HttpSolicitationFinance.getIndicatorsBySolicitationId(props.dataId)
            case BalancesSourceType.ClientPortfolio:
                return HttpClientPortfolioBalances.getIndicators(props.dataId)
        }
    }

    useEffect(() => {
        setLoading(true)
        setIndicators(undefined);
        const promise = getPromiseType()

        promise.then((indicators) => {
            setIndicators(indicators[0] || undefined);
        })
            .finally(() => setLoading(false))
    }, [props.dataId]);
    
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <BureauSectionHeader title={'Indicadores Financieros'}
                                     subtitle={subtitleBySource[props.dataSource]}
                >
                    {
                        showFinanceInfo ?
                            <BureauFinanceHeaderActions dataId={props.dataId} 
                                                        dataSource={props.dataSource}
                                                        loading={loading}
                                                        indicators={indicators}
                            />
                            :
                            undefined
                    }
                </BureauSectionHeader>
            </Grid>

            {
                !showFinanceInfo ?
                    <Grid item xs={12}>
                        <Alert color={'info'}
                               severity={'info'}
                               role={'disclaimer'}
                               variant={'filled'}
                               size={'small'}>
                            No es posible ver esta solapa para la persona seleccionada
                        </Alert>
                    </Grid>
                    :
                    (!loading && !indicators) ?
                        <Grid item xs={12}>
                            <BureauFinanceEmpty dataId={props.dataId} 
                                                dataSource={props.dataSource}
                            />
                        </Grid>
                        :
                        <BureauFinanceTabContent loading={loading}
                                                 indicators={indicators}
                                                 dataSource={props.dataSource}
                        />
            }
        </Grid>
    )
}

export default BureauFinanceTab;