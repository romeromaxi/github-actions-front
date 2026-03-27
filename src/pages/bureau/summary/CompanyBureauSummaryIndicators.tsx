import React, {useState} from "react";
import {useTheme} from "@mui/material/styles";
import {Box, Button, Card, CardContent, Divider, Grid, Stack, useMediaQuery} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import ColouredBoxWithData from "components/misc/ColouredBoxWithData";
import {themeColorDefinition} from "util/themes/definitions";
import {FinanceIndicators, FinanceIndicatorsFields} from "types/nosis/nosisData";
import { numberFormatter } from "util/formatters/numberFormatter";
import { InfoIcon } from "lucide-react";
import {WrapperIcons} from "components/icons/Icons";
import {useAppNavigation} from "hooks/navigation";
import { PymeRoute } from "routes/pyme/routeAppPymeData";
import CompanyBureauBalanceUploadDrawer from "../CompanyBureauBalanceUploadDrawer";

interface CompanyBureauSummaryIndicatorsProps {
    companyId?: number,
    indicators?: FinanceIndicators
    loading?: boolean,
}

function CompanyBureauSummaryIndicators({companyId, indicators, loading}: CompanyBureauSummaryIndicatorsProps) {
    const { navigate } = useAppNavigation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [openUploadBalanceDrawer, setOpenUploadBalanceDrawer] = useState<boolean>(false);

    const handleGoToFinanceIndicatorsTab = () => {
        if (!!companyId)
            navigate(PymeRoute.PymeInfoBureauFinanceIndicators,
                { companyId: companyId },
                undefined,
                { replace: true }
            )
    }
    
    const onHandleClickBalances = () => {
        /*
        if (!!companyId)
            navigate(
                PymeRoute.PymeCompanyBalancesList,
                { companyId: companyId },
                undefined,
                { replace: true }
            );
        */
        
        setOpenUploadBalanceDrawer(true);
    }
    
    if (!loading && !indicators)
        return (
            <Card variant={'infoBureau'}
                  sx={{ padding: '48px !important' }}
            >
                <CardContent>
                    <Stack spacing={3}
                           maxWidth={'560px'}
                           alignItems={'center'}
                           textAlign={'center'}
                           sx={{ placeSelf: 'center' }}
                    >
                        <Box component="img"
                             width={{ xs: '100px', sm: '150px' }}
                             height={{ xs: '99px', sm: '150px' }}
                             src={'/images/assets/bureau/financial-indicators-empty.svg'} />
                        
                        <Stack spacing={1}>
                            <TypographyBase variant={'h4'}>
                                Subí tu balance para ver tus indicadores financieros
                            </TypographyBase>
                            <TypographyBase variant={'body2'} color={'text.lighter'}>
                                LUC extrae tu información y con AI calculamos ratios clave y analizamos los datos que las entidades usan para evaluar tu PyME.
                            </TypographyBase>
                        </Stack>
                        
                        <Stack spacing={1.5}>
                            <Button color={'primary'}
                                    variant={'contained'}
                                    size={'medium'}
                                    onClick={onHandleClickBalances}
                                    fullWidth
                            >
                                Subir mi último Balance
                            </Button>
                            <TypographyBase variant={'body2'} color={'text.lighter'}
                                            display={'flex'}
                                            gap={'0.5px'}
                            >
                                <WrapperIcons Icon={InfoIcon} size={'sm'} />
                                El balance se utiliza solo para análisis financiero y no se comparte sin tu consentimiento.
                            </TypographyBase>
                        </Stack>
                    </Stack>
                </CardContent>
                <CompanyBureauBalanceUploadDrawer open={openUploadBalanceDrawer}
                                                  onClose={() => setOpenUploadBalanceDrawer(false)}
                                                  companyId={companyId}
                />
            </Card>
        )
    
    return (
        <Card variant={'infoBureau'}>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={5.8}>
                        <CompanyBureauSummaryIndicatorsComponent title={'Endeudamiento'}
                                                                 description={'Comparación entre deudas con terceros (Pasivo total) y finaciación con recursos propios (Patrimonio Neto)'}
                                                                 value={indicators?.[FinanceIndicatorsFields.Indebtedness]}
                                                                 loading={loading}
                                                                 onClick={handleGoToFinanceIndicatorsTab}
                        />
                    </Grid>

                    <Grid item xs={12} md={0.1}>
                        <Divider orientation={!isMobile ? 'vertical' : 'horizontal'} />
                    </Grid>
                    
                    <Grid item xs={12} md={5.8}>
                        <CompanyBureauSummaryIndicatorsComponent title={'Rentabilidad'}
                                                                 description={'Participación del resultado Final sobre Ventas Totales (resultado neto / [ventas x 100])'}
                                                                 value={indicators?.[FinanceIndicatorsFields.Profitability]}
                                                                 loading={loading}
                                                                 onClick={handleGoToFinanceIndicatorsTab}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    
                    <Grid item xs={12} md={5.8}>
                        <CompanyBureauSummaryIndicatorsComponent title={'Liquidez corriente'}
                                                                 description={'En qué medida superan los activos liquidables a corto plazo a los compromisos exigibles en mismo periodo.'}
                                                                 value={indicators?.[FinanceIndicatorsFields.CurrentLiquidity]}
                                                                 loading={loading}
                                                                 onClick={handleGoToFinanceIndicatorsTab}
                        />
                    </Grid>

                    <Grid item xs={12} md={0.1}>
                        <Divider orientation={!isMobile ? 'vertical' : 'horizontal'} />
                    </Grid>
                    
                    <Grid item xs={12} md={5.8}>
                        <CompanyBureauSummaryIndicatorsComponent title={'Solvencia'}
                                                                 description={'Indica en que proporción el activo excede al pasivo. Nos orienta sobre la participación del patrimonio neto.'}
                                                                 value={indicators?.[FinanceIndicatorsFields.Solvency]}
                                                                 loading={loading}
                                                                 onClick={handleGoToFinanceIndicatorsTab}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

interface CompanyBureauSummaryIndicatorsComponentProps {
    title: string,
    description: string,
    value?: number,
    loading?: boolean,
    onClick?: () => void
}

function CompanyBureauSummaryIndicatorsComponent({ title, description, value, loading, onClick}: CompanyBureauSummaryIndicatorsComponentProps) {
    return (
        <Stack spacing={2}>
            <Stack spacing={1}>
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <TypographyBase variant={'h5'}>
                        {title}
                    </TypographyBase>

                    {
                        onClick &&
                            <Button variant={'text'}
                                    size={'small'}
                                    onClick={onClick}
                                    minPadding
                            >
                                Saber más
                            </Button>
                    }
                </Stack>

                <TypographyBase variant={'body3'} color={'text.lighter'}>
                    {description}
                </TypographyBase>
            </Stack>

            <Box>
                <ColouredBoxWithData value={value ? numberFormatter.toStringWithDecimals(value) : '-'}
                                     color={'#5B6560'}
                                     bgcolor={themeColorDefinition.UIElements.backgrounds.disabled}
                                     loading={loading}
                                     valueProps={{ variant: 'h3' }}
                                     boxProps={{
                                         padding: '16px !important',
                                         alignContent: 'center'
                                     }}
                />
            </Box>
        </Stack>
    )
}

export default CompanyBureauSummaryIndicators;