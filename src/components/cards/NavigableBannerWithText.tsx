import { Box, Card, CardContent, Grid, Stack, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TypographyBase } from "../misc/TypographyBase";
import {ReactNode} from "react";
import {AdDestinationTypes, AdView, AdViewFields} from "../../types/ad/adData";

interface NavigableBannerWithTextProps {
    section: string;
    mainTitle: string;
    img: string;
    goto?: string;
}

const NavigableBannerWithText = ({ section, mainTitle, img, goto }: NavigableBannerWithTextProps) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                p: 0,
                width: '100%',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: '0 0.1rem 1rem 0.1rem rgb(0 0 0 / 12%) !important',
                    transition: 'transform 0.3s ease',
                    borderRadius: '32px !important',
                },
                display: 'flex',
                justifyContent: 'center', 
                alignItems: 'center',
            }}
            onClick={() => goto && navigate(goto)}
        >
            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '100%' }}>
                <CardContent sx={{ paddingLeft: 0, paddingRight: 0, paddingY: 0, width: '85%' }}>
                    <Grid container spacing={2} alignItems={'center'} justifyContent="center">
                        <Grid item xs={12} sm={8} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Stack spacing={1} alignItems="flex-start">
                                <Typography
                                    variant={'caption'}
                                    color={'text.lighter'}
                                    sx={{
                                        fontSize: isSmallScreen ? '0.75rem' : '0.9rem',
                                    }}
                                >
                                    {section}
                                </Typography>
                                <TypographyBase
                                    variant={'h4'}
                                    maxLines={2}
                                    tooltip
                                    sx={{
                                        fontSize: isSmallScreen ? '1.2rem' : '1.3rem',
                                    }}
                                >
                                    {mainTitle}
                                </TypographyBase>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box
                                sx={{
                                    height: '72px !important',
                                    width: '230px !important',
                                }}
                                component={'img'}
                                src={img}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};


interface AdSlideComponentProps {
    ad: AdView,
    hideNavigate?: boolean;
} 

export const AdSlideComponent = ({ ad, hideNavigate }: AdSlideComponentProps) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const destinationInPlatform = [AdDestinationTypes.Platform, AdDestinationTypes.MarketAdvancedSearch].includes(ad[AdViewFields.AdDestinationTypeCode])

    const onNavigate = () => {
        destinationInPlatform ? 
            navigate(ad[AdViewFields.DestinationUrl])
            :
            window.open(ad[AdViewFields.DestinationUrl], '_blank')
    }
    
    return (
        <Box
            sx={{
                p: 0,
                width: '100% !important',
                cursor: hideNavigate ? 'default' : 'pointer',
                '&:hover': {
                    boxShadow: '0 0.1rem 1rem 0.1rem rgb(0 0 0 / 12%) !important',
                    transition: 'transform 0.3s ease',
                    borderRadius: '32px !important',
                },
                display: 'flex',
                height: isSmallScreen ? 'auto' : '120px'
            }}
            onClick={!hideNavigate ? onNavigate: () => {}}
        >
            <Card sx={{ 
                display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '100%', p: 0, height: '100%', cursor: hideNavigate ? 'default' : 'pointer'
            }}>
                <CardContent sx={{ p: 0, height: '100%', width: '100%' }}>
                    <Grid container alignItems="stretch" justifyContent="center" sx={{ height: '100%' }}>
                        <Grid item xs={12} sm={3.5}
                              sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  height: '100%',
                                  width: '100%',
                              }}
                        >
                            <Box
                                component="img"
                                src={ad[AdViewFields.ImageUrl]}
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'contain'
                                }}
                                alt={`slide-ad${ad[AdViewFields.Id]}`}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={8} sx={{ display: 'flex', justifyContent: 'center', padding: 2, width: '100%' }}>
                            <Stack spacing={0} alignItems="flex-start" width={'100%'}>
                                {
                                    ad[AdViewFields.Description] &&
                                        <Typography
                                            variant={'caption'}
                                            color={'text.lighter'}
                                            sx={{
                                                fontSize: isSmallScreen ? '0.75rem' : '0.9rem',
                                            }}
                                        >
                                            {ad[AdViewFields.Description]}
                                        </Typography>
                                }
                                <TypographyBase
                                    variant={'h6'}
                                    maxLines={3}
                                    fontWeight={400}
                                    tooltip
                                    sx={{
                                        fontSize: isSmallScreen ? '1rem' : '1.2rem',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        height: '100%',
                                        cursor: hideNavigate ? 'default' : 'pointer'
                                    }}
                                >
                                    {ad[AdViewFields.Detail]}
                                </TypographyBase>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={0.5}>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

interface BannerWithTextAndComponentProps {
    section: string;
    mainTitle: string;
    children: ReactNode;
    onClick: () => void;
}

export const BannerWithTextAndComponent = ({section, mainTitle, children, onClick} : BannerWithTextAndComponentProps) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Box
            sx={{
                p: 0,
                width: '100%',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: '0 0.1rem 1rem 0.1rem rgb(0 0 0 / 12%) !important',
                    transition: 'transform 0.3s ease',
                    borderRadius: '32px !important',
                    cursor: 'pointer'
                },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onClick={onClick}
            id="about-luc-video-home"
        >
            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '100%' }}>
                <CardContent sx={{ paddingLeft: 0, paddingRight: 0, paddingY: 0, width: '100%' }}>
                    <Grid container spacing={2} alignItems={'center'} justifyContent="center">
                        <Grid item xs={12} sm={7} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Stack spacing={1} alignItems="flex-start">
                                <Typography
                                    variant={'caption'}
                                    color={'text.lighter'}
                                    sx={{
                                        fontSize: isSmallScreen ? '0.75rem' : '0.9rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {section}
                                </Typography>
                                <TypographyBase
                                    variant={'h4'}
                                    maxLines={2}
                                    tooltip
                                    sx={{
                                        fontSize: isSmallScreen ? '1.2rem' : '1.3rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {mainTitle}
                                </TypographyBase>
                            </Stack>
                        </Grid>
                        <Grid item xs={1.5}></Grid>
                        <Grid item xs={12} sm={3.5} sx={{ display: 'flex', justifyContent: 'center' }}>
                            {children}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}

export default NavigableBannerWithText;