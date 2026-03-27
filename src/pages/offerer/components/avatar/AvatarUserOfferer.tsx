import React from "react";
import {Avatar, Stack, Tooltip} from "@mui/material";
import {themeColorDefinition} from "util/themes/definitions";
import {TypographyBase, TypographyBaseProps} from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";

type SizeAvatar = 'xs' | 'sm' | 'md' | 'lg';

const variantNameBySize : Record<SizeAvatar, TypographyBaseProps['variant']> = {
    'xs': 'button3',
    'sm': 'button2',
    'md': 'button2',
    'lg': 'button1'
,}

const AVATAR_COLORS = [
    '#3392FF',
    '#00BA9B',
    '#F3700B',
    '#D53DDA',
    '#3D4AE1',
    '#CC4A4A',
];

function getAvatarColor(initials: string): string {
    const normalized = initials.toUpperCase().trim();

    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
}

interface AvatarUserOffererProps {
    size: SizeAvatar,
    userName?: string,
    border?: boolean,
    includeName?: boolean,
    tooltip?: string,
    NameProps?: Omit<TypographyBaseProps, 'labelTooltip'>
}

function AvatarUserOfferer({size = 'sm', userName, border = false, includeName = false, tooltip, NameProps}: AvatarUserOffererProps) {
    const initialsName =
        !!userName ?
            userName.split(' ')
                .slice(0, 2)
                .map((w: string) => w[0])
                .join('')
            :
            ' ';

    const AvatarComponent= () => (
        <Avatar size={size}
                sx={{
                    backgroundColor: getAvatarColor(initialsName),
                    border: border ? `2px solid ${themeColorDefinition.UIElements.altTexts.main}` : 'none'
                }}
        >
            {initialsName}
        </Avatar>
    );
    
    return (
        <Tooltip title={tooltip}>
            {
                includeName ?
                    <Stack direction={'row'}
                           alignItems={'center'}
                           spacing={0.75}
                    >
                        <AvatarComponent />

                        <TypographyBase variant={variantNameBySize[size]}
                                        color={'text.main'}
                                        { ...NameProps }
                        >
                            {stringFormatter.toTitleCase(userName)}
                        </TypographyBase>
                    </Stack>
                    :
                    <AvatarComponent />
            }
        </Tooltip>
    )
}

export default AvatarUserOfferer;
