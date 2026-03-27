import { Stack, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../hooks/contexts/UserContext";
import React from "react";
import { MarketStepsHelperAssistedSearch } from "./MarketStepsHelperAssistedSearch";
import { MarketStepsHelperProductSearch } from "./MarketStepsHelperProductSearch";
import FailRedirectMarketDialog from "../../pages/markets/home/components/FailRedirectMarketDialog";
const MarketStepsHelper = () => {
    const [openFail, setOpenFail] = useState<boolean>(false);
    const { isLoggedIn } = useUser();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

    const onClickMatcherLuc = React.useCallback(() => {
        navigate('/market/luc?redirect=ac08111f742d99c360628ede782615800ab2b5e0ef3fbd90ed919c0b919447a9b60e27623ee78fcc7021a47e7144df4ec044368bbd4452bb8e80e90600778c72e1721c923214746df1a57d1c1577c2db');
    }, [navigate]);

    const onClickProductsSearch = React.useCallback(() => {
        if (isLoggedIn) navigate('/market/lines');
        else setOpenFail(true);
    }, [isLoggedIn, navigate]);

    const handleCloseFailDialog = React.useCallback(() => {
        setOpenFail(false);
    }, []);

    return (
        <Stack spacing={10} my={4}>
            <Typography variant={'h2'} fontWeight={500} textAlign={'center'}>
                Buscar y elegir el financiamiento más adecuado es fácil y rápido
            </Typography>
            
            <MarketStepsHelperAssistedSearch 
                isSmallScreen={isSmallScreen}
                onClick={onClickMatcherLuc}
            />
            
            <MarketStepsHelperProductSearch 
                isSmallScreen={isSmallScreen}
                onClick={onClickProductsSearch}
            />
            
            <FailRedirectMarketDialog 
                open={openFail}
                onClose={handleCloseFailDialog}
                hideTitle
            />
        </Stack>
    );
};

export default React.memo(MarketStepsHelper);