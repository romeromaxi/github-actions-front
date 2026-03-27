import {Box, Button, Card, Stack, useMediaQuery} from "@mui/material";
import {TypographyBase} from "../misc/TypographyBase";
import {useTheme} from "@mui/system";
import React from "react";

type VariantFlyerType = 'success' | 'info' | 'warning' | 'error';

interface FlyerBaseProps {
    variant?: VariantFlyerType,
    title: string,
    eyebrow?: string,
    description?: string,
    ImageProps?: {
        source: string,
        leftPosition?: string,
        desktopWidth?: number | string,
        desktopHeight?: number | string,
        mobileWidth?: number | string,
        mobileHeight?: number | string,
        absoluteOnDesktop?: boolean,
        topPosition?: string,
        alignSelfMobile?: 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch' | string,
        alignSelfDesktop?: 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch' | string,
        justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | string,
        mixBlendMode?: string,
        opacity?: number
    },
    ButtonProps?: {
        label: string,
        endIcon?: React.ReactNode,
        onClick: () => void,
        id?: string
    },
    maxWidth?: number | string,
    minHeight?: number | string,
    paddingMobile?: string,
    paddingDesktop?: string,
    typographyVariants?: {
        titleDesktop?: string,
        titleMobile?: string,
        descriptionDesktop?: string,
        descriptionMobile?: string,
        eyebrowDesktop?: string,
        eyebrowMobile?: string,
    },
    buttonLayout?: 'right' | 'below-title';
    contentSpacing?: number,
    buttonSpacing?: number;
    imageContainerWidth?: number | string,
}

const backgroundColorVariantMap: Record<string, string> = {
    'success': '#016938',
    'info': '#164293',
    'warning': '#C47F30',
    'error': '#934451'
}

const buttonColorVariantMap: Record<string, string> = {
    'success': '#008547',
    'info': '#174393',
    'warning': '#C47F30',
    'error': '#A75966'
}

