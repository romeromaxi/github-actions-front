import {Box, Button, Stack} from "@mui/material";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import React, {ReactNode} from "react";
import {useAppNavigation} from "../../../../hooks/navigation";
import {GuestRoute} from "../../../../routes/guest/routeAppGuestData";


const ButtonIdLogin: string = "btn-login-bloqueo-accion-tienda";
const ButtonIdSignUp: string = "btn-registrate-bloqueo-accion-tienda";

interface MarketUserLoginContentProps {
    title?: string;
    description?: string;
    dialogAction?: ReactNode;
}


const MarketUserLoginContent = ({ title, description, dialogAction }: MarketUserLoginContentProps) => {
    const { navigate } = useAppNavigation();

    const onClickLogin = () => navigate(GuestRoute.Login);

    const onClickSignUp = () => navigate(GuestRoute.SignUp);
    
    return (
        <Box position="relative" width={1}>
            {dialogAction && (
                <Box position="absolute" top={0} right={0} display="flex" justifyContent="flex-start">
                    {dialogAction}
                </Box>
            )}
            <Stack spacing={2} width={1} alignItems={'center'}>
                <Box component="img"
                     width={{ xs: '100px', sm: '120px' }}
                     height={{ xs: '99px', sm: '119px' }}
                     src={'/images/assets/registration-signature.svg'} />
                <Stack spacing={4} width={1} alignItems={'center'}>
                    <Stack spacing={0.75}>
                        <TypographyBase variant={'eyebrow2'} color={"primary"} textTransform={'uppercase'} textAlign='center'>
                            {description ?? '¿Querés conocer toda la oferta de financiamiento?'}
                        </TypographyBase>
                        <TypographyBase variant={'h4'} textAlign='center'>
                            {title ?? 'Creá tu usuario en pocos pasos'}
                        </TypographyBase>
                    </Stack>

                    <Stack spacing={1.5} width={1}>
                        <Button color={"primary"}
                                variant={"contained"}
                                onClick={onClickSignUp}
                                id={ButtonIdSignUp}
                                fullWidth
                        >
                            Crear Usuario Gratis
                        </Button>
                        <Button color={"secondary"}
                                variant={"contained"}
                                onClick={onClickLogin}
                                id={ButtonIdLogin}
                                fullWidth
                        >
                            Ingresar a mi cuenta
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}


export default MarketUserLoginContent;