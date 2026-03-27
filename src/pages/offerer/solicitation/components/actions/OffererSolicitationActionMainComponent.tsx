import React from "react";
import {Card, Stack, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {TypographyBase} from "components/misc/TypographyBase";

interface OffererSolicitationActionMainComponentProps {
    title: string,
    subtitle: string,
    children: React.ReactElement | React.ReactElement[],
    titleColor?: string
}

function OffererSolicitationActionMainComponent({title, subtitle, children, titleColor}: OffererSolicitationActionMainComponentProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const childrenIsArray = Array.isArray(children) && children.length > 1;
    
    return (
        <Card>
            <Stack direction={{ xs: 'column', md: childrenIsArray ? 'column' : 'row' }}
                   justifyContent={'space-between'}
                   alignItems={{ xs: 'start', md: childrenIsArray ? 'start' : 'center' }}
                   spacing={2}
            >
                <Stack spacing={0.5}>
                    <TypographyBase variant={'button1'} color={titleColor}>
                        {title}
                    </TypographyBase>
                    <TypographyBase variant={'body2'} color={'text.lighter'}>
                        {subtitle}
                    </TypographyBase>
                </Stack>

                {
                    !!children &&
                        <Stack direction={'row'}
                               spacing={1}
                               width={{ xs: '100%', md: childrenIsArray ? '100% !important' : 'auto' }}
                               sx={{
                                   '& > *': {
                                       width: (childrenIsArray || isMobile) ? '100% !important' : 'auto'
                                   }
                               }}
                        >
                            {children}
                        </Stack>
                }
            </Stack>
        </Card>
    )
}

export default OffererSolicitationActionMainComponent;