import React, {useMemo} from "react";
import clsx from "clsx";
import {Box, Card, CardContent, useMediaQuery, useTheme} from "@mui/material";
import BlurredLoginGateStyles from "./BlurredLoginGate.styles";
import MarketUserLoginContent from "../../markets/home/components/MarketUserLoginContent";

interface BlurredLoginGateProps {
    visible: boolean; 
    children: React.ReactNode;
    minBlurred?: boolean
}

function BlurredLoginGate({visible, children, minBlurred }: BlurredLoginGateProps) {
    const classes = BlurredLoginGateStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const minHeight = useMemo(() => isMobile ? '400px' : undefined, [isMobile]);

    return (
        <Box position={'relative'} width={'100%'} minHeight={minHeight}>
            <Box className={clsx(classes.childrenContainer, {
                [classes.childrenContainerBlurred]: visible && !minBlurred,
                [classes.childrenContainerMinBlurred]: visible && minBlurred
            })}
            >
                {children}
            </Box>

            {visible && (
                <Box className={clsx(classes.cardContainer, {
                        [classes.cardContainerMobile]: isMobile
                     })}
                     position="absolute" top={0} left={0} 
                     alignItems="start" justifyContent="center"
                >
                    <Card variant="onboarding" className={classes.card}>
                        <CardContent>
                            <MarketUserLoginContent />
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Box>
    );
}

export default BlurredLoginGate;