import React from 'react';
import {Stack, Box, Card, Button, useMediaQuery} from '@mui/material';
import {TypographyBase} from 'components/misc/TypographyBase';
import {WrapperIcons} from "components/icons/Icons";
import {StoreIcon, UsersIcon} from "lucide-react";
import {useTheme} from "@mui/material/styles";
import {OffererRoute} from "routes/offerer/routeAppOffererData";
import {useAppNavigation} from "hooks/navigation";

interface ActionItemProps {
    icon: React.ElementType;
    title: string;
    buttonText: string;
    onClick: () => void;
}

function ActionItem({icon, title, buttonText, onClick}: ActionItemProps) {
    const theme = useTheme();
    const mobileView = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Card sx={{p: 2, borderRadius: 2}}>
            <Stack direction={{xs: 'column', md: 'row'}}
                   justifyContent={'space-between'}
                   spacing={{xs: 1, sm: 1.5, md: 2}}
                   width={1}
            >
                <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
                    <Box color="text.secondary" display="flex">
                        <WrapperIcons Icon={icon} size={24}/>
                    </Box>
                    <TypographyBase variant="body3" fontWeight={600} flex={1}>
                        {title}
                    </TypographyBase>
                </Stack>

                <Button variant="outlined"
                        color="secondary"
                        onClick={onClick}
                        sx={{minWidth: 'fit-content'}}
                        fullWidth={mobileView}
                >
                    {buttonText}
                </Button>
            </Stack>
        </Card>
    );
}

interface HomeSuggestedActionsProps {
    publishedLinesCount: number;
}

function HomeSuggestedActions({publishedLinesCount}: HomeSuggestedActionsProps) {
    const { navigate } = useAppNavigation();

    const navigateToLines = () =>
        navigate(OffererRoute.OffererLines);
    
    const navigateToUsersAdmin = () =>
        navigate(OffererRoute.OffererUsersAdmin);

    return (
        <Stack spacing={3} width="100%">
            <TypographyBase variant="h4">
                Acciones sugeridas
            </TypographyBase>

            <Stack spacing={2}>
                {publishedLinesCount === 0 && (
                    <ActionItem icon={StoreIcon} 
                                title="Publicá tu primer producto en la tienda LUC" 
                                buttonText="Ir a Productos" 
                                onClick={navigateToLines}
                    />
                )}

                <ActionItem icon={UsersIcon} 
                            title="Invitá a otros usuarios a colaborar en la gestión de productos y solicitudes" 
                            buttonText="Ir a Configuración" 
                            onClick={navigateToUsersAdmin}
                />
            </Stack>
        </Stack>
    );
}

export default HomeSuggestedActions;
