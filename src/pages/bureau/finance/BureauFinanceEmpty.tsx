import { Box, Button, Card, CardContent, Stack } from "@mui/material";
import { TypographyBase } from "components/misc/TypographyBase";
import {WrapperIcons} from "components/icons/Icons";
import { InfoIcon } from "lucide-react";
import { BalancesSourceType } from "hooks/contexts/BalancesContext";
import {OffererRoute} from "routes/offerer/routeAppOffererData";
import {useAppNavigation} from "hooks/navigation";
import {useState} from "react";
import CompanyBureauBalanceUploadDrawer from "../CompanyBureauBalanceUploadDrawer";

interface BureauFinanceEmptyProps {
    dataId: number | string,
    dataSource: BalancesSourceType,
    companyId?: number
}

function BureauFinanceEmpty({ dataId, dataSource, companyId }: BureauFinanceEmptyProps) {
    const { navigate } = useAppNavigation();
    const isPersonalData = dataSource === BalancesSourceType.Company;
    const [openUploadBalanceDrawer, setOpenUploadBalanceDrawer] = useState<boolean>(false);

    const onHandleClick = () => {

        if (dataSource === BalancesSourceType.Company) {
            setOpenUploadBalanceDrawer(true);
        } else {
            switch (dataSource) {
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
    }
    
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
                            {
                                isPersonalData ?
                                    "Subí tu balance para ver tus indicadores financieros"
                                    :
                                    "Subí el balance para ver los indicadores financieros"
                            }
                        </TypographyBase>
                        <TypographyBase variant={'body2'} color={'text.lighter'}>
                            {
                                isPersonalData ?
                                    "Calculamos ratios clave y analizamos la información que las entidades usan para evaluar tu PyME."
                                    :
                                    "Calculamos ratios clave y analizamos la información que las entidades usan para evaluar la PyME."
                            }
                        </TypographyBase>
                    </Stack>

                    <Stack spacing={1.5}>
                        <Button color={'primary'}
                                variant={'contained'}
                                size={'medium'}
                                onClick={onHandleClick}
                                fullWidth
                        >
                            {
                                isPersonalData ?
                                    "Subir mi último Balance"
                                    :
                                    "Subir el último Balance"
                            }
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
}

export default BureauFinanceEmpty;
