import {Box, Container} from "@mui/material";
import {AppBarBase} from "../components/appbar/AppBarBase";
import {Outlet} from "react-router-dom";
import ScrollTop from "./home/ScrollTop";
import React from "react";
import MarketFooter from "./components/MarketFooter";
import {useApplicationCommon} from "../hooks/contexts/ApplicationCommonContext";

interface LayoutMinimalProps {
    children?: React.ReactNode,
    gridBackground?: boolean,
    hideFooter?: boolean
}

function LayoutMinimal({ children, gridBackground, hideFooter }: LayoutMinimalProps) {
    const { paddingTopContent } = useApplicationCommon();
    
    return (
        <Box className={gridBackground ? 'grid-background-body' : ''} 
             sx={{ position: 'relative' }}>
            <Container sx={{ minHeight: !hideFooter ? '69dvh' : '' }}>
                <AppBarBase />

                <Box pt={paddingTopContent}>
                    {children}
                    <Outlet/>
                </Box>
            </Container>

            <ScrollTop />

            {!hideFooter && <MarketFooter/>}
        </Box>
    )
}

export default LayoutMinimal;