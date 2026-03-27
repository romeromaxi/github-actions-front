import { Box, Grid, Skeleton, Stack } from "@mui/material";

function OffererSolicitationCardSkeleton() {
    return (
        <Box
            sx={{
                position: "relative",
                width: { xs: "100vw", sm: "100%" },
                ml: { xs: "calc(50% - 50vw)", sm: 0 },
                mr: { xs: "calc(50% - 50vw)", sm: 0 },
            }}
        >
            <Box
                sx={{
                    padding: { xs: "12px", md: "12px 16px" },
                    width: "100%",
                    minHeight: { xs: "auto", md: "68px" },
                    background: "#FFFFFF",
                    border: "1px solid #ECECEC",
                    borderRadius: { xs: 0, sm: "16px" },
                }}
            >
                <Grid container spacing={{ xs: 1.5, md: 1 }} alignItems="center">
                    <Grid item xs={12} md={3} sx={{ display: "flex", alignItems: "center" }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: "100%" }}>
                            <Skeleton variant="circular" width={32} height={32} />
                            <Stack spacing={0.5} sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="55%" height={14} />
                                <Skeleton variant="text" width="75%" height={18} />
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={1.4}>
                        <Stack spacing={0.5}>
                            <Skeleton variant="text" width={30} height={12} />
                            <Skeleton variant="text" width="80%" height={18} />
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={0.8}>
                        <Stack spacing={0.5}>
                            <Skeleton variant="text" width={20} height={12} />
                            <Skeleton variant="text" width="60%" height={18} />
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={1.3}>
                        <Stack spacing={0.5}>
                            <Skeleton variant="text" width={60} height={12} />
                            <Skeleton variant="text" width="70%" height={18} />
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={1.5}>
                        <Stack spacing={0.5}>
                            <Skeleton variant="text" width={90} height={12} />
                            <Skeleton variant="text" width="70%" height={18} />
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={1} sx={{ display: "flex", alignItems: "center" }}>
                        <Skeleton variant="circular" width={28} height={28} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.7} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" } }}>
                        <Skeleton variant="rectangular" width={100} height={28} sx={{ borderRadius: "20px" }} />
                    </Grid>

                    <Grid item xs={12} sm={"auto"} md={"auto"} sx={{ display: "flex", justifyContent: "flex-end", pr: 2 }}>
                        <Skeleton variant="rectangular" width={20} height={20} sx={{ borderRadius: "4px" }} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default OffererSolicitationCardSkeleton;
