import React from "react";
import {Box, BoxProps, Stack} from "@mui/material";
import {TypographyBase} from "./TypographyBase";

export enum EmptyStateBoxVariant {
    Folder = 'folder',
    InfoRelated = 'infoRelated',
    BouncedChecks = 'bouncedChecks',
    Bank = 'banks',
    Solicitations = 'solicitations',
    Chat = 'chat'
}

interface EmptyStateBoxProps {
    text?: string,
    variant?: EmptyStateBoxVariant,
    srcCustom?: string,
    ImageProps?: Omit<BoxProps, 'children'>,
    children?: React.ReactNode
}

const SourceByVariantMap : Record<EmptyStateBoxVariant, string> = {
    [EmptyStateBoxVariant.Folder]: '/images/assets/folder-empty.svg',
    [EmptyStateBoxVariant.InfoRelated]: '/images/assets/info-related-empty.svg',
    [EmptyStateBoxVariant.BouncedChecks]: '/images/assets/bureau/bounced-checks-section-empty.svg',
    [EmptyStateBoxVariant.Bank]: '/images/assets/bureau/debt-current-empty.svg',
    [EmptyStateBoxVariant.Solicitations]: '/images/assets/paperclip-empty.svg',
    [EmptyStateBoxVariant.Chat]: '/images/assets/chat-bubbles-solicitation.svg',
}

function EmptyStateBox({ text, variant, srcCustom, ImageProps, children }: EmptyStateBoxProps) {
    const sourceImg = 
        !!variant ? SourceByVariantMap[variant] : 
            srcCustom || SourceByVariantMap[EmptyStateBoxVariant.InfoRelated];
    
    return (
        <Stack alignItems={'center'}
               textAlign={'center'}
               spacing={3}
               paddingY={3}
        >
            <Box component="img"
                 height={'auto'}
                 width={'clamp(100px, 25vw, 200px)'}
                 src={sourceImg}
                 { ...ImageProps }
            />
            {
                !!text &&
                    <TypographyBase variant={'h5'} color={'text.lighter'}>
                        {text}
                    </TypographyBase>
            }

            {
                !!children && children
            }
        </Stack>
    )
}

export default EmptyStateBox;
