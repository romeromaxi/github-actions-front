import React, {Fragment, useState} from "react";
import {SolicitationCommunicationView} from "types/solicitations/solicitationCommunicationData";
import FlyerBase from "components/flyers/FlyerBase";
import CompanySolicitationNewProposalDialog from "./CompanySolicitationNewProposalDialog";
import {Box, Button, Card, CardContent, Divider, Stack, useMediaQuery, useTheme} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {MarketRoute} from "routes/market/routeAppMarketData";
import {WrapperIcons} from "components/icons/Icons";
import {useAppNavigation} from "hooks/navigation";
import {ArrowRight} from "lucide-react";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";

interface CompanySolicitationNewProposalSuitableOptionProps {
    communication: SolicitationCommunicationView,
    solicitation: SolicitationViewDTO
}

export function CompanySolicitationNewProposalSuitableOption({ 
    communication, solicitation
}: CompanySolicitationNewProposalSuitableOptionProps) {
    const solicitationOffererName = solicitation[SolicitationViewDTOFields.OffererBusinessName];
    const [open, setOpen] = useState<boolean>(false);

    const handleOpenProposal = () => setOpen(true);
    
    const handleCloseProposal = () => setOpen(false);
    
    return (
        <Fragment>
            <FlyerBase
                variant={'success'}
                title={`Tenés una nueva propuesta${solicitationOffererName ? " de " + solicitationOffererName : ''} para tu solicitud`}
                eyebrow="¡FELICIDADES!"
                ImageProps={{
                    source: '/images/assets/solicitation-mailbox.svg',
                    desktopWidth: '360px',
                    desktopHeight: '360px',
                    mobileWidth: '184px',
                    mobileHeight: '184px',
                    alignSelfMobile: 'flex-start',
                    alignSelfDesktop: 'flex-end',
                    justifyContent: 'flex-end',
                }}
                ButtonProps={{
                    label: 'Ver Propuesta',
                    id: "btn-solicitud-ver-propuesta",
                    onClick: handleOpenProposal
                }}
                maxWidth={'100%'}
                minHeight={'350px'}
                paddingMobile={'48px 24px 24px'}
                paddingDesktop={'12px 48px'}
                imageContainerWidth={'480px'}
                typographyVariants={{
                    titleDesktop: 'h2',
                    titleMobile: 'h3',
                    descriptionDesktop: 'body1',
                    descriptionMobile: 'body2',
                    eyebrowDesktop: 'eyebrow1',
                    eyebrowMobile: 'eyebrow1',
                }}
                buttonLayout={'below-title'}
                contentSpacing={3}
            />
            
            <CompanySolicitationNewProposalDialog open={open}
                                                  onClose={handleCloseProposal}
                                                  communication={communication}
                                                  solicitation={solicitation}
            />
        </Fragment>
    )
}

interface CompanySolicitationNewProposalNotSuitableOptionProps {
    title: string,
    message: string,
    showAssistedSearch?: boolean
}

export function CompanySolicitationNewProposalNotSuitableOption({ title, message, showAssistedSearch }: CompanySolicitationNewProposalNotSuitableOptionProps) {
    const { navigate } = useAppNavigation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Card sx={{
            backgroundColor: '#FDF6F6',
            boxShadow: `inset 0 0 0 1px #720800`,
            width: '100%',
        }}
        >
            <CardContent>
                <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 3 : 5} justifyContent="space-between" alignItems="center">
                    <Stack spacing={1}>
                        <TypographyBase variant={'h5'} color="#720800" fontWeight={600}>
                            {title}
                        </TypographyBase>
                        
                        <Stack direction={'row'} spacing={1.25}>
                            <Divider sx={{ borderColor: '#720800', opacity: 0.5 }} />

                            <TypographyBase variant="body2" color="#720800" fontStyle={'italic'}>
                                {message}
                            </TypographyBase>
                        </Stack>

                        {
                            showAssistedSearch &&
                                <TypographyBase variant="body2" color="#720800">
                                    Para ayudarte a encontrar una mejor alternativa, podés usar la <strong>Búsqueda Asistida LUC</strong>: buscamos por vos las opciones que mejor se adapten a tus necesidades.
                                </TypographyBase>
                        }
                    </Stack>

                    {
                        showAssistedSearch &&
                            <Box sx={{width: isMobile ? '100%' : '300px'}}>
                                <Button variant="contained"
                                        color="error"
                                        size={'small'}
                                        onClick={() => navigate(MarketRoute.MarketLucAssistedSearch)}
                                        endIcon={<WrapperIcons Icon={ArrowRight} />}
                                        fullWidth
                                        sx={{backgroundColor: '#720800 !important', color: 'white'}}
                                >
                                    Búsqueda Asistida LUC
                                </Button>
                            </Box>
                    }
                </Stack>
            </CardContent>
        </Card>
    )
}

export function CompanySolicitationNewProposalNotSuitableGeneralOption() {
    const { navigate } = useAppNavigation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    return (
        <Card sx={{
            backgroundColor: '#FDF6F6',
            boxShadow: `inset 0 0 0 1px #720800`,
            width: '100%',
        }}
        >
            <CardContent>
                <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 3 : 5} justifyContent="space-between" alignItems="center">
                    <Stack spacing={1}>
                        <TypographyBase variant={'h5'} color="#720800" fontWeight={600}>
                            Este producto no era el adecuado para tu PyME
                        </TypographyBase>
                        <TypographyBase variant="body2" color="#720800">
                            Algunas características del producto no eran adecuadas para tu tipo de PyME. Con la <strong>Búsqueda Asistida LUC</strong>, buscamos por vos las opciones que mejor se adapten a tus necesidades.
                        </TypographyBase>
                    </Stack>

                    <Box sx={{width: isMobile ? '100%' : '300px'}}>
                        <Button variant="contained"
                                color="error"
                                size={'small'}
                                onClick={() => navigate(MarketRoute.MarketLucAssistedSearch)}
                                endIcon={<WrapperIcons Icon={ArrowRight} />}
                                fullWidth
                                sx={{backgroundColor: '#720800 !important', color: 'white'}}
                        >
                            Búsqueda Asistida LUC
                        </Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}

export function CompanySolicitationNewProposalNotSuitableAssistedSearchOption() {
    const { navigate } = useAppNavigation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Card sx={{
            backgroundColor: '#FDF6F6',
            boxShadow: `inset 0 0 0 1px #720800`,
            width: '100%',
        }}
        >
            <CardContent>
                <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 3 : 5} justifyContent="space-between" alignItems="center">
                    <Stack spacing={1}>
                        <TypographyBase variant={'h5'} color="#720800" fontWeight={600}>
                            Este producto no era el adecuado para tu PyME
                        </TypographyBase>
                        <TypographyBase variant="body2" color="#720800">
                            Algunas características del producto no eran adecuadas para tu tipo de PyME. Navegá la tienda utilizando los filtros de productos para encontrar las líneas que más se ajusten a las necesidades y características de tu empresa.
                        </TypographyBase>
                    </Stack>
                    
                    <Box sx={{width: isMobile ? '100%' : '300px'}}>
                        <Button variant="contained"
                                color="error"
                                size={'small'}
                                onClick={() => navigate(MarketRoute.MarketLanding)}
                                endIcon={<WrapperIcons Icon={ArrowRight} />}
                                fullWidth
                                sx={{backgroundColor: '#720800 !important', color: 'white'}}
                        >
                            Ir a la Tienda LUC
                        </Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}