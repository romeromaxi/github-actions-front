import {Alert} from "@mui/lab";
import React, { useMemo } from "react";
import {Box, Button, Grid, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {BureauProfileClasificationTypes, NosisDetailQuery, NosisDetailQueryFields} from "types/nosis/nosisData";
import {AppRoutesDefinitions, useAppNavigation} from "hooks/navigation";

const alertPropsByStatusMap: Record<BureauProfileClasificationTypes, BureauAlertByProfileStatusComponentProps> = {
    [BureauProfileClasificationTypes.Excellent]: {
        eyebrow: 'Análisis LUC',
        title: 'Tu perfil crediticio es excelente',
        description: 'Todas las métricas de tu PyME se encuentran en niveles saludables, lo que te habilita a acceder a mejores productos de financiamiento. Explorá la Tienda LUC para descubrir las opciones disponibles.',
        severity: 'success',
        srcImage: '/images/assets/bureau/profile-status-excellent.svg'
    },
    [BureauProfileClasificationTypes.GoodWithHistory]: {
        eyebrow: 'Análisis LUC',
        title: 'Tu perfil crediticio es adecuado para solicitar financiamiento',
        description: 'Las métricas actuales de tu PyME se encuentran en niveles saludables. Si bien en el pasado pudo haber alguna situación a regularizar, hoy contás con un perfil adecuado para explorar opciones de financiamiento en la Tienda LUC.',
        severity: 'success',
        srcImage: '/images/assets/bureau/profile-status-good-with-history.svg'
    },
    [BureauProfileClasificationTypes.Recoverable]: {
        eyebrow: 'Análisis LUC',
        title: 'Tu perfil crediticio podría mejorar',
        description: 'Algunas métricas de tu PyME muestran oportunidades de mejora. Con pequeños ajustes, estás cerca de alcanzar un perfil crediticio más sólido y acceder a mejores opciones de financiamiento.',
        severity: 'warning',
        srcImage: '/images/assets/bureau/profile-status-recoverable.svg'
    },
    [BureauProfileClasificationTypes.Irrecoverable]: {
        eyebrow: 'Análisis LUC',
        title: 'Tu perfil crediticio debe mejorar si estás en busca de financiamiento',
        description: 'Actualmente, algunas entidades informan situaciones que requieren atención. Resolver estos puntos es un paso necesario para mejorar tu perfil crediticio y acceder a opciones de financiamiento en el futuro.',
        severity: 'warning',
        srcImage: '/images/assets/bureau/profile-status-irrecoverable.svg'
    }
}

interface BureauAlertByProfileStatusProps {
    nosisQuery: NosisDetailQuery | undefined; 
}

function BureauAlertByProfileStatus({nosisQuery}: BureauAlertByProfileStatusProps) {
    const { navigate } = useAppNavigation();

    const onNavigateMarketLanding = () => navigate(AppRoutesDefinitions.MarketLanding);
    
    const ButtonSuccessAction = () => 
        <Button color={'primary'}
                variant={'contained'}
                size={'small'}
                onClick={onNavigateMarketLanding}
                fullWidth
        >
            Explorar la Tienda LUC
        </Button>
    
    const profileProps: BureauAlertByProfileStatusComponentProps | undefined = useMemo(() => {
        const profileStatus= nosisQuery?.[NosisDetailQueryFields.BureauProfileClasificationCode];
        
        if (profileStatus === undefined) return undefined;
        
        let props = alertPropsByStatusMap[profileStatus];
        
        if (props.severity === "success")
            props.action = <ButtonSuccessAction />
        
        return props;
    }, [nosisQuery]);
    
    if (!profileProps) 
        return null;
    
    return (
        <Grid item xs={12}>
            <BureauAlertByProfileStatusComponent { ...profileProps } />
        </Grid>
    )
}

interface BureauAlertByProfileStatusComponentProps {
    eyebrow: string,
    title: string,
    description: string,
    severity: 'success' | 'warning',
    srcImage: string,
    action?: React.ReactNode
}

function BureauAlertByProfileStatusComponent({ eyebrow, title, description, severity, srcImage, action }: BureauAlertByProfileStatusComponentProps) {
    const sizeImage = 
        severity === 'success' ? 
            { width: { xs: '100px', sm: '201px' }, height: { xs: '99px', sm: '182px' } }
            : 
            { width: { xs: '100px', sm: '154px' }, height: { xs: '99px', sm: '115px' } }
    
    return (
        <Alert color={severity}
               severity={severity}
               role={'disclaimer'}
               variant={'filled'}
               icon={false}
        >
            <Stack direction={{ xs: 'column', md: 'row' }}
                   spacing={3}
                   alignItems={'center'}
            >
                <Box component="img"
                     width={sizeImage.width}
                     height={sizeImage.height}
                     src={srcImage} />

                <Stack spacing={2.5}>
                    <Stack spacing={0.75}>
                        <TypographyBase variant={'eyebrow3'} textTransform={'uppercase'}>
                            {eyebrow}
                        </TypographyBase>

                        <TypographyBase variant={'h5'}>
                            {title}
                        </TypographyBase>

                        <TypographyBase variant={'body2'}>
                            {description}
                        </TypographyBase>
                    </Stack>

                    { !!action && action }
                </Stack>
            </Stack>
        </Alert>
    )
}


export default BureauAlertByProfileStatus;