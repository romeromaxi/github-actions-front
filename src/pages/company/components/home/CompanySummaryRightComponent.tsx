import {useContext, useMemo, useState} from "react";
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import {CompanyViewDTO, CompanyViewDTOFields} from "types/company/companyData";
import {EntityWithIdFields} from "types/baseEntities";
import {useNavigate} from "react-router-dom";
import ColouredBoxWithData from "components/misc/ColouredBoxWithData";
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";
import {BouncedChequesFields, CurrentDebtFields, NosisDetailQueryFields} from "types/nosis/nosisData";
import {TypographyBase} from "components/misc/TypographyBase";
import CompanyPendingActions from "./CompanyPendingActions";
import CompanyStatusVerificationCard from "./CompanyStatusVerificationCard";
import CompanySuggestedLinesSection from "./CompanySuggestedLinesSection";
import { ValidationStatesType } from "types/person/personEnums";
import {DialogAlert} from "components/dialog";


interface CompanySummaryRightComponentProps {
    company: CompanyViewDTO
}


const CompanySummaryRightComponent = (props: CompanySummaryRightComponentProps) => {
    const navigate = useNavigate();
    const { loading: loadingBureau, error, nosisQuery } = useContext(BureauInformationContext);

    const [openNeedVerify, setOpenNeedVerify] = useState<boolean>(false);
    
    const currentSituation = useMemo(() => {
        if (loadingBureau || !nosisQuery) return undefined;

        const currentDebt = nosisQuery?.[NosisDetailQueryFields.CurrentDebt];

        if (!currentDebt) return undefined;
        else if (currentDebt[CurrentDebtFields.SitSixQuantity] > 0) return 6;
        else if (currentDebt[CurrentDebtFields.SitFiveQuantity] > 0) return 5;
        else if (currentDebt[CurrentDebtFields.SitFourQuantity] > 0) return 4;
        else if (currentDebt[CurrentDebtFields.SitThreeQuantity] > 0) return 3;
        else if (currentDebt[CurrentDebtFields.SitTwoQuantity] > 0) return 2;
        else if (currentDebt[CurrentDebtFields.SitOneQuantity] > 0) return 1;
        return 0;
    }, [loadingBureau, nosisQuery]);

    const hasNoDebt = useMemo(() => {
        if (loadingBureau || !nosisQuery) return undefined;

        const cheques = nosisQuery?.[NosisDetailQueryFields.BouncedCheques]

        const noDebt = (cheques?.[BouncedChequesFields.OthersQuantity] === 0 && cheques?.[BouncedChequesFields.NoFundsPenaltyQuantity] === 0
            && cheques?.[BouncedChequesFields.NoFundsQuantity] === 0
        );

        return noDebt ? "No" : "Sí";
    }, [loadingBureau, nosisQuery]);
    
    const handleGoToInfoBureau = () => {
        if (props.company[CompanyViewDTOFields.CompanyStateCode] !== ValidationStatesType.Validated) {
            setOpenNeedVerify(true);
            return;
        }

        navigate(`/mis-empresas/${props.company[EntityWithIdFields.Id]}?tab=bureau`);
    }
    
    return (
        <Stack spacing={3}>
            <CompanyStatusVerificationCard />
            
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h5">
                                Cómo ven a tu empresa
                            </Typography>
                            <Button variant="text" size="medium" 
                                    onClick={handleGoToInfoBureau}>
                                Ir a Ver cómo me ven
                            </Button>
                        </Stack>
                        {
                            error || (!nosisQuery && !loadingBureau) ? (
                                <Stack width={1}>
                                    <TypographyBase variant="h6" color="text.lighter">
                                        No hay información para mostrar en este momento
                                    </TypographyBase>
                                    <TypographyBase variant="body2" color="text.lighter">
                                        Estamos procesando tu perfil crediticio. Intentalo más tarde.
                                    </TypographyBase>
                                </Stack>
                            )
                            :
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <ColouredBoxWithData color={'#4DAB2B !important'}
                                                     label={'Entidades informadas BCRA'}
                                                     loading={loadingBureau}
                                                     value={nosisQuery?.[NosisDetailQueryFields.CurrentDebtDetailList].length || '-'}
                                                     bgcolor={'#F5FFEC'}
                                />
                                <ColouredBoxWithData color={'#AA7400 !important'}
                                                     label={'Máxima situación BCRA'}
                                                     loading={loadingBureau}
                                                     value={currentSituation}
                                                     bgcolor={'#FFF9EC'}
                                />
                                <ColouredBoxWithData color={'#4DAB2B !important'}
                                                     label={'¿Tiene Cheques rechazados?'}
                                                     loading={loadingBureau}
                                                     value={hasNoDebt}
                                                     bgcolor={'#F5FFEC'}
                                />
                            </Stack>
                        }
                    </Stack>
                </CardContent>
            </Card>
            <CompanyPendingActions />
            <CompanySuggestedLinesSection companyId={props.company[EntityWithIdFields.Id]}/>
            
            <DialogAlert open={openNeedVerify}
                         onClose={() => setOpenNeedVerify(false)}
                         textContent={'Para poder ver esta información la PyME debe estar verificada'}
                         textClose={'Cerrar'}
            />
        </Stack>
    )
}


export default CompanySummaryRightComponent