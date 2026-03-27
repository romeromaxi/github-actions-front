import { TypographyStyleOptions } from '@mui/material/styles/createTypography';
import { TypographyProps } from "@mui/material";

export const typographyStyles = {
    variants: {
        tableLabel: (isMobileScreenSize: boolean): TypographyProps["variant"] => 
            isMobileScreenSize ? "caption" : "caption",
        tableValue: (isMobileScreenSize: boolean): TypographyProps["variant"] => 
            isMobileScreenSize ? "caption" : "body1",
        tableValueMobile: (isMobileScreenSize: boolean): TypographyProps["variant"] => 
            isMobileScreenSize ? "caption" : "body1",
        tableClickableValue: (isMobileScreenSize: boolean): TypographyProps["variant"] => 
            isMobileScreenSize ? "caption" : "body1",
    },

    tableLabel: {
        display: { xs: 'block', sm: 'none' },
        position: 'absolute',
        top: 0,
        left: '16px',
        backgroundColor: 'transparent',
        padding: '0 4px',
        color: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1,
    },

    tableValue: {
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
    } as TypographyStyleOptions,

    tableClickableValue: {
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        cursor: 'pointer',
    } as TypographyStyleOptions,
};