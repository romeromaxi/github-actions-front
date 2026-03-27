import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import {SealPercent} from "@phosphor-icons/react";
import {Files, FolderLock, UserFocus} from "phosphor-react";
import HomeChooseAnimatedCard, {HomeChooseCardData} from "./HomeChooseAnimatedCard";
import {AppRoutesDefinitions, useAppNavigation} from "../../../hooks/navigation";


interface HomeLucChooseProps {
    mobileView: boolean;
}


const HomeLucChoose = ({mobileView} : HomeLucChooseProps) => {
    const { navigate } = useAppNavigation();
    
    const cardData: HomeChooseCardData[] = [
        {
            id: 1,
            icon: SealPercent,
            title: "Encontrá la opción ideal para tu PyME",
            description: "LUC reúne distintas alternativas de financiamiento en un solo lugar y te ayuda a elegir la más adecuada para tu perfil.",
            delay: 100,
        },
        {
            id: 2,
            icon: UserFocus,
            title: "Conocé tu perfil, elegí con confianza",
            description: "Con LUC podés ver cómo califican a tu empresa las entidades y acceder a guías para tomar decisiones más claras.",
            delay: 300,
        },
        {
            id: 3,
            icon: Files,
            title: "Tus documentos en un solo lugar",
            description: "Armá el legajo de tu empresa online y usalo para todas tus gestiones: aplicá dentro de LUC o exportalo para presentar en otras entidades.",
            delay: 500,
        },
        {
            id: 4,
            icon: FolderLock,
            title: "Tus datos, siempre seguros",
            description: "La información de tu PyME se resguarda de forma segura y no se comparte sin tu consentimiento.",
            delay: 700,
        },
    ];

    const goToAboutLuc = () => navigate(AppRoutesDefinitions.LucAboutPage);
    
    return (
        <Stack spacing={2}>
            <Typography color={'primary'} fontFamily={'Geist'} textAlign={'center'} fontWeight={500}>
                ¿POR QUÉ ELEGIR LUC?
            </Typography>
            <Typography variant={'h2'} fontWeight={600} textAlign='center'>
                Más sencillo, más rápido, más conveniente
            </Typography>
            <Grid container>
                {cardData.map((card) => (
                    <Grid item xs={12} sm={6} md={3} lg={3} key={card.id} p={2}>
                        <HomeChooseAnimatedCard
                            data={card}
                            mobileView={mobileView}
                        />
                    </Grid>
                ))}
            </Grid>
            <Box justifyContent={'center'} alignItems={'center'} width={'100%'} display={'flex'} paddingTop={3}>
                <Button variant="contained" size="small" fullWidth={mobileView}
                        onClick={goToAboutLuc}
                >
                    Saber más sobre LUC
                </Button>
            </Box>
        </Stack>
    )
}


export default HomeLucChoose;