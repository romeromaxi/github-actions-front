import React, { useMemo } from "react";
import { useTheme } from '@mui/system';
import {Box, Divider} from "@mui/material";
import {themeColorDefinition} from "util/themes/definitions";

interface SolicitationFollowUpStepsConnectorProps {
    color: 'primary' | 'error' | 'default',
    vertical?: boolean
}


function SolicitationFollowUpStepsConnector({ color, vertical }: SolicitationFollowUpStepsConnectorProps) {
    const theme = useTheme();
    
    const height = vertical ? '35px' : '7px';
    const width = vertical ? '7px' : '45px';
    
    const finalColor = useMemo(() => {
        switch (color) {
            case "primary":
                return theme.palette.primary.main;
                
            case "error":
                return "#720800";
                
            default: 
                return themeColorDefinition.UIElements.texts.tertiary
        }
    }, [color, theme])
    
    return (
        <Box>
            <Divider sx={{ 
                        borderColor: finalColor,
                        borderRadius: '32px',
                        backgroundColor: finalColor,
                        minHeight: height, 
                        minWidth: width 
                     }} 
                     orientation={'horizontal'} 
            />
        </Box>
    )
}

export default SolicitationFollowUpStepsConnector;