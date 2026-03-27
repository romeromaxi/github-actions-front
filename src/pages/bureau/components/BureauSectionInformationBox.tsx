import React from "react";
import {IconButton, Stack} from "@mui/material";
import {themeColorDefinition} from "util/themes/definitions";
import {TypographyBase} from "components/misc/TypographyBase";
import {ChevronRight} from "lucide-react";

interface BureauSectionInformationBoxProps {
    label: string,
    data?: string,
    action?: React.ReactNode,
    width?: string | number,
    onClick?: () => void
}

function BureauSectionInformationBox({ label, data, width, action, onClick }: BureauSectionInformationBoxProps) {
    const isActionable = !!onClick;
    
    const ActionComponent = () => 
        !!action ? 
            <React.Fragment>{action}</React.Fragment> 
            : 
            <IconButton size="medium"
                        variant={'minPadding'}>
                <ChevronRight />
            </IconButton>
    
    return (
        <Stack direction={'row'}
               alignItems={'center'}
               justifyContent={'space-between'}
               spacing={0.5} p={1} 
               borderRadius={'0.75rem !important'}
               width={width}
               onClick={onClick}
               sx={{ 
                   cursor: isActionable ? 'pointer' : 'default',
                   backgroundColor: isActionable ? 
                       'transparent' 
                       :
                       themeColorDefinition.UIElements.backgrounds.disabled,
                   boxShadow: isActionable ?
                       `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}`
                       :
                       'none'
               }}
        >
            <Stack spacing={0.5}>
                <TypographyBase variant={'body3'} color={'text.lighter'}>
                    {label}
                </TypographyBase>
                <TypographyBase variant={'body3'} fontWeight={500} color={'text.lighter'}>
                    {data}
                </TypographyBase>
            </Stack>

            {
                (!!action || isActionable) && (
                    <ActionComponent />
                )
            }
        </Stack>
    )
}

export default BureauSectionInformationBox;