import React from "react";
import MenuHomeMarketButtons from "./MenuHomeMarketButtons";
import { LogoAppBar } from "./LogoAppBar";
import Stack from "@mui/material/Stack";
import {Module} from "../../../types/form/login/login-enum";

interface LogoAndLeftsideAppBarItemsProps {
    isLoggedIn: boolean;
    isLargeScreen: boolean;
    isMediumScreen: boolean;
    isMediumLargeScreen: boolean;
    userModule?: Module
}

export const LogoAndLeftsideAppBarItems = (props: LogoAndLeftsideAppBarItemsProps) => {
    const {
        isLoggedIn,
        isLargeScreen,
        isMediumScreen,
        isMediumLargeScreen,
        userModule
    } = props;

    return (
        <>
            { isLoggedIn && !isLargeScreen ? 
                <Stack direction={'row'} alignItems={'center'}  justifyContent={'flex-start'} spacing={6} flexGrow={0}>
                    <LogoAppBar isMediumLargeScreen={isMediumLargeScreen}/>
                    <MenuHomeMarketButtons module={userModule}/> 
                </Stack>
            : isLoggedIn && !isMediumScreen ?
                <Stack direction={'row'} alignItems={'center'}  justifyContent={'center'} spacing={1} flexGrow={0}>
                    <LogoAppBar isMediumLargeScreen={isMediumLargeScreen}/>
                    <MenuHomeMarketButtons module={userModule}/> 
                </Stack>
            : isLoggedIn && isMediumScreen ?
                <LogoAppBar isMediumLargeScreen={isMediumLargeScreen}/>
            : !isLoggedIn && !isMediumLargeScreen ?
                <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-start'} flexGrow={0} spacing={6}>
                    <LogoAppBar isMediumLargeScreen={isMediumLargeScreen}/>
                    <MenuHomeMarketButtons module={userModule}/> 
                </Stack>
            : !isLoggedIn && isMediumLargeScreen &&
                <LogoAppBar isMediumLargeScreen={isMediumLargeScreen}/>
            }
        </>
    );
};