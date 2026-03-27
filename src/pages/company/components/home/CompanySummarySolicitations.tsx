import React, {useEffect, useMemo, useState} from "react";
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import BoxFilledWithData from "components/misc/BoxFilledWithData";
import {themeColorDefinition} from "util/themes/definitions";
import {WrapperIcons} from "components/icons/Icons";
import {useAppNavigation} from "hooks/navigation";
import {PymeRoute} from "routes/pyme/routeAppPymeData";
import {ClockFadingIcon, MailIcon, SendIcon, StoreIcon} from "lucide-react";
import {
    SolicitationTotalsViewCompany,
    SolicitationTotalsViewCompanyFields
} from "../../../../types/solicitations/solicitationData";
import {HttpSolicitation} from "../../../../http";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import {MarketRoute} from "../../../../routes/market/routeAppMarketData";


interface CompanySummarySolicitationsProps {
    companyId: number
}


const CompanySummarySolicitations = (props: CompanySummarySolicitationsProps) => {
    const { navigate } = useAppNavigation();
    const [totals, setTotals] = useState<SolicitationTotalsViewCompany>();

    const showEmpty = useMemo(() => {
        if (!totals) return true;
        return [
            SolicitationTotalsViewCompanyFields.SolicitationsQuantity,
            SolicitationTotalsViewCompanyFields.SolicitationsReadyToSend,
            SolicitationTotalsViewCompanyFields.SolicitationsInProgress,
            SolicitationTotalsViewCompanyFields.SolicitationsWithMessage,
        ].every((f) => !totals?.[f] || totals?.[f] === 0);
    }, [totals])
    
    const onHandleViewSolicitations = () => {
        navigate(PymeRoute.PymeCompanySolicitationList,
            { companyId: props.companyId },
            undefined,
            { replace: true }
        )
    }

    useEffect(() => {
        HttpSolicitation.getTotalsSolicitationsByCompany(props.companyId)
            .then(setTotals)
    }, [props.companyId]);
    
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h5">
                            Tus solicitudes
                        </Typography>
                        <Button variant="text" size="medium" onClick={onHandleViewSolicitations}>Ver todas</Button>
                    </Stack>

                    {showEmpty ? (
                        <Stack spacing={3} sx={{width: '100%'}}>
                            <Stack alignItems="center" justifyContent="center" sx={{ width: '100%' }} spacing={1.25}>
                                <TypographyBase variant="h6" color="text.lighter">Aún no enviaste ninguna solicitud</TypographyBase>
                                <TypographyBase variant="body2" color="text.lighter">Visitá la tienda y encontrá el financiamiento perfecto!</TypographyBase>
                            </Stack>
                            <Button variant="outlined" color="secondary" fullWidth 
                                    startIcon={<WrapperIcons Icon={StoreIcon} size={'md'}/> } 
                                    onClick={() => navigate(MarketRoute.MarketLanding)}>
                                Visitar Tienda
                            </Button>
                        </Stack>
                    ) : (
                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
                            <BoxFilledWithData sx={{width: '100%'}}
                                               label={'En progreso'}
                                               quantity={totals?.[SolicitationTotalsViewCompanyFields.SolicitationsInProgress]}
                                               color={'text.main'}
                                               icon={
                                                <WrapperIcons Icon={ClockFadingIcon} size={'xxl'} 
                                                              color={themeColorDefinition.UIElements.texts.tertiary} /> 
                                               }
                            />
                            
                            <BoxFilledWithData sx={{width: '100%'}}
                                               label={'Listas para enviar'}
                                               quantity={totals?.[SolicitationTotalsViewCompanyFields.SolicitationsReadyToSend]}
                                               color={'primary'}
                                               icon={
                                                   <WrapperIcons Icon={SendIcon} size={'xxl'}
                                                                 color={themeColorDefinition.UIElements.texts.tertiary} />
                                               }
                            />
                            
                            <BoxFilledWithData sx={{width: '100%'}}
                                               label={'Mensajes sin leer'}
                                               quantity={totals?.[SolicitationTotalsViewCompanyFields.SolicitationsWithMessage]}
                                               color={themeColorDefinition.systemFeedback.accentNotifications.primary}
                                               icon={
                                                   <WrapperIcons Icon={MailIcon} size={'xxl'}
                                                                 color={themeColorDefinition.UIElements.texts.tertiary} />
                                               }
                            />
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    )
}


export default CompanySummarySolicitations;