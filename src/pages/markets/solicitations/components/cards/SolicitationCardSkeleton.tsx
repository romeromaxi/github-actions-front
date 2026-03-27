import {Box, Grid, Skeleton, Stack} from "@mui/material";

interface SolicitationCardSkeletonProps {
    hideCompanyInfo?: boolean
}

function SolicitationCardSkeleton({hideCompanyInfo}: SolicitationCardSkeletonProps) {
    
    return (
        <Box
            sx={{
                position: 'relative',
                width: { xs: '100vw', sm: '100%' },
                ml: { xs: 'calc(50% - 50vw)', sm: 0 },
                mr: { xs: 'calc(50% - 50vw)', sm: 0 }
            }}
        >
            <Box
                sx={{
                    padding: { xs: '12px', md: '16px 16px' },
                    width: '100%',
                    minHeight: { xs: 'auto', md: '75px' },
                    background: '#FFFFFF',
                    border: '1px solid #ECECEC',
                    borderRadius: { xs: 0, sm: '16px' },
                }}
            >
                <Grid container spacing={{ xs: 1.5, md: 1 }} alignItems="center">
                    <Grid item xs={12} md={"auto"} sx={{
                        display: { xs: 'flex', md: 'block' },
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        order: { xs: 10, md: 0 },
                        pt: { xs: 1, md: 0 }
                    }}>
                        <Skeleton variant="rectangular" width={16} height={16} />
                    </Grid>

                    {!hideCompanyInfo && (
                        <Grid item xs={12} md={2.5} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            borderRight: { xs: 'none', md: '1px solid #ECECEC' },
                            pr: { md: 2 },
                            mr: { md: 1 },
                            order: { xs: 0, md: 1 }
                        }}>
                            <Stack direction='row' alignItems='center' spacing={2} sx={{ width: '100%' }}>
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton variant="text" width="60%" height={24} />
                            </Stack>
                        </Grid>
                    )}

                    <Grid item xs={12} md={hideCompanyInfo ? 3.8 : 2.25} sx={{
                        textAlign: { xs: 'center', md: 'left' },
                        order: { xs: 1, md: 2 }
                    }}>
                        <Stack spacing={0.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
                            <Stack direction='row' alignItems='center' spacing={1}>
                                <Skeleton variant="circular" width={24} height={24} />
                                <Skeleton variant="text" width={80} height={16} />
                            </Stack>
                            <Skeleton variant="text" width="80%" height={20} />
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2} sx={{
                        textAlign: { xs: 'center', md: 'left' },
                        order: { xs: 2, md: 3 }
                    }}>
                        <Stack spacing={0.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
                            <Skeleton variant="text" width={100} height={16} />
                            <Skeleton variant="text" width="70%" height={18} />
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={hideCompanyInfo ? 1.7 : 1.5} sx={{
                        textAlign: { xs: 'center', md: 'left' },
                        order: { xs: 3, md: 4 }
                    }}>
                        <Stack spacing={0.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
                            <Skeleton variant="text" width={60} height={16} />
                            <Skeleton variant="text" width="60%" height={18} />
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={1.5} sx={{
                        textAlign: { xs: 'center', md: 'left' },
                        order: { xs: 4, md: 5 }
                    }}>
                        <Stack spacing={0.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
                            <Skeleton variant="text" width={120} height={16} />
                            <Skeleton variant="text" width="80%" height={18} />
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={1.85} sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        order: { xs: 5, md: 6 }
                    }}>
                        <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: '32px' }} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default SolicitationCardSkeleton;