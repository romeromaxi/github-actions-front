import React, {ReactNode, useMemo, useState} from "react";
import {Box, Grid, Stack, Typography} from "@mui/material";
import {Skeleton} from "@mui/lab";
import {themeTypographyDefinition} from "util/themes/definitions";
import ProductLineCarousel from "../../lines/components/ProductLineCarousel";
import {SearchButton} from "../../../../components/buttons/Buttons";
import {useNavigate} from "react-router-dom";
import {userStorage} from "../../../../util/localStorage";
import FailRedirectMarketDialog from "./FailRedirectMarketDialog";


interface MarketLandingCategoryWrapperProps {
    icon?: ReactNode,
    title: string,
    subtitle?: string,
    best?: boolean,
    children?: ReactNode,
    hideViewAll?: boolean;
}


const MarketLandingCategoryWrapper = ({
    icon, title, subtitle, best = false, children, hideViewAll
} : MarketLandingCategoryWrapperProps) => {
    const [openFail, setOpenFail] = useState<boolean>(false)
    const navigate = useNavigate()
    const isLoggedIn = useMemo(() => userStorage.isLogged(), []);

    const navigateToMarket = () => navigate('/market/lines')
    const handleViewLanding = () => {
        if (isLoggedIn) navigateToMarket()
        else setOpenFail(true)
    }
    
    return (
        <Stack spacing={2}
            sx={{
                width: 1,
                alignItems: 'flex-start',
                padding: best ? '32px' : 0,
                backgroundColor: best ? '#E7EEF4' : 'transparent',
                borderRadius: '40px',
            }}
        >
            <Stack direction='row' spacing={2} alignItems='center'>
                {
                    icon &&
                    <Box sx={{ width: '72px', height: '72px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                        {icon}
                    </Box>
                }
                <Stack>
                    {
                        !!title &&
                            <Typography variant={'h4'} fontWeight={600}>
                                {title}
                            </Typography>
                    }
                    {
                        subtitle &&
                        <Typography variant={'h4'} color={'#818992'}>
                            {subtitle}
                        </Typography>
                    }
                </Stack>
            </Stack>
            {children}
            {best && !hideViewAll &&
                <Stack direction='row-reverse' alignItems='center' width={'100%'}>
                    <SearchButton onClick={handleViewLanding} size='small'>
                        Ver todas
                    </SearchButton>
                </Stack>
            }
            <FailRedirectMarketDialog open={openFail}
                                      onClose={() => setOpenFail(false)}
                                      description={'Para ir a la góndola, ingresá o da de alta tu usuario.'}
                                      redirect={navigateToMarket}
            />
        </Stack>
    )
}

export function MarketLandingCategoryWrapperLoading() {
    return (
        <Grid item xs={12} container spacing={2} 
              sx={{ width: 1, alignItems: 'flex-start', padding: '32px', backgroundColor: 'transparent', borderRadius: '40px' }}
        >
            <Grid item xs={12}>
                <Stack direction='row' spacing={2} alignItems='center' width={1}>
                    <Skeleton variant={'circular'} width={'72px'} height={'72px'} />
                    <Stack width={1}>
                        <Skeleton variant={'text'} width={'60%'} height={themeTypographyDefinition.h3.fontSize} />
                    </Stack>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <ProductLineCarousel productLines={undefined} />
            </Grid>
        </Grid>
    )
}

export default MarketLandingCategoryWrapper