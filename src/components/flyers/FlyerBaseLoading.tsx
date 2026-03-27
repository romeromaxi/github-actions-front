import {Box, Card, Skeleton, Stack, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/system";

type VariantFlyerType = 'success' | 'info' | 'warning' | 'error';

interface FlyerBaseLoadingProps {
    variant?: VariantFlyerType;
    maxWidth?: number | string;
}

const backgroundColorVariantMap: Record<string, string> = {
    'success': '#016938',
    'info': '#164293',
    'warning': '#C47F30',
    'error': '#934451'
}

function FlyerBaseLoading({
    variant = 'success',
    maxWidth
}: FlyerBaseLoadingProps) {
    const theme = useTheme();
    const mobileView = useMediaQuery(theme.breakpoints.down('mid'));
    
    const backgroundColor = backgroundColorVariantMap[variant];
    
    return (
        <Card sx={{
            width: '100%',
            height: '100%',
            maxWidth: maxWidth,
            backgroundColor: backgroundColor,
            backgroundImage: 'url(/images/allies-texture.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: mobileView ? '24px 24px 24px 24px' : '24px 24px 24px 46px',
            borderRadius: '24px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            <Stack width={1}
                   sx={{
                       height: '100%',
                       justifyContent: 'center',
                       alignItems: 'flex-start',
                   }}
            >
                <Stack direction={mobileView ? 'column' : 'row'}
                       justifyContent={'space-between'}
                       alignItems={'center'}
                       spacing={1}
                       width={1}
                >
                    <Stack spacing={0.75}
                           width={mobileView ? 1 : 0.7}
                    >
                        <Skeleton 
                            variant="text" 
                            width={mobileView ? '40%' : '25%'} 
                            height={20}
                            sx={{ 
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '4px'
                            }}
                        />
                        
                        <Skeleton 
                            variant="text" 
                            width={'90%'} 
                            height={32}
                            sx={{ 
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '4px'
                            }}
                        />
                        
                        <Skeleton 
                            variant="text" 
                            width={'95%'} 
                            height={20}
                            sx={{ 
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '4px'
                            }}
                        />
                    </Stack>

                    <Box width={mobileView ? '100%' : 'auto'}>
                        <Skeleton 
                            variant="rectangular" 
                            width={mobileView ? '100%' : 120}
                            height={40}
                            sx={{ 
                                bgcolor: 'rgba(255, 255, 255, 0.4)',
                                borderRadius: '8px'
                            }}
                        />
                    </Box>
                </Stack>
            </Stack>
        </Card>
    );
}

export default FlyerBaseLoading;

