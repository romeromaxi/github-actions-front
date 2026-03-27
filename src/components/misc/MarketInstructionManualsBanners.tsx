import {Box, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import React from "react";
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import {DiagonalArrowButton} from "components/buttons/Buttons";
import {WrapperIcons} from "../icons/Icons";
import {ArrowUpRight} from "@phosphor-icons/react";
import {AppConfigFields, AppConfigLogosFields} from "types/appConfigEntities";
import {AppRoutesDefinitions, useAppNavigation} from "hooks/navigation";

const MarketInstructionManualsBanners = () => {
    const { navigate } = useAppNavigation();
    
    const openGlossaryPage = () => navigate(AppRoutesDefinitions.LucGlossaryPage);
    const onClickInstructives = () => navigate(AppRoutesDefinitions.LucInstructivePage)
    
    return (
        <Stack spacing={4} sx={{width: '100%'}}>
            <Card sx={{width: '100%', padding: '56px'}}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={12}>
                            <Stack spacing={2}>
                                <Typography variant={'h2'} fontWeight={500}>
                                    Te acercamos la información que necesitás
                                </Typography>
                                <Typography variant={'h4'} fontWeight={400} color={'#818992'}>
                                    Informate y elegí las mejores opciones para tu empresa
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid item md={12} mt={5}>
                            <Stack direction={'row'} spacing={3}>
                                <MarketInstructionManualsBannersArticles title={"Título del artículo o contenido educativo"}
                                                                         description={"Resumen en tres líneas del articulo o contenido educativo asociado a la esta card. Resumen en tres líneas del articulo o contenido asociado."}
                                                                         srcImage={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                                />

                                <MarketInstructionManualsBannersArticles title={"Título del artículo o contenido educativo"}
                                                                         description={"Resumen en tres líneas del articulo o contenido educativo asociado a la esta card. Resumen en tres líneas del articulo o contenido asociado."}
                                                                         srcImage={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                                />

                                <Stack spacing={2} minWidth={'30%'}>
                                    <MarketInstructionManualsBannersButton title={"Más Información"}
                                                                           onClick={() => { }}
                                    />

                                    <MarketInstructionManualsBannersButton title={"Instructivos"}
                                                                           onClick={onClickInstructives}
                                    />

                                    <MarketInstructionManualsBannersButton title={"Glosario"}
                                                                           onClick={openGlossaryPage}
                                    />
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Stack>
    )
}

interface MarketInstructionManualsBannersButtonProps {
    title: string,
    onClick: () => void
}

function MarketInstructionManualsBannersButton({ title, onClick }: MarketInstructionManualsBannersButtonProps) {
    return (
        <Box onClick={onClick} sx={{
            padding: '24px !important',
            borderRadius: '32px',
            backgroundColor: '#F7FAFC',
            cursor: 'pointer',
            height: '159px !important',
            position: 'relative'
        }}
        >
            <Stack height={1} justifyContent={'space-between'}>
                <Stack direction={'row'} width={1} justifyContent={'end'}>
                    <WrapperIcons Icon={ArrowUpRight} size={'lg'} />
                </Stack>
                <Stack direction={'row'}>
                    <Typography fontSize={32} fontWeight={500}>
                        {title}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    )
}

interface MarketInstructionManualsBannersArticlesProps {
    title: string,
    description: string,
    header?: string
    srcImage: string,
}

function MarketInstructionManualsBannersArticles({ header, title, description, srcImage }: MarketInstructionManualsBannersArticlesProps) {
    return (
        <Stack spacing={2} justifyContent={'space-between'} sx={{ padding: '32px', border: '1px solid #C3CCD7', borderRadius: '32px' }}>
            <Stack spacing={2}>
                <Stack direction='row' alignItems='center' spacing={1}>
                    <AccountBalanceOutlinedIcon fontSize={'small'} />
                    <Typography variant={'body2'} fontWeight={500}>{header ?? "Apertura de cuentas"}</Typography>
                </Stack>
                <Box
                    component={'img'}
                    sx={{
                        height: '120px',
                        width: '100%',
                        m: '0 auto !important',
                    }}
                    src={srcImage}
                />
                <Typography variant={'h4'} fontWeight={500}>{title}</Typography>
                <Typography variant={'body2'}>{description}</Typography>
            </Stack>
            
            <DiagonalArrowButton size={'small'} sx={{textAlign: 'center', width: '65%'}} color={'info'} variant={'outlined'}>
                Conocé más
            </DiagonalArrowButton>
        </Stack>
    )
}

export default MarketInstructionManualsBanners