import React, {useMemo} from "react";
import {Stack} from "@mui/material";
import {Skeleton} from "@mui/lab";
import {BalancesSourceType} from "hooks/contexts/BalancesContext";
import {FinancialIndicators, FinancialIndicatorsFields} from "types/general/generalFinanceData";
import BureauSectionInformationBox from "../components/BureauSectionInformationBox";
import {useAppNavigation} from "hooks/navigation";
import {PymeRoute} from "routes/pyme/routeAppPymeData";
import {TypographyBase} from "components/misc/TypographyBase";
import {WrapperIcons} from "components/icons/Icons";
import {PlusIcon} from "lucide-react";
import {themeColorDefinition} from "util/themes/definitions";
import {OffererRoute} from "routes/offerer/routeAppOffererData";

interface BureauFinanceHeaderActionsProps {
    dataId: number | string,
    dataSource: BalancesSourceType,
    loading: boolean,
    indicators?: FinancialIndicators
}

function BureauFinanceHeaderActions({ dataId, dataSource, loading, indicators }: BureauFinanceHeaderActionsProps) {
    const { navigate } = useAppNavigation();
    
    const indicatorYear = useMemo(() => {
        if (!indicators) return '';
        
        return indicators[FinancialIndicatorsFields.Year];
    }, [indicators]) 
    
    if (loading) 
        return (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                <Skeleton width={'100%'} />
                
                <Skeleton width={'100%'} />
            </Stack>
        )
    
    const onHandleClickBalances = () => {
        switch (dataSource) {
            case BalancesSourceType.Company:
                navigate(
                    PymeRoute.PymeCompanyBalancesList,
                    { companyId: dataId as number },
                    undefined,
                    { replace: true }
                );
                break;
                
            case BalancesSourceType.ClientPortfolio:
                navigate(
                    OffererRoute.OffererProspectDetailBalancesList,
                    { clientPortfolioGuid: dataId as string },
                    undefined,
                    { replace: true }
                );
                break;

            case BalancesSourceType.Solicitation:
                navigate(
                    OffererRoute.OffererSolicitationDetailBalancesList,
                    { solicitationId: dataId as number },
                    undefined,
                    { replace: true }
                );
                break;
        }
    }

    const onHandleClickFinancialFlow = () => {
        switch (dataSource) {
            case BalancesSourceType.Company:
                navigate(
                    PymeRoute.PymeCompanyFinancialFlowList,
                    { companyId: dataId as number },
                    undefined,
                    { replace: true }
                );
                break;

            case BalancesSourceType.ClientPortfolio:
                navigate(
                    OffererRoute.OffererProspectDetailFinancialFlowList,
                    { clientPortfolioGuid: dataId as string },
                    undefined,
                    { replace: true }
                );
                break;

            case BalancesSourceType.Solicitation:
                navigate(
                    OffererRoute.OffererSolicitationDetailFinancialFlowList,
                    { solicitationId: dataId as number },
                    undefined,
                    { replace: true }
                );
                break;
        }

    }

    if (!indicators)
        return (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                <BureauFinanceButtonEmptyHeader label={'Subir Balance'}
                                                onClick={onHandleClickBalances}
                />

                <BureauFinanceButtonEmptyHeader label={'Subir Compras y ventas Post Balance'}
                                                onClick={onHandleClickFinancialFlow}
                />
            </Stack>
        )
    
    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
            <BureauSectionInformationBox label={'Información extraída de'}
                                         data={`Balance ${indicatorYear}`}
                                         onClick={onHandleClickBalances}
                                         width={1}
            />

            <BureauSectionInformationBox label={'Información extraída de'}
                                         data={`Compras y ventas Post Balance ${indicatorYear}`}
                                         onClick={onHandleClickFinancialFlow}
                                         width={1}
            />
        </Stack>
    )
}

interface BureauFinanceButtonEmptyHeaderProps {
    label: string,
    onClick: () => void
}

function BureauFinanceButtonEmptyHeader({ label, onClick}: BureauFinanceButtonEmptyHeaderProps) {
    return (
        <Stack direction={'row'}
               alignItems={'center'}
               borderRadius={'0.75rem !important'}
               onClick={onClick}
               spacing={1} width={1} py={1.5} px={2}
               className={'dashed-success-12'}
               sx={{
                   cursor: 'pointer',
               }}
        >
            <WrapperIcons Icon={PlusIcon} size={'md'} color={'primary'} />

            <TypographyBase variant={'button2'} color={'primary.main'}>
                {label}
            </TypographyBase>
        </Stack>
    )
}

export default BureauFinanceHeaderActions;