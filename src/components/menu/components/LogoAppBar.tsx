import Box from "@mui/material/Box";
import React from "react";
import { 
    AppConfig, 
    AppConfigAppBarFields, 
    AppConfigFields, 
    AppConfigLogosFields, 
    AppConfigSizeFields 
} from "../../../types/appConfigEntities";
import {AppRoutesDefinitions, useAppNavigation} from "hooks/navigation";

interface LogoAppBarProps {
    hideLogo?: boolean;
    isMediumLargeScreen: boolean;
}

export const LogoAppBar = ({ hideLogo, isMediumLargeScreen }: LogoAppBarProps) => {
    const { navigate } = useAppNavigation();
    const appConfig : AppConfig = window.APP_CONFIG;

    const goToHome = () => navigate(AppRoutesDefinitions.Home);
    
    return hideLogo && !isMediumLargeScreen ? (
        <Box sx={{
            height: appConfig[AppConfigFields.AppBar][AppConfigAppBarFields.Logo][AppConfigSizeFields.Height],
            width: appConfig[AppConfigFields.AppBar][AppConfigAppBarFields.Logo][AppConfigSizeFields.Width],
        }} />
    ) : (
        <Box
            component={'img'}
            sx={{
                height: appConfig[AppConfigFields.AppBar][AppConfigAppBarFields.Logo][AppConfigSizeFields.Height],
                width: appConfig[AppConfigFields.AppBar][AppConfigAppBarFields.Logo][AppConfigSizeFields.Width],
                '&:hover': { cursor: 'pointer' },
            }}
            alt={'LOGO'}
            src={appConfig[AppConfigFields.Logos][AppConfigLogosFields.Full]}
            onClick={goToHome}
        />
    );
};