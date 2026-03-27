import React, {useContext, useMemo} from "react";
import {Button} from "@mui/material";
import {AppBarBase} from "components/appbar/AppBarBase";
import {Undo2Icon} from "lucide-react";
import {CompanyFileContext} from "hooks/contexts/CompanyFileContext";
import {CompanyViewDTOFields} from "types/company/companyData";
import {useNavigate} from "react-router-dom";
import {
    MarketSolicitation,
    MarketSolicitationFields,
    marketSolicitationStorage
} from 'util/sessionStorage/marketSolicitationStorage';
import {SolicitationTypes} from "types/solicitations/solicitationEnums";
import {useApplicationCommon} from "../../../hooks/contexts/ApplicationCommonContext";

function PrequalificationAppBarPage() {
    const { company } = useContext(CompanyFileContext);
    const { shouldWarnBeforeSwitch, openConfirmDialog } = useApplicationCommon();
    const navigate = useNavigate();
    
    const title = useMemo(() => {
        const nameCompanyTitle =
            !!company ? ` para ${company[CompanyViewDTOFields.BusinessName]}` : "";
        
        const checkoutData : MarketSolicitation = marketSolicitationStorage.getCurrentSolicitation();
        const solicitationType = checkoutData?.[MarketSolicitationFields.SolicitationType];
        
        switch (solicitationType) {
            case SolicitationTypes.Matcher:
            case SolicitationTypes.Orienteer:
                return `Búsqueda Asistida${nameCompanyTitle}`;
                
            case SolicitationTypes.General:
            default:
                return `Envío de solicitudes${nameCompanyTitle}`;
        }
    }, [company])

    const onClickBackButton = () => {
        if (shouldWarnBeforeSwitch)
            openConfirmDialog({
                onDiscard: () => {
                    navigate(-1)
                },
                onConfirm: () => { },
                textConfirm: "Continuar editando"
            })
        else 
            navigate(-1)
    }
    
    return (
        <AppBarBase title={title}
                    hideLogo
        >
            <AppBarBase.Left>
                <Button variant={'outlined'}
                        color={'secondary'}
                        size={'small'}
                        startIcon={<Undo2Icon />}
                        onClick={onClickBackButton}
                >
                    Volver
                </Button>
            </AppBarBase.Left>
        </AppBarBase>
    )
}

export default PrequalificationAppBarPage;