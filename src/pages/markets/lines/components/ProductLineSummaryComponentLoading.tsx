import React from "react";
import { Box, Stack, Theme, useMediaQuery } from "@mui/material";
import { Skeleton } from "@mui/lab";

const OffererHeader = () => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={100} height={24} />
        </Stack>
    );
}

const ProductLineHeader = () => {
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <OffererHeader/>

            <Stack direction="row" alignItems="center" spacing={1}>
                <Skeleton variant="rounded" width={isMobileScreenSize ? 50 : 100} height={24} />
                <Skeleton variant="circular" width={isMobileScreenSize ? 15 : 20} height={isMobileScreenSize ? 15 : 20} />
            </Stack>
        </Stack>
    );
}

const ProductLineTitleAndDescription = () => {
    return (
        <Stack spacing={1}>
            <Skeleton variant="text" width="50%" height={24} />
            <Skeleton variant="text" width="30%" height={18} />
        </Stack>
    );
}

const MessageActionButton = () => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="flex-end">  
            <Skeleton variant="rectangular" width="15%" height={32} sx={{ borderRadius: "8px", mr: 2 }} />
        </Stack>
    );
}

const ProductLineSummaryComponentLoading = () => {
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                padding: "16px",
                borderRadius: "24px",
                border: "1px solid #EDF2F7",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "100%",
            }}
        >
            <ProductLineHeader/>
            <ProductLineTitleAndDescription/>
            {!isMobileScreenSize && <MessageActionButton/>}
        </Box>
    );
}

const ProductLineGroupTitleAndDescription = () => {
    return (
        <Stack spacing={0}>
            <Skeleton variant="text" width="40%" height={28} sx={{ display: "inline-block" }} />
            <Skeleton variant="text" width="80%" height={18} sx={{ display: "inline-block" }} />
        </Stack>
    );
}

const ProductLineGroupCards = ({ length = 3 }: { length?: number }) => {
    return (
        <Stack spacing={2}>
            {Array.from({ length }).map((_, index) => (
                <ProductLineSummaryComponentLoading key={`Product_${index}`} />
            ))}
        </Stack>
    );
}

const ProductCategoryLoading = ({ length = 3 }: { length?: number }) => {
    return (
        <Box
            sx={{
                padding: "16px",
                borderRadius: "24px",
                border: "1px solid #EDF2F7",
                backgroundColor: "#F7FAFC",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "100%",
            }}
        >
            <ProductLineGroupTitleAndDescription/>
            <ProductLineGroupCards length={length}/>
        </Box>
    );
}

export default function ProductLineSummaryComponentLoadingList() {
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <Stack spacing={4} sx={{ width: "100%" }}>
            {!isMobileScreenSize && <ProductCategoryLoading length={1} />}
            <ProductCategoryLoading length={2} />
        </Stack>
    );
}