function FlyerBase({
    variant = 'success',
    title,
    eyebrow,
    description,
    ImageProps,
    ButtonProps,
    maxWidth,
    minHeight,
    paddingMobile,
    paddingDesktop,
    typographyVariants,
    buttonLayout = 'right',
    buttonSpacing = 4,
    contentSpacing,
    imageContainerWidth,
}: FlyerBaseProps) {
    const theme = useTheme();
    const mobileView = useMediaQuery(theme.breakpoints.down('mid'));
    
    const backgroundColor = backgroundColorVariantMap[variant];
    const buttonColor = buttonColorVariantMap[variant];

    const computedPadding = mobileView
        ? (paddingMobile ?? '24px 24px 24px 24px')
        : (paddingDesktop ?? `24px 24px 24px ${!!ImageProps ? "110px" : "46px"}`);

    const imageIsAbsolute = !mobileView && (ImageProps?.absoluteOnDesktop ?? true);
    const imgHeight = mobileView ? (ImageProps?.mobileHeight ?? '100px') : (ImageProps?.desktopHeight ?? '100px');
    const imgWidth = mobileView ? (ImageProps?.mobileWidth ?? undefined) : (ImageProps?.desktopWidth ?? undefined);

    const defaultTop = (!!eyebrow && !!description) ? '6px' : '-2px';

    const eyebrowVariant = mobileView
        ? (typographyVariants?.eyebrowMobile ?? 'eyebrow3')
        : (typographyVariants?.eyebrowDesktop ?? 'eyebrow3');

    const titleVariant = mobileView
        ? (typographyVariants?.titleMobile ?? 'h4')
        : (typographyVariants?.titleDesktop ?? 'h4');

    const descriptionVariant = mobileView
        ? (typographyVariants?.descriptionMobile ?? 'body2')
        : (typographyVariants?.descriptionDesktop ?? 'body2');

    const spacingValue = contentSpacing ?? 0.75;

    return (
        <Card sx={{
            width: '100%',
            height: '100%',
            maxWidth: maxWidth,
            minHeight: minHeight,
            backgroundColor: backgroundColor,
            backgroundImage: 'url(/images/allies-texture.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: computedPadding,
            borderRadius: '24px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            <Stack width={1}
                   sx={{
                       height: '100%',
                       justifyContent: 'center',
                       alignItems: (!mobileView && ImageProps && imageContainerWidth) ? 'center' : 'flex-start',
                       columnGap: (!mobileView && ImageProps && imageContainerWidth) ? '56px' : 0,
                   }}
                   direction={!mobileView && ImageProps && imageContainerWidth ? 'row' : 'column'}
            >

                {ImageProps && (mobileView || !imageContainerWidth) &&
                    (() => {
                        const imgSx: any = {
                            position: imageIsAbsolute ? 'absolute' : 'static',
                            width: imgWidth,
                            height: imgHeight as any,
                            left: imageIsAbsolute ? (ImageProps!.leftPosition || '-23px') : undefined,
                            top: imageIsAbsolute ? (ImageProps!.topPosition ?? defaultTop) : undefined,
                            zIndex: imageIsAbsolute ? 2 : undefined,
                            mixBlendMode: ImageProps!.mixBlendMode as any,
                            opacity: ImageProps!.opacity as any
                        };
                        return (
                            <Box component="img"
                                 src={ImageProps.source}
                                 alignSelf={mobileView ? (ImageProps.alignSelfMobile ?? 'center') : 'auto'}
                                 sx={imgSx}
                            />
                        );
                    })()
                }

                {ImageProps && !mobileView && imageContainerWidth && (
                    <Box
                        sx={{
                            width: imageContainerWidth,
                            display: 'flex',
                            alignItems: (!mobileView && ImageProps && imageContainerWidth) ? 'center' : (ImageProps?.alignSelfDesktop || 'flex-end'),
                            justifyContent: 'flex-end',
                            position: 'relative',
                            minHeight: minHeight || 0,
                            height: '100%',
                        }}
                    >
                        <Box component="img"
                             src={ImageProps.source}
                             sx={{
                                 width: imgWidth,
                                 height: imgHeight,
                                 mixBlendMode: ImageProps.mixBlendMode as any,
                                 opacity: ImageProps.opacity as any,
                                 position: 'relative',
                                 zIndex: 2,
                                 marginRight: 0,
                             }}
                        />
                    </Box>
                )}


                <Stack
                    direction={(buttonLayout === 'right' && !mobileView) ? 'row' : 'column'}
                    justifyContent={(!mobileView && ImageProps && imageContainerWidth) ? 'center' : ((buttonLayout === 'right' && !mobileView) ? 'space-between' : 'flex-start')}
                    alignItems={(buttonLayout === 'right' && !mobileView) ? 'center' : 'flex-start'}
                    spacing={(buttonLayout === 'below-title' ? buttonSpacing : spacingValue)}
                    width={(!mobileView && ImageProps && imageContainerWidth) ? `calc(100% - ${typeof imageContainerWidth === 'number' ? imageContainerWidth + 'px' : imageContainerWidth})` : 1}
                    height={(!mobileView && ImageProps && imageContainerWidth) ? '100%' : 'auto'}
                >
                    <Stack
                        spacing={spacingValue}
                        alignItems="flex-start"
                        justifyContent={(!mobileView && ImageProps && imageContainerWidth) ? 'center' : 'flex-start'}
                        sx={{ height: (!mobileView && ImageProps && imageContainerWidth) ? '100%' : 'auto', flexGrow: buttonLayout === 'right' && !mobileView ? 1 : 0 }}
                        {...((buttonLayout !== 'right' || mobileView) && { width: 1 })}
                    >
                        {eyebrow && (
                            <TypographyBase variant={eyebrowVariant as any}
                                textTransform={'uppercase'}
                                fontWeight={400}
                                sx={{ color: '#FFFFFF', order: 1 }}>
                                {eyebrow}
                            </TypographyBase>
                        )}
                        <TypographyBase variant={titleVariant as any}
                            sx={{ color: '#FFFFFF', order: 2 }}>
                            {title}
                        </TypographyBase>
                        {description && (
                            <TypographyBase variant={descriptionVariant as any}
                                sx={{ letterSpacing: '-0.02em', color: '#FFFFFF', order: 3 }}>
                                {description}
                            </TypographyBase>
                        )}
                    </Stack>

                    {ButtonProps && buttonLayout === 'right' && (
                        <Button
                            variant="contained"
                            size={'medium'}
                            endIcon={ButtonProps.endIcon}
                            fullWidth={mobileView}
                            id={ButtonProps.id}
                            onClick={ButtonProps.onClick}
                            sx={{
                                color: `${buttonColor} !important`,
                                backgroundColor: 'white !important',
                                fontFamily: 'Geist',
                                fontWeight: 600,
                                mt: 0,
                                minWidth: 120,
                            }}
                        >
                            {ButtonProps.label}
                        </Button>
                    )}

                    {ButtonProps && buttonLayout === 'below-title' && (
                        <Button
                            variant="contained"
                            size={'medium'}
                            endIcon={ButtonProps.endIcon}
                            fullWidth={mobileView}
                            id={ButtonProps.id}
                            onClick={ButtonProps.onClick}
                            sx={{
                                color: `${buttonColor} !important`,
                                backgroundColor: 'white !important',
                                fontFamily: 'Geist',
                                fontWeight: 600,
                                mt: buttonLayout === 'below-title' ? buttonSpacing : 2,
                                minWidth: !mobileView ? 120 : undefined,
                            }}
                        >
                            {ButtonProps.label}
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Card>
    )
}

export default FlyerBase;
