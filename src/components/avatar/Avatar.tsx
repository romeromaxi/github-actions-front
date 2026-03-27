import React from 'react';
import { Avatar as MUIAvatar, AvatarProps as MUIAvatarProps } from '@mui/material';
import {themeTypographyDefinition} from "../../util/themes/definitions";

type SizeAvatarCustom = 'sm' | 'md' | 'lg';

interface CustomAvatarProps extends MUIAvatarProps {
    size?: SizeAvatarCustom;
}

const sizeMap : Record<SizeAvatarCustom, number> = { sm: 32, md: 40, lg: 54, };

const stylesTypographyMap : Record<SizeAvatarCustom, object> = { 
    sm: themeTypographyDefinition.caption, 
    md: themeTypographyDefinition.label,
    lg: themeTypographyDefinition.h4,
};

function Avatar({ size = 'md', style, ...props }: CustomAvatarProps) {
    const avatarSize = sizeMap[size];
    const typographyStyles = stylesTypographyMap[size];

    return (
        <MUIAvatar
            style={{
                width: avatarSize,
                height: avatarSize,
                ...style,
                ...typographyStyles
            }}
            {...props}
        />
    );
}

export { Avatar };