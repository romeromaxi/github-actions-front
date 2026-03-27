import {Box, Button, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {StoreIcon} from "lucide-react";
import {AppRoutesDefinitions, useAppNavigation} from "hooks/navigation";


interface UserSolicitationsNotFoundProps {
    withAlert?: boolean,
    onlyActiveStates?: boolean,
    companySelected?: boolean;
}


const UserSolicitationsNotFound = ({withAlert, onlyActiveStates, companySelected} : UserSolicitationsNotFoundProps) => {
    const { navigate } = useAppNavigation();

    const onNavigateMarketLanding = () => navigate(AppRoutesDefinitions.MarketLanding);
    
    const renderNotFoundTitle = () => {
        if (withAlert) return 'No tenés solicitudes con alertas en este momento'
        else if (companySelected) return 'Aún no enviaste solicitudes con esta PyME'
        else if (onlyActiveStates === true) return 'No tenés solicitudes activas en este momento'
        else if (onlyActiveStates === false) return 'No tenés solicitudes finalizadas en este momento'
        else return 'Aún no enviaste solicitudes en LUC'
    }
    
    return (
        <Box sx={{display:'flex', width: '100%', height: '55vh'}} alignItems='center' justifyContent='center'>
            <Stack spacing={3} justifyContent='center' alignItems='center'>
                <Stack spacing={1.5}>
                    <TypographyBase variant="h4" color="text.lighter" fontWeight={600} textAlign='center'>
                        {renderNotFoundTitle()}
                    </TypographyBase>
                    <TypographyBase variant="body2" color="text.lighter" textAlign='center'>
                        Explorá productos e iniciá solicitudes desde la Tienda LUC
                    </TypographyBase>
                </Stack>
                <Button startIcon={<StoreIcon />} variant="contained" onClick={onNavigateMarketLanding}>
                    Ir a Tienda LUC
                </Button>
            </Stack>
        </Box>
    )
}


export default UserSolicitationsNotFound;