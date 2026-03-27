import React, {ReactNode} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {
    themeBreakpointsValuesDefinition,
    themeColorDefinition,
    themeIconsSizeDefinition,
    themeShadowDefinition,
    themeTypographyDefinition
} from "util/themes/definitions";
import {SvgIcon, tableCellClasses} from "@mui/material";
import {CheckIconCustom, CheckIconCustomChecked} from './checkbox/CheckIconCustom';
import {StepIconCustom} from './stepper/StepIconCustom';
import {WrapperIcons} from "../../components/icons/Icons";
import {Check, Info, Sparkle, WarningCircle, XCircle} from "@phosphor-icons/react";
import {
    AppConfig,
    AppConfigAppBarFields,
    AppConfigFields,
    AppConfigPaletteColor,
    AppConfigPaletteColorFields,
    AppConfigPaletteFields
} from "../../types/appConfigEntities";
import {borderDashedSvg} from "../helpers/borderDashedHelper";

export const backgroundColorBase: string = '#F6F6F6';

export const blueColorBase: string = '#1565C0';
export const lightBlueColorBase: string = '#009EF7';
export const lightBlueColorLight: string = '#F1FAFF';

export const greenColorBase: string = '#04C8C8';
export const greenLightColorBase: string = '#DCFDFD';

export const redColorBase: string = '#F1416C';
export const redColorErrorMain: string = '#FFF5F8';
export const redColorErrorText: string = '#F1416C';

export const yellowColorBase: string = '#FFC700';
export const yellowColorLight: string = '#FFF8DD';

export const greyColorDisabled: string = '#A1A5B7';

export const greyColor100: string = '#F5F8FA';
export const greyColor200: string = '#EFF2F5';
export const greyColor300: string = '#E4E6EF';
export const greyColor400: string = '#B5B5C3';
export const greyColor500: string = '#A1A5B7';
export const greyColor600: string = '#7E8299';
export const greyColor700: string = '#5E6278';
export const greyColor800: string = '#3F4254';
export const greyColor900: string = '#181C32';

export const buttonDisabledIcon: string = '#00000042';

export const whiteColor: string = '#FFFFFF';

const primaryColor: string = blueColorBase;

const appConfig: AppConfig = window.APP_CONFIG;

const palettePrimary: AppConfigPaletteColor =
    appConfig[AppConfigFields.Palette][AppConfigPaletteFields.Primary];

const paletteSecondary: AppConfigPaletteColor =
    appConfig[AppConfigFields.Palette][AppConfigPaletteFields.Secondary];

const theme = createTheme({
    palette: {
        text: {
            main: themeColorDefinition.UIElements.texts.main,
            disabled: greyColorDisabled,
            //@ts-ignore
            lighter: themeColorDefinition.UIElements.texts.lighter,
            //@ts-ignore
            tertiary: themeColorDefinition.UIElements.texts.tertiary,
            //@ts-ignore
            altMain: themeColorDefinition.UIElements.altTexts.main,
        },
        background: {
            default: backgroundColorBase,
        },
        primary: {
            light: palettePrimary[AppConfigPaletteColorFields.Light],
            main: palettePrimary[AppConfigPaletteColorFields.Main],
            contrastText: palettePrimary[AppConfigPaletteColorFields.ContrastText],
            dark: palettePrimary[AppConfigPaletteColorFields.Dark]
        },
        secondary: {
            light: paletteSecondary[AppConfigPaletteColorFields.Light],
            main: paletteSecondary[AppConfigPaletteColorFields.Main],
            contrastText: paletteSecondary[AppConfigPaletteColorFields.ContrastText],
            dark: paletteSecondary[AppConfigPaletteColorFields.Dark]
        },
        info: {
            light: themeColorDefinition.systemFeedback.info.tertiary,
            main: themeColorDefinition.systemFeedback.info.primary,
            contrastText: themeColorDefinition.systemFeedback.info.primaryContrastText
        },
        success: {
            light: greenLightColorBase,
            main: themeColorDefinition.systemFeedback.success.primary,
            contrastText: themeColorDefinition.systemFeedback.success.primaryContrastText,
            // @ts-ignore
            strong: themeColorDefinition.systemFeedback.success.strong,
        },
        error: {
            light: themeColorDefinition.systemFeedback.error.tertiary,
            main: themeColorDefinition.systemFeedback.error.primary,
            contrastText: themeColorDefinition.systemFeedback.error.primaryContrastText,
            // @ts-ignore
            strong: themeColorDefinition.systemFeedback.error.strong,
        },
        warning: {
            light: themeColorDefinition.systemFeedback.warning.tertiary,
            main: themeColorDefinition.systemFeedback.warning.primary,
            contrastText: themeColorDefinition.systemFeedback.warning.primaryContrastText,
            // @ts-ignore
            strong: themeColorDefinition.systemFeedback.warning.strong,
            // @ts-ignore
            secondaryContrastText: themeColorDefinition.systemFeedback.warning.secondaryContrastText,
        },
        accent: {
            moreLight: themeColorDefinition.systemFeedback.accent.tertiary,
            light: themeColorDefinition.systemFeedback.accent.secondary,
            main: themeColorDefinition.systemFeedback.accent.primary,
            contrastText: themeColorDefinition.systemFeedback.accent.primaryContrastText,
            dark: themeColorDefinition.systemFeedback.accent.strong,
            // @ts-ignore
            strong: themeColorDefinition.systemFeedback.accent.strong,
        },
        accentNotifications: {
            main: themeColorDefinition.systemFeedback.accentNotifications.primary,
            contrastText: themeColorDefinition.systemFeedback.accentNotifications.primaryContrastText,
        },
        grey: {
            100: greyColor100,
            200: greyColor200,
            300: greyColor300,
            400: greyColor400,
            500: greyColor500,
            600: greyColor600,
            700: greyColor700,
            800: greyColor800,
            900: greyColor900,
        },
    },


    breakpoints: {
        values: themeBreakpointsValuesDefinition
    },

    typography: {
        // 1rem = 16px: se define en el index.css "html { font-size }"
        fontFamily: [appConfig[AppConfigFields.FontFamily] || 'WorkSans'].join(','),
        ...themeTypographyDefinition,
    },

    shadows: [
        'none',
        themeShadowDefinition.sm.boxShadow,
        themeShadowDefinition.md.boxShadow,
        themeShadowDefinition.lg.boxShadow,
        'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none',
        'none', 'none', 'none', 'none', 'none', 'none', 'none',
    ],

    components: {
        MuiAccordion: {
            styleOverrides: {
                root: {
                    boxShadow: 'none !important',
                    backgroundColor: 'transparent !important',
                    borderRadius: '32px !important'
                },
            },
            variants: [
                {
                    props: { variant: 'companyData' },
                    style: {
                        '&:before': {
                            display: 'none',
                        },
                        '& > .MuiAccordionSummary-root': {
                            paddingLeft: '4px',
                            paddingRight: '4px',
                            minHeight: 'auto'
                        },
                        '& .MuiAccordionDetails-root': {
                            paddingLeft: '0px',
                            paddingRight: '0px',
                        }
                    }
                }
            ]
        },
        
        MuiAvatar: {
            variants: [
                {
                    props: { size: 'xs' },
                    style: {
                        ...themeTypographyDefinition.button2,
                        height: '1.125rem',
                        width: '1.125rem',
                        fontSize: '0.5rem',
                    }
                },
                {
                    props: { size: 'sm' },
                    style: {
                        ...themeTypographyDefinition.button2,
                        height: '1.5rem',
                        width: '1.5rem',
                        fontSize: '0.625rem',
                    }
                },
                {
                    props: { size: 'md' },
                    style: {
                        ...themeTypographyDefinition.button2,
                        height: '2rem',
                        width: '2rem',
                        fontSize: '0.875rem',
                    }
                },
                {
                    props: { size: 'lg' },
                    style: {
                        ...themeTypographyDefinition.button2,
                        height: '3rem',
                        width: '3rem',
                        fontSize: '1.5rem',
                        //backgroundColor: themeColorDefinition.systemFeedback.accentNotifications.primary,
                        //color: themeColorDefinition.systemFeedback.accentNotifications.primaryContrastText,
                        //border: `1px solid ${themeColorDefinition.systemFeedback.accentNotifications.primaryContrastText}`
                    }
                }
            ]
        },

        MuiCssBaseline: {
            styleOverrides: {
                '.swiper-wrapper': {
                    boxSizing: 'inherit !important',
                    paddingBottom: '20px !important'
                },
                '.swiper-slide': {
                    width: 'auto'
                },
                '.swiper-button-next': {
                    right: '-2px',
                    zIndex: 10,
                    backgroundColor: '#dee2e7',
                    color: '#000',
                    borderRadius: '100%',
                    width: '32px',
                    padding: '20px',
                    height: '32px',
                },
                '.swiper-button-prev': {
                    left: '-2px',
                    zIndex: 10,
                    padding: '20px',
                    backgroundColor: '#dee2e7',
                    color: '#000',
                    borderRadius: '100%',
                    width: '32px',
                    height: '32px',
                },
                '.swiper-pagination': {
                    position: 'absolute !important',
                    bottom: '-8px !important',
                    left: '0 !important',
                    width: '100%',
                    textAlign: 'center',
                },
                '.swiper-pagination-bullets': {
                    paddingBottom: '2px !important',
                },
                '.swiper-pagination-bullet': {
                    width: '12px',
                    height: '12px',
                    opacity: 1,
                    backgroundColor: '#A0AEC0',
                    transition: 'all 0.2s ease',
                    borderRadius: '100px',
                    zIndex: 10
                },

                '.swiper-pagination-bullet-active': {
                    width: '24px'
                },
                '.swiper-button-next:hover, .swiper-button-prev:hover': {
                    backgroundColor: '#f0f0f0',
                },
                '.swiper-button-next::after, .swiper-button-prev::after': {
                    fontSize: '22px',
                },

                '.dashed-success-12': {
                    backgroundImage: borderDashedSvg(themeColorDefinition.systemFeedback.success.strong, 12)
                },

                '.dashed-success-16': {
                    backgroundImage: borderDashedSvg(themeColorDefinition.systemFeedback.success.strong, 16)
                },
                
                '.dashed-warning-12': {
                    backgroundImage: borderDashedSvg(themeColorDefinition.systemFeedback.warning.primary, 12)
                },

                '.dashed-warning-16': {
                    backgroundImage: borderDashedSvg(themeColorDefinition.systemFeedback.warning.primary, 16)
                },
            },
        },

        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    margin: '-5px -5px 0 -5px',
                    '& > h4': {
                        color: `red !important`,
                    },
                },
                content: {
                    margin: 0,
                    "&.Mui-expanded": {
                        margin: 0,
                    },
                    '& h4': {
                        //fontFamily: 'Yantramanav !important',
                        //fontSize: '1rem !important',
                        //fontWeight: '500 !important',
                        //textAlign: 'center',
                        //padding: '8px 10px',
                    },
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    padding: '0 !important',
                    color: '#232926 !important',
                    minHeight: `${appConfig[AppConfigFields.AppBar][AppConfigAppBarFields.Height]} !important`,
                    '& > div': {
                        height: '100%',
                        '& > div': {
                            height: '100%'
                        }
                    }
                }
            }
        },

        MuiBadge: {
            variants: [
                {
                    props: {color: 'default'},
                    style: {
                        '& > span': {
                            height: '20px',
                            width: '20px',
                            borderRadius: '100px',
                            backgroundColor: 'white !important'
                        }
                    }
                }
            ]
        },

        MuiAlert: {
            styleOverrides: {
                root: {
                    padding: '1.5rem',
                    fontSize: '1rem',
                    alignItems: 'flex-start',
                    borderRadius: '16px',
                    '& > .MuiAlert-message': {
                        ...themeTypographyDefinition.body2
                    },
                    '&.MuiPaper-root': {
                        width: '100% !important',
                        maxWidth: '100% !important',
                        backgroundColor: 'white'
                    },
                    '&.MuiAlert-colorDefault': {
                        border: `1px solid ${themeColorDefinition.actions.main.default}`
                    }
                },
                icon: {
                    padding: 0
                },
                message: {
                    padding: 0
                },
                action: {
                    padding: 0
                }
            },
            defaultProps: {
                iconMapping: {
                    info: <WrapperIcons Icon={Info} size={'md'}/>,
                    error: <WrapperIcons Icon={XCircle} size={'md'}/>,
                    success: <WrapperIcons Icon={Check} size={'md'}/>,
                    warning: <WrapperIcons Icon={WarningCircle} size={'md'}/>,
                    // @ts-ignore
                    default: <WrapperIcons Icon={Sparkle} size={'md'}/>
                }
            },
            variants: [
                {
                    props: {severity: 'info'},
                    style: {
                        borderColor: themeColorDefinition.systemFeedback.info.primary,
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: themeColorDefinition.systemFeedback.info.strong
                        }
                    }
                },
                {
                    props: {severity: 'error'},
                    style: {
                        borderColor: themeColorDefinition.systemFeedback.error.primary,
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: themeColorDefinition.systemFeedback.error.strong
                        }
                    }
                },
                {
                    props: {severity: 'success'},
                    style: {
                        borderColor: themeColorDefinition.systemFeedback.success.primary,
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: themeColorDefinition.systemFeedback.success.strong
                        }
                    }
                },
                {
                    props: {severity: 'warning'},
                    style: {
                        borderColor: themeColorDefinition.systemFeedback.warning.primary,
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: themeColorDefinition.systemFeedback.warning.strong
                        }
                    }
                },


                {
                    props: {severity: 'info', role: 'disclaimer', variant: 'standard'},
                    style: {
                        backgroundColor: '#E8EEF9 !important',
                        color: '#0D3F9B !important',
                        boxShadow: `inset 0 0 0 1px #3677ED`,
                        '& > .MuiAlert-icon': {
                            color: '#0D3F9B',
                        },
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: '#0D3F9B !important',
                        }
                    }
                },
                {
                    props: {severity: 'info', role: 'disclaimer', variant: 'filled'},
                    style: {
                        backgroundColor: '#E8EEF9 !important',
                        color: '#0D3F9B !important',
                        '& > .MuiAlert-icon': {
                            color: '#0D3F9B',
                        },
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: '#0D3F9B !important',
                        }
                    }
                },
                {
                    props: {severity: 'accent', variant: 'filled'},
                    style: {
                        backgroundColor: 'transparent !important',
                        color: '#3677ED !important',
                        '& > .MuiAlert-icon': {
                            color: '#3677ED',
                        },
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: '#3677ED !important',
                        }
                    }
                },
                {
                    props: {severity: 'info', variant: 'text'},
                    style: {
                        backgroundColor: '#E8EEF9 !important',
                        color: '#0D3F9B !important',
                        '& > .MuiAlert-icon': {
                            color: '#0D3F9B',
                        },
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: '#0D3F9B !important',
                        }
                    }
                },

                {
                    props: {severity: 'error', role: 'disclaimer'},
                    style: {
                        backgroundColor: '#FDF6F6 !important',
                        color: '#720800 !important',
                        boxShadow: `inset 0 0 0 1px #720800`,
                        '& > .MuiAlert-icon': {
                            color: '#720800',
                        },
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: '#720800 !important',
                        }
                    }
                },
                {
                    props: {severity: 'success', role: 'disclaimer'},
                    style: {
                        backgroundColor: '#E6FFF4 !important',
                        color: '#26825A !important',
                        boxShadow: `inset 0 0 0 1px #26825A`,
                        '& > .MuiAlert-icon': {
                            color: '#26825A',
                        },
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: '#26825A !important',
                        },
                    }
                },
                {
                    props: {severity: 'warning', role: 'disclaimer'},
                    style: {
                        backgroundColor: '#FDF6E5 !important',
                        color: '#634700 !important',
                        boxShadow: `inset 0 0 0 1px #634700`,
                        '& > .MuiAlert-icon': {
                            color: '#634700',
                        },
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            color: '#634700 !important',
                        }
                    }
                },
                {
                    props: {size: 'small'},
                    style: {
                        padding: '1rem',
                        '& > .MuiAlert-message': {
                            ...themeTypographyDefinition.body3,
                            fontWeight: 400
                        },
                        '& > .MuiAlert-message > .MuiAlertTitle-root': {
                            ...themeTypographyDefinition.body2,
                        }
                    }
                },

                {
                    props: {role: 'text'},
                    style: {
                        padding: '0px !important'
                    }
                },
                {
                    props: {role: 'text', size: 'small'},
                    style: {
                        '& > .MuiAlert-icon > svg': {
                            fontSize: '1rem',
                            height: '1rem',
                            width: '1rem',
                        },
                    }
                },
            ],
        },

        MuiAlertTitle: {
            styleOverrides: {
                root: {
                    ...themeTypographyDefinition.h5
                },
            }
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    ...themeTypographyDefinition.label,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    isolation: 'isolate',

                    borderRadius: '100px',
                    textTransform: 'none',
                    height: 'fit-content',
                    width: 'fit-content'
                },
                sizeLarge: {
                    padding: '16px 18px !important',
                    ...themeTypographyDefinition.button1,
                    '& > span': {
                        '& > svg': {
                            fontSize: '1.25rem !important',
                            width: '1.25rem !important',
                            height: '1.25rem !important',
                        },
                    },
                },
                sizeMedium: {
                    padding: '12px 16px !important',
                    ...themeTypographyDefinition.button2,
                    '& > span': {
                        // marginTop: '-2px !important',
                        '& > svg': {
                            fontSize: '1rem !important',
                            width: '1rem !important',
                            height: '1rem !important',
                        },
                    },
                },
                sizeSmall: {
                    padding: '8px 16px !important',
                    ...themeTypographyDefinition.button3,
                    '& > span': {
                        marginTop: '-1px !important',
                        '& > svg': {
                            fontSize: '0.875rem !important',
                            width: '0.875rem !important',
                            height: '0.875rem !important',
                        },
                    },
                },
                fullWidth: {
                    width: '100% !important'
                }
            },
            variants: [
                {
                    props: { disabled: true },
                    style: {
                        pointerEvents: 'auto !important',
                        cursor: 'not-allowed !important',
                        '&:hover': {
                            pointerEvents: 'auto !important',
                            cursor: 'not-allowed !important',
                        }
                    },
                },
                {
                    props: {variant: "text", color: "primary"},
                    style: {
                        color: palettePrimary[AppConfigPaletteColorFields.Main],
                        WebkitTextFillColor: palettePrimary[AppConfigPaletteColorFields.Main],
                        backgroundColor: "transparent",
                        '&:hover': {
                            color: "#309D6A", //palettePrimary[AppConfigPaletteColorFields.Light],
                            boxShadow: 'none',
                        },
                        "&:active": {
                            color: palettePrimary[AppConfigPaletteColorFields.Dark],
                        },
                    },
                },
                {
                    props: {variant: "contained", color: "primary"},
                    style: {
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: "#309D6A", //palettePrimary[AppConfigPaletteColorFields.Light],
                            boxShadow: 'none',
                        },
                        "&.Mui-disabled": {
                            color: palettePrimary[AppConfigPaletteColorFields.ContrastText],
                            backgroundColor: "#008547",
                            opacity: 0.4
                        },
                        "&:active": {
                            backgroundColor: palettePrimary[AppConfigPaletteColorFields.Dark],
                        },
                    },
                },
                {
                    props: {variant: "outlined", color: "primary"},
                    style: {
                        color: palettePrimary[AppConfigPaletteColorFields.Main],
                        WebkitTextFillColor: palettePrimary[AppConfigPaletteColorFields.Main],
                        backgroundColor: 'transparent',
                        border: `1px solid ${palettePrimary[AppConfigPaletteColorFields.Main]}`,
                        boxShadow: `inset 0 0 0 2px transparent`,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            border: `1px solid ${palettePrimary[AppConfigPaletteColorFields.Main]}`,
                        },
                        "&.Mui-disabled": {
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                            opacity: 0.4
                        },
                        "&:active": {
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        },
                    },
                },
                {
                    props: {variant: "outlined", color: "primary", disabled: true},
                    style: {
                        border: 'none',
                        boxShadow: `inset 0 0 0 2px ${themeColorDefinition.actions.main.disabled}`,
                        cursor: 'not-allowed !important'
                    },
                },
                {
                    props: {variant: "contained", color: "inherit"},
                    style: {
                        boxShadow:
                            'inset 0 1px 0 rgba(255, 255, 255, 0.15),0 1px 1px rgba(0, 0, 0, 0.075)',
                        color: greyColor600,
                        backgroundColor: greyColor100,
                        height: 'fit-content',
                        '&:hover': {
                            backgroundColor: greyColor200,
                            boxShadow: 'none',
                        },
                    }
                },
                {
                    props: {variant: "contained", color: "secondary"},
                    style: {
                        backgroundColor: 'transparent',
                        color: '#232926 !important',
                        boxShadow: `inset 0 0 0 2px transparent`,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        "&.Mui-disabled": {
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                            opacity: 0.4
                        },
                        "&:active": {
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        },
                    },
                },
                {
                    props: {variant: "outlined", color: "secondary"},
                    style: {
                        backgroundColor: 'transparent',
                        border: '1px solid #BFBFBF',
                        color: '#232926 !important',
                        boxShadow: `inset 0 0 0 2px transparent`,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            border: '1px solid #BFBFBF',
                        },
                        "&.Mui-disabled": {
                            border: '1px solid #BFBFBF',
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                            opacity: 0.4
                        },
                        "&:active": {
                            border: '1px solid #BFBFBF',
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        },
                    },
                },
                {
                    props: {variant: "min-contained", color: "secondary"},
                    style: {
                        paddingLeft: '0px !important',
                        paddingRight: '0px !important',
                        backgroundColor: 'transparent',
                        color: '#232926 !important',
                        boxShadow: `inset 0 0 0 2px transparent`,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        "&.Mui-disabled": {
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                            opacity: 0.4
                        },
                        "&:active": {
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        },
                    },
                },


                {
                    props: {variant: "text", size: "extra-small"},
                    style: {
                        ...themeTypographyDefinition.caption,
                        padding: '0px 4px !important',
                        fontWeight: 400,
                        textDecoration: 'underline !important',
                        letterSpacing: '0.3px',
                        '& > span': {
                            marginTop: '-1px !important',
                            '& > svg': {
                                fontSize: '1rem !important',
                            },
                        },
                    }
                },


                {
                    props: {minPadding: true},
                    style: {
                        padding: '0px !important',
                    }
                },


                {
                    props: {variant: "appbar"},
                    style: {
                        ...themeTypographyDefinition.button3,
                        padding: '16px',
                        borderRadius: '200px',
                        color: `${themeColorDefinition.UIElements.texts.main} !important`,
                        fontWeight: 500,
                        placeContent: 'start'
                    }
                },
                {
                    props: {variant: "appbar", active: true},
                    style: {
                        ...themeTypographyDefinition.button3,
                        padding: '16px',
                        borderRadius: '200px',
                        backgroundColor: '#F2F2F2 !important',
                        color: '#006A39 !important',
                        fontWeight: 500
                    }
                },

                {
                    props: {variant: "tabVertical"},
                    style: {
                        color: themeColorDefinition.UIElements.texts.main,
                        borderRadius: '16px',
                        justifyContent: 'flex-start',
                        paddingX: '12px !important',
                        textAlign: 'left',
                        '& > span': {
                            '& > svg': {
                                fontSize: '1.5rem !important',
                                width: '1.5rem !important',
                                height: '1.5rem !important',
                            },
                        },
                        '& .MuiButton-endIcon': {
                            marginLeft: 'auto',
                        },
                        '&:hover': {
                            backgroundColor: themeColorDefinition.UIElements.backgrounds.brandSubtle,
                        },
                    }
                }
            ]
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    padding: '24px',

                    border: 0,
                    boxShadow: 'none', // '0px 10px 35px 0px rgb(56 71 109 / 8%)',
                    backgroundColor: 'white',
                    borderRadius: '16px !important',
                },
            },
            variants: [
                {
                    props: {variant: "onboarding"},
                    style: {
                        width: '100%',
                        maxWidth: 670,
                        borderRadius: '24px !important',
                        padding: '27px 32px !important'
                    },
                },
                {
                    props: {variant: "card-button"},
                    style: {
                        height: '-webkit-fill-available',
                        minHeight: '100%',
                        borderRadius: '12px !important',
                        padding: '16px !important',
                        boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.tertiary} !important`,
                    },
                },
                {
                    props: {variant: "infoBureau"},
                    style: {
                        borderRadius: '24px !important',
                        height: '-webkit-fill-available',
                        '& > .MuiCardContent-root': {
                            height: '-webkit-fill-available',
                        }
                    },
                },
                {
                    props: { variant: "accordionCompanyData" },
                    style: {
                        padding: '24px',
                        borderRadius: '24px !important'
                    }
                }
            ]
        },

        MuiCardActions: {
            styleOverrides: {
                root: {
                    justifyContent: 'flex-end',
                },
            },
        },

        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '0rem',
                    //padding: '1.25rem 2.25rem 0 2.25rem',
                    '&:last-child': {
                        paddingBottom: '0rem !important'
                    }
                },
            },
        },

        MuiCardHeader: {
            styleOverrides: {
                root: {
                    /*backgroundColor: 'transparent',*/
                    padding: '0rem',
                    //padding: '0.6rem 2.25rem 0.6rem 2.25rem',
                    //marginBottom: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    //flexWrap: 'wrap',
                    minHeight: '30px',
                    //borderBottom: `1px solid ${greyColor200}`,

                    // News
                    paddingBottom: '24px !important',
                    '&:last-child': {
                        paddingBottom: '0pc !important',
                    }
                },
                title: {
                    ...themeTypographyDefinition.h5,
                    //paddingTop: '0.5rem',
                    marginTop: 0,
                    flexWrap: 'wrap'
                },
                subheader: {
                    ...themeTypographyDefinition.body3,
                    color: themeColorDefinition.UIElements.texts.disabled,
                },
                action: {
                    alignSelf: 'center'
                },
                content: {
                    overflow: 'hidden'
                }
            },
            variants: [
                {
                    props: { minPadding: true },
                    style: {
                        paddingBottom: '12px !important',
                    }
                }
            ]
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: '.85rem !important',
                    fontWeight: 400,
                    borderRadius: '100px',
                    width: 'fit-content',
                    color: themeColorDefinition.UIElements.texts.default,
                    backgroundColor: themeColorDefinition.actions.main.disabled,
                    '& .MuiChip-deleteIcon': {
                        color: themeColorDefinition.UIElements.texts.default,
                    }
                },
                colorPrimary: {
                    color: themeColorDefinition.UIElements.altTexts.default,
                    backgroundColor: `${themeColorDefinition.actions.main.default} !important`,
                },
                colorSecondary: {
                    color: themeColorDefinition.UIElements.texts.main,
                    backgroundColor: `${themeColorDefinition.UIElements.backgrounds.brandSubtle} !important`,
                    borderRadius: '32px !important',
                    padding: '8px 12px !important',
                    '& .MuiChip-deleteIcon': {
                        color: themeColorDefinition.actions.main.default,
                    }
                },
                // @ts-ignore
                colorInfo: {
                    color: lightBlueColorBase,
                    backgroundColor: lightBlueColorLight,
                },
                colorWarning: {
                    color: yellowColorBase,
                    backgroundColor: yellowColorLight,
                },
                colorError: {
                    color: redColorErrorText,
                    backgroundColor: redColorErrorMain,
                },
                colorSuccess: {
                    color: greenColorBase,
                    backgroundColor: greenLightColorBase,
                },
                sizeSmall: {
                    fontSize: '.75rem !important',
                    padding: '0rem 0.5rem',
                    gap: '4px',
                    '& > .MuiChip-icon': {
                        fontSize: themeIconsSizeDefinition.sm,
                        height: themeIconsSizeDefinition.sm,
                        width: themeIconsSizeDefinition.sm
                    }
                },
                sizeMedium: {
                    padding: '0.75rem 1rem',
                },
                deletable: {
                    padding: '0.25rem 0.5rem',
                    backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary,
                    '&.Mui-disabled': {
                        color: themeColorDefinition.actions.main.textDisabled,
                        backgroundColor: themeColorDefinition.actions.main.disabled
                    },
                    '&:hover': {
                        backgroundColor: palettePrimary[AppConfigPaletteColorFields.Light]
                    },
                }
            },
            variants: [
                {
                    props: {variant: "outlined", color: "primary"},
                    style: {
                        backgroundColor: `${palettePrimary[AppConfigPaletteColorFields.ContrastText]} !important`,
                        color: `${palettePrimary[AppConfigPaletteColorFields.Main]} !important`
                    },
                },
                {
                    props: {variant: 'strong', color: 'warning'},
                    style: {
                        backgroundColor: themeColorDefinition.systemFeedback.warning.primary,
                        color: `${themeColorDefinition.systemFeedback.warning.primaryContrastText} !important`
                    }
                },
                {
                    props: {variant: 'strong', color: 'info'},
                    style: {
                        backgroundColor: themeColorDefinition.systemFeedback.accentNotifications.primary,
                        color: `${themeColorDefinition.systemFeedback.accentNotifications.primaryContrastText} !important`
                    }
                },
                {
                    props: {variant: 'status-solicitation'},
                    style: {
                        borderRadius: '8px !important',
                        padding: '8px 12px',
                        ...themeTypographyDefinition.button3
                    }
                },
                {
                    props: {variant: 'newStatus'},
                    style: {
                        borderRadius: '8px !important',
                        padding: '8px 12px',
                        backgroundColor: '#27B877',
                        color: 'white',
                        ...themeTypographyDefinition.button3,
                        '& > .MuiChip-label': {
                            paddingLeft: '0px',
                            paddingRight: '0px',
                        }
                    }
                }
            ]
        },

        MuiCheckbox: {
            styleOverrides: {
                root: {
                    padding: 0,
                    fontSize: '24px',
                    width: '24px',
                    height: '24px',
                    color: themeColorDefinition.actions.main.default,
                    '& > svg': {
                        fontSize: '16px',
                        '& path': {
                            stroke: 'currentColor',
                        }
                    },
                    '&:hover > svg': {
                        '& path': {
                            stroke: 'currentColor',
                        }
                    },

                    '&:hover > .icono-check-custom': {
                        boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}`
                    },
                    '&:focus > .icono-check-custom': {
                        boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary},0 0 0 4px ${themeColorDefinition.UIElements.borders.secondary}`
                    },

                    '&.Mui-disabled > .icono-check-custom': {
                        cursor: 'not-allowed',
                        backgroundColor: themeColorDefinition.actions.main.disabled,
                        boxShadow: `inset 0 0 0 2px ${themeColorDefinition.UIElements.borders.primary}`,
                    },

                    '&.Mui-disabled.Mui-checked > .icono-check-custom': {
                        outline: 'none',
                        boxShadow: 'none !important',
                        backgroundColor: `${themeColorDefinition.actions.main.disabled} !important`
                    },

                    '&.Mui-checked': {
                        '&:hover > .icono-check-custom': {
                            backgroundColor: themeColorDefinition.actions.main.hover,
                        },
                        '&:focus > .icono-check-custom': {
                            backgroundColor: themeColorDefinition.actions.main.focus,
                            outline: 'none',
                            boxShadow: `0 0 0 4px ${themeColorDefinition.UIElements.borders.secondary}`,
                        },
                        '&:focus-visible > .icono-check-custom': {
                            backgroundColor: themeColorDefinition.actions.main.focus,
                            outline: 'none',
                            boxShadow: `0 0 0 4px ${themeColorDefinition.UIElements.borders.secondary}`,
                        },
                    }
                },
                indeterminate: {
                    color: `${paletteSecondary[AppConfigPaletteColorFields.Light]} !important`
                }
            },
            variants: [
                {
                    props: {disabled: true},
                    style: {
                        pointerEvents: 'none',
                        '& > svg': {
                            color: '#c4c4c4',
                            '& path': {
                                color: '#c4c4c4',
                            }
                        },
                    }
                }
            ],

            defaultProps: {
                icon: <CheckIconCustom/>,
                checkedIcon: <CheckIconCustomChecked/>,
            }
        },

        MuiDialog: {
            styleOverrides: {
                paper: {
                    boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.08) !important',
                    padding: '24px',
                    //boxShadow: '0px 149px 60px rgba(148, 148, 148, 0.01), 0px 84px 50px rgba(148, 148, 148, 0.05), 0px 37px 37px rgba(148, 148, 148, 0.09), 0px 9px 21px rgba(148, 148, 148, 0.1) !important',
                    borderRadius: '32px !important'
                }
            }
        },

        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: 0
                }
            }
        },

        MuiDialogContent: {
            styleOverrides: {
                root: {
                    ...themeTypographyDefinition.label,
                    padding: '24px 0rem !important',
                },
            },
        },

        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    ...themeTypographyDefinition.label,
                    color: themeColorDefinition.UIElements.texts.default
                }
            }
        },

        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    ...themeTypographyDefinition.h4,
                    fontWeight: 500,
                    padding: 0
                },
            },
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: themeColorDefinition.UIElements.borders.tertiary,
                    borderColor: themeColorDefinition.UIElements.borders.tertiary,
                    borderWidth: '1px'
                },
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    maxWidth: '574px !important',
                    backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary
                }
            }
        },

        MuiFab: {
            variants: [
                {
                    props: {size: 'small'},
                    style: {
                        borderRadius: '0.425rem',
                        padding: 0,
                        height: '34px !important',
                        width: '34px !important',
                        /*'&:first-child > svg': {
                                        fontSize: '0.925rem !important',
                                    }*/
                    },
                },
            ],
        },

        MuiFormControl: {
            styleOverrides: {
                root: {
                    minHeight: '43px !important',
                    '& > .MuiInputBase-sizeSmall': {
                        minHeight: '43px !important',
                    },
                    '& > div > div': {
                        '&.Mui-disabled': {
                            '&.MuiSelect-multiple': {
                                color: `inherit !important`,
                                WebkitTextFillColor: `inherit !important`,
                            }
                        }
                    }
                }
            }
        },

        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    marginLeft: 0,

                    '&.Mui-disabled :hover': {
                        cursor: 'not-allowed',
                    },

                    '& .MuiRadio-root + .MuiFormControlLabel-label': {
                        ...themeTypographyDefinition.label,
                        color: themeColorDefinition.UIElements.texts.default,
                        marginLeft: '0.5rem !important',
                        marginTop: '0.15rem !important'
                    },

                    '& .MuiRadio-root.Mui-disabled + .MuiFormControlLabel-label': {
                        color: themeColorDefinition.actions.main.textDisabled
                    }
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        border: "none"
                    }
                },
                select: {
                    backgroundColor: 'transparent !important',
                    zIndex: 1,
                    fontSize: '1rem',
                    padding: '0.65rem 1rem 0.636rem 1rem !important',
                    minHeight: 'auto !important',
                },
                icon: {
                    color: themeColorDefinition.UIElements.texts.default,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '1rem',
                    border: '1px solid #BFBFBF',
                    '& fieldset': {
                        borderColor: 'transparent',
                    },
                    backgroundColor: themeColorDefinition.UIElements.backgrounds.primary,
                    '&:hover': {
                        backgroundColor: themeColorDefinition.UIElements.backgrounds.primary,
                    },
                    '&.Mui-focused': {
                        boxShadow: themeShadowDefinition.lg,
                        border: '1px solid #EDF2F7',
                        '& fieldset': {
                            borderWidth: '0px !important',
                            borderColor: 'transparent',
                        },
                    },
                    '&.Mui-error': {
                        border: `1px solid ${themeColorDefinition.systemFeedback.error.primary}`,
                    },
                    '&.Mui-disabled': {
                        backgroundColor: '#FAFAFA !important',
                        border: '1px solid #EDF2F7',
                    },
                },
                input: {
                    '&.Mui-disabled': {
                        WebkitTextFillColor: themeColorDefinition.UIElements.texts.lighter,
                    },
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    borderRadius: '1rem',
                    border: '1px solid #EDF2F7',
                    backgroundColor: themeColorDefinition.UIElements.backgrounds.primary,
                    '&:hover': {
                        backgroundColor: themeColorDefinition.UIElements.backgrounds.primary,
                    },
                    '&.Mui-focused': {
                        border: '1px solid #576171',
                        boxShadow: themeShadowDefinition.lg,
                    },
                    '&.Mui-error': {
                        border: `1px solid ${themeColorDefinition.systemFeedback.error.primary}`,
                    },
                    '&.Mui-disabled': {
                        backgroundColor: '#FAFAFA !important',
                        border: '1px solid #EDF2F7',
                    },
                },
                input: {
                    '&.Mui-disabled': {
                        WebkitTextFillColor: themeColorDefinition.UIElements.texts.lighter,
                    },
                },
                multiline: {
                    padding: '0.8rem 1rem !important'
                }
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    ...themeTypographyDefinition.button3,
                    fontWeight: 400,
                    backgroundColor: 'transparent !important',
                    '&:hover': {
                        color: `${themeColorDefinition.actions.main.text} !important`,
                        backgroundColor: `${themeColorDefinition.actions.main.hover} !important`,
                        '& > .MuiListItemIcon-root': {
                            color: `${themeColorDefinition.actions.main.text} !important`,
                        }
                    },
                    '&.Mui-selected': {
                        color: `${themeColorDefinition.actions.main.text} !important`,
                        backgroundColor: `${themeColorDefinition.actions.main.hover} !important`,
                    },
                },
            },
            variants: [
                {
                    props: {variant: "appbar"},
                    style: {
                        '&:hover': {
                            color: `${themeColorDefinition.UIElements.texts.main} !important`,
                            backgroundColor: 'transparent !important',
                        },
                    }
                },
                {
                    props: {color: 'error'},
                    style: {
                        color: `${themeColorDefinition.systemFeedback.error.strong} !important`,
                        '& > .MuiListItemIcon-root': {
                            color: `${themeColorDefinition.systemFeedback.error.strong} !important`,
                        }
                    }
                },
                {
                    props: {variant: 'bold'},
                    style: {
                        fontWeight: 600,
                        '& > .MuiListItemIcon-root': {
                            color: themeColorDefinition.UIElements.texts.main,
                            fontWeight: 600,
                        }
                    }
                }
            ]
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    height: 'fit-content',
                    width: 'fit-content',
                    justifyContent: 'center !important',
                    alignItems: 'center !important',
                    borderRadius: '100px !important',
                    color: '#5B6560',
                    '&:hover': {
                        color: '#232926',
                        backgroundColor: 'transparent',
                    },
                    '&.Mui-disabled': {
                        pointerEvents: 'visible',
                        //backgroundColor: buttonDisabledBackground,
                        '& > svg': {
                            color: `${buttonDisabledIcon} !important`,
                        },
                        '&:hover': {
                            cursor: 'not-allowed !important',
                            // backgroundColor: `${buttonDisabledBackground} !important`,
                        },
                    },
                },
                colorPrimary: {
                    color: `${palettePrimary[AppConfigPaletteColorFields.Main]} !important`,
                    backgroundColor: `transparent !important`,
                    '&:hover': {
                        color: "#309D6A !important",
                    },
                },
                colorSecondary: {
                    color: `#232926 !important`,
                    backgroundColor: `transparent !important`,
                    '&:hover': {
                        color: `#232926 !important`,
                        backgroundColor: `rgba(255, 255, 255, 0.5) !important`,
                    },
                    "&.Mui-disabled": {
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        opacity: 0.4
                    },
                    "&:active": {
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    },
                },
                sizeSmall: {
                    padding: '8px 16px !important',
                    ...themeTypographyDefinition.button3,
                    '& > svg:first-child': {
                        width: `${themeIconsSizeDefinition.sm} !important`,
                        height: `${themeIconsSizeDefinition.sm} !important`,
                        fontSize: `${themeIconsSizeDefinition.sm} !important`,
                    },
                },
                sizeMedium: {
                    padding: '12px 20px !important',
                    ...themeTypographyDefinition.button2,
                    '& > svg:first-child': {
                        width: `${themeIconsSizeDefinition.md} !important`,
                        height: `${themeIconsSizeDefinition.md} !important`,
                        fontSize: `${themeIconsSizeDefinition.md} !important`,
                    },
                },
                sizeLarge: {
                    padding: '16px 24px !important',
                    ...themeTypographyDefinition.button1,
                    '& > svg:first-child': {
                        width: `${themeIconsSizeDefinition.lg} !important`,
                        height: `${themeIconsSizeDefinition.lg} !important`,
                        fontSize: `${themeIconsSizeDefinition.lg} !important`,
                    },
                },
            },
            variants: [
                {
                    props: {color: 'secondary', variant: 'outlined'},
                    style: {
                        border: '1px solid #BFBFBF !important',
                    }
                },
                {
                    props: {variant: 'text'},
                    style: {
                        padding: '0px !important'
                    }
                },
                {
                    props: {color: 'primary', variant: 'contained'},
                    style: {
                        color: `${palettePrimary[AppConfigPaletteColorFields.ContrastText]} !important`,
                        backgroundColor: `${palettePrimary[AppConfigPaletteColorFields.Main]} !important`,
                        '&:hover': {
                            color: `${palettePrimary[AppConfigPaletteColorFields.ContrastText]} !important`,
                            backgroundColor: "#309D6A !important",
                            boxShadow: 'none',
                        },
                    }
                },
                {
                    props: {color: 'secondary', variant: 'contained'},
                    style: {
                        color: `#232926 !important`,
                        backgroundColor: `transparent !important`,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5) !important',
                            boxShadow: 'none',
                        },
                    }
                },
                {
                    props: {color: 'secondary', variant: 'outlined'},
                    style: {
                        backgroundColor: 'transparent',
                        border: '1px solid #BFBFBF',
                        color: '#232926 !important',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
                            boxShadow: 'none',
                        },
                    }
                },
                {
                    props: {variant: 'minPadding'},
                    style: {
                        padding: '0px !important'
                    }
                },
                {
                    props: {fullWidth: true},
                    style: {
                        width: '100%'
                    }
                }
            ],
        },

        MuiInputBase: {
            styleOverrides: {
                inputMultiline: {
                    fontSize: '1rem !important',
                    padding: '0px !important'
                }
            }
        },

        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    '& > button svg': {
                        fontStyle: 'light',
                        fontSize: '20px !important',
                        borderColor: greyColor300,
                    },
                },
            },
        },

        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: '26px',
                    backgroundColor: '#EEEEEE',
                    height: '10px',
                    '& > .MuiLinearProgress-bar': {
                        borderRadius: '19px',
                    }
                }
            }
        },

        MuiLink: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        cursor: 'pointer',
                    },
                },
            },
        },

        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: '1rem',
                    padding: '0.5rem 0rem',
                    boxShadow: '0px 3px 7px rgba(153, 153, 153, 0.1), 0px 3px 7px rgba(153, 153, 153, 0.1)'
                }
            },
        },

        MuiRadio: {
            styleOverrides: {
                root: {
                    width: '26px',
                    height: '26px',
                    '& input': {
                        width: '20px',
                        height: '20px',
                    },
                    '& .MuiSvgIcon-root': {
                        width: '20px',
                        height: '20px'
                    },
                    '&.Mui-checked:hover': {
                        '& > .MuiSvgIcon-root': {
                            '& > circle': {
                                stroke: themeColorDefinition.actions.alt.hover,
                                strokeWidth: '16px',
                                fill: themeColorDefinition.actions.main.default
                            }
                        }
                    },

                    '&:hover': {
                        '& > .MuiSvgIcon-root': {
                            '& > circle': {
                                stroke: themeColorDefinition.actions.alt.hover,
                                strokeWidth: '1px',
                                fill: themeColorDefinition.UIElements.backgrounds.primary
                            }
                        },
                    },

                    '&.Mui-disabled': {
                        '& > .MuiSvgIcon-root': {
                            '& > circle': {
                                stroke: themeColorDefinition.UIElements.borders.primary,
                                fill: themeColorDefinition.actions.main.disabled
                            }
                        },
                        '&.Mui-checked': {
                            '& > .MuiSvgIcon-root': {
                                '& > circle': {
                                    stroke: themeColorDefinition.actions.main.disabled,
                                    strokeWidth: '3px',
                                    fill: themeColorDefinition.actions.main.textDisabled
                                }
                            }
                        }
                    }
                },

                disabled: {
                    cursor: 'not-allowed',
                    '& input': {
                        cursor: 'not-allowed',
                    },
                    '& .MuiSvgIcon-root': {
                        cursor: 'not-allowed',
                    }
                },

                sizeSmall: {
                    width: '16px',
                    height: '16px',
                    '& input': {
                        width: '16px',
                        height: '16px',
                    },
                    '& .MuiSvgIcon-root': {
                        width: '14px',
                        height: '14px'
                    }
                }
            },

            defaultProps: {
                icon: (
                    <SvgIcon sx={{borderRadius: "100%"}} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="#C2C2C2" strokeWidth="1.5"/>
                    </SvgIcon>
                ),
                checkedIcon: (
                    <SvgIcon sx={{borderRadius: "100%"}} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="#C2C2C2" strokeWidth="1.5"/>

                        <circle cx="12" cy="12" r="6" fill="#008547"/>
                    </SvgIcon>
                ),
            },
        },

        MuiStepConnector: {
            styleOverrides: {
                lineVertical: {
                    height: '20px',
                    marginLeft: '9px',
                    borderLeft: `1px dashed ${greyColor400} !important`,
                },
                lineHorizontal: {
                    height: '9px',
                    marginRight: '1.5rem',
                    borderTop: `none !important`,
                    borderBottom: `1px dashed ${greyColor400} !important`,
                },
            },
        },

        MuiStepLabel: {
            defaultProps: {
                StepIconComponent: StepIconCustom,
            },
            styleOverrides: {
                label: {
                    ...themeTypographyDefinition.body2,
                    color: themeColorDefinition.UIElements.texts.lighter,
                    opacity: 1,
                    '&.Mui-active': {
                        ...themeTypographyDefinition.button2,
                        color: themeColorDefinition.UIElements.texts.main,
                    },
                    '&.Mui-completed': {
                        fontWeight: '400 !important',
                        color: themeColorDefinition.UIElements.texts.main,
                    },
                },
            },
        },

        MuiSwitch: {
            styleOverrides: {
                root: {
                    padding: 0,
                    width: 64,
                    height: 32,
                    '& .MuiSwitch-switchBase': {
                        transform: 'translateX(2px)',
                        padding: 0,
                        margin: 2,
                        transitionDuration: '300ms',
                        color: themeColorDefinition.actions.main.default,
                        '&.Mui-checked': {
                            transform: 'translateX(34px)',
                            color: themeColorDefinition.actions.main.text,
                            '& + .MuiSwitch-track': {
                                backgroundColor: themeColorDefinition.actions.main.default,
                                opacity: 1,
                                border: 0,
                            },
                            '&.Mui-disabled + .MuiSwitch-track': {
                                backgroundColor: themeColorDefinition.actions.main.disabled,
                            },
                        },
                        '&.Mui-focusVisible .MuiSwitch-thumb': {
                            color: themeColorDefinition.actions.main.default,
                            border: '6px solid #fff',
                        },
                        '&.Mui-disabled .MuiSwitch-thumb': {
                            color: themeColorDefinition.actions.main.textDisabled,
                        },
                        '&.Mui-disabled + .MuiSwitch-track': {
                            backgroundColor: themeColorDefinition.actions.main.disabled,
                            opacity: 1,
                            border: 0,
                            '&:hover': {
                                cursor: 'not-allowed'
                            },
                        },
                    },
                    '& .MuiSwitch-thumb': {
                        boxSizing: 'border-box',
                        marginTop: 2,
                        width: 24,
                        height: 24,
                    },
                    '& .MuiSwitch-track': {
                        borderRadius: '100px',
                        border: `1px solid ${themeColorDefinition.UIElements.borders.primary}`,
                        backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary,
                        opacity: 1,
                    },
                },

                sizeSmall: {
                    padding: 0,
                    width: 40,
                    height: 24,
                    '& .MuiSwitch-switchBase': {
                        transform: 'translateX(2px)',
                        '&.Mui-checked': {
                            transform: 'translateX(18px)',
                        },
                    },
                    '& .MuiSwitch-thumb': {
                        boxSizing: 'border-box',
                        marginTop: 2,
                        width: 16,
                        height: 16,
                    },
                },
            },
        },

        MuiTable: {
            variants: [
                {
                    props: {variant: 'basic-style'},
                    style: {
                        [`& .${tableCellClasses.root}:not(.${tableCellClasses.head}):not(.${tableCellClasses.footer})`]:
                            {
                                ...themeTypographyDefinition.caption,
                                padding: '16px !important',
                                borderWidth: '0px 1px 1px 0px',
                                borderStyle: 'solid',
                                borderColor: themeColorDefinition.UIElements.borders.secondary,
                                color: themeColorDefinition.UIElements.texts.default,
                                textAlign: 'center',
                                alignItems: 'start',
                                fontWeight: 500,
                                justifyContent: 'start',
                                '& > div': {
                                    justifyContent: 'start',
                                },
                            },

                        [`& .${tableCellClasses.head}`]: {
                            ...themeTypographyDefinition.caption,
                            backgroundColor: themeColorDefinition.UIElements.backgrounds.tertiary,
                            fontWeight: 500,
                            color: themeColorDefinition.UIElements.texts.default,
                            textTransform: 'none',
                            padding: '16px !important',
                            borderWidth: '0px 1px 1px 0px',
                            borderStyle: 'solid',
                            borderColor: themeColorDefinition.UIElements.borders.secondary,
                            textAlign: 'left'
                        },
                        [`& .${tableCellClasses.footer}`]: {
                            borderTop: `1px solid grey.200`,
                        },
                    }
                },
                {
                    props: {variant: 'basic-style-without-boderY'},
                    style: {
                        [`& .${tableCellClasses.root}:not(.${tableCellClasses.head}):not(.${tableCellClasses.footer})`]:
                            {
                                borderWidth: '0px 0px 1px 0px',
                            },
                    }
                },
                {
                    props: {variant: 'interleaving-style'},
                    style: {
                        '& > tr': {
                            '&:nth-of-type(odd)': {
                                borderRadius: '1rem',
                                backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary,
                            },
                            '& > td': {
                                borderBottom: 'none !important',
                                fontSize: '1rem',
                                fontWeight: 500,

                                '&:first-of-type': {
                                    borderTopLeftRadius: '1rem',
                                    borderBottomLeftRadius: '1rem',
                                    fontWeight: 400
                                },
                                '&:last-of-type': {
                                    borderTopRightRadius: '1rem',
                                    borderBottomRightRadius: '1rem',
                                },
                                '& > *': {
                                    textAlign: 'inherit'
                                },
                                '& > p': {
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                }
                            }
                        }
                    }
                },
                {
                    props: {variant: 'bureauStyle'},
                    style: {
                        [`& .${tableCellClasses.head}`]: {
                            ...themeTypographyDefinition.body3,
                            backgroundColor: themeColorDefinition.UIElements.backgrounds.disabled,
                            padding: '12px !important',
                            color: '#5B6560 !important',
                            '& > span': {
                                color: '#5B6560 !important',
                            },
                            '&:first-of-type': {
                                borderTopLeftRadius: '12px',
                                borderBottomLeftRadius: '12px',
                            },
                            '&:last-of-type': {
                                borderTopRightRadius: '12px',
                                borderBottomRightRadius: '12px',
                            },
                        },
                        [`& .${tableCellClasses.root}:not(.${tableCellClasses.head}):not(.${tableCellClasses.footer})`]: {
                            ...themeTypographyDefinition.body3,
                            fontWeight: '600 !important',
                            padding: '12px !important',
                            border: 'none',
                            alignItems: 'start',
                            color: '#5B6560 !important',
                        },
                        [`& .${tableCellClasses.footer}`]: {
                            ...themeTypographyDefinition.body3,
                            color: themeColorDefinition.UIElements.texts.main,
                            backgroundColor: themeColorDefinition.UIElements.backgrounds.disabled,
                            textAlign: 'left',
                            '&:first-of-type': {
                                borderTopLeftRadius: '12px',
                                borderBottomLeftRadius: '12px',
                            },
                            '&:last-of-type': {
                                borderTopRightRadius: '12px',
                                borderBottomRightRadius: '12px',
                            },
                        },
                    }
                },
                {
                    props: {variant: 'bureauGroupsStyle'},
                    style: {
                        [`& .${tableCellClasses.head}`]: {
                            ...themeTypographyDefinition.body3,
                            backgroundColor: themeColorDefinition.UIElements.backgrounds.disabled,
                            padding: '12px !important',
                            color: '#5B6560 !important',
                            '& > span': {
                                color: '#5B6560 !important',
                            },
                            borderTop: `1px solid ${themeColorDefinition.UIElements.borders.tertiary}`,
                            borderLeft: `1px solid ${themeColorDefinition.UIElements.borders.tertiary}`,
                            borderBottom: 'none',
                            borderRight: 'none',
                            '&:last-of-type': {
                                borderRight: `1px solid ${themeColorDefinition.UIElements.borders.tertiary}`,
                            },
                            /*'&:first-of-type': {
                              borderTopLeftRadius: '12px',
                              borderBottomLeftRadius: '12px',
                            },
                            '&:last-of-type': {
                              borderTopRightRadius: '12px',
                              borderBottomRightRadius: '12px',
                            },*/
                        },
                        [`& .${tableCellClasses.root}:not(.${tableCellClasses.head}):not(.${tableCellClasses.footer})`]: {
                            ...themeTypographyDefinition.body3,
                            fontWeight: '600 !important',
                            padding: '12px !important',
                            alignItems: 'start',
                            color: '#5B6560 !important',
                            borderTop: `1px solid ${themeColorDefinition.UIElements.borders.tertiary}`,
                            borderLeft: `1px solid ${themeColorDefinition.UIElements.borders.tertiary}`,
                            borderBottom: 'none',
                            borderRight: 'none',
                            '&:last-of-type': {
                                borderRight: `1px solid ${themeColorDefinition.UIElements.borders.tertiary}`,
                            },
                        },
                        [`& .${tableCellClasses.footer}`]: {
                            ...themeTypographyDefinition.body3,
                            color: themeColorDefinition.UIElements.texts.main,
                            backgroundColor: themeColorDefinition.UIElements.backgrounds.disabled,
                            textAlign: 'left',
                        },
                    }
                }
            ]
        },

        /*MuiTableRow: {
          styleOverrides: {
            root: {
              '& th:first-child': {
                textAlign: 'left !important',
              },
              '& td:first-child': {
                textAlign: 'left',
                paddingLeft: '10px !important',
              },
            },
          },
        },*/

        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: '0.785rem',
                    fontWeight: 600,
                    backgroundColor: 'transparent',
                    borderBottom: `1px dashed ${greyColor200}`,
                    textAlign: 'right',
                    '& p': {
                        fontWeight: 600,
                        fontSize: '0.785rem',
                    },
                },
                head: {
                    color: greyColor400,
                    textTransform: 'uppercase',
                    padding: '0.7rem 0rem !important',
                },
                body: {
                    color: greyColor900,
                    fontSize: '.95rem',
                    padding: '0.2rem 0.1rem !important',
                },
            },
            variants: [
                {props: {align: 'left'}, style: {textAlign: 'left'}},
                {props: {align: 'center'}, style: {textAlign: 'center'}},
                {props: {align: 'right'}, style: {textAlign: 'right'}}
            ]
        },

        MuiContainer: {
            styleOverrides: {
                root: {
                    [`@media (min-width:${themeBreakpointsValuesDefinition.xs}px)`]: {
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        maxWidth: '100%',
                    },
                    [`@media (min-width:${themeBreakpointsValuesDefinition.sm}px)`]: {
                        paddingLeft: '32px',
                        paddingRight: '32px',
                        maxWidth: '100%',
                    },
                    [`@media (min-width:${themeBreakpointsValuesDefinition.md}px)`]: {
                        maxWidth: '1080px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingLeft: '0px',
                        paddingRight: '0px'
                    },
                    [`@media (min-width:${themeBreakpointsValuesDefinition.ml}px)`]: {
                        maxWidth: '1240px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingLeft: '0px',
                        paddingRight: '0px'
                    },
                    [`@media (min-width:${themeBreakpointsValuesDefinition.lg}px)`]: {
                        maxWidth: '1366px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingLeft: '0px',
                        paddingRight: '0px'
                    },
                }
            }
        },

        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        backgroundColor: '#f5f7fa',
                        padding: '0px 12px',
                        '& fieldset': {
                            borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                            borderColor: '#ccc',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#aaa',
                        },
                    },
                    '& .MuiAutocomplete-input': {
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#333',
                    },
                    '& .MuiAutocomplete-endAdornment': {
                        color: '#333',
                    },
                }
            }
        },

        MuiTabs: {
            styleOverrides: {
                scroller: {
                    height: 'fit-content !important'
                }
            }
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize: '1rem',
                    fontFamily: 'Geist',
                    fontWeight: 400,
                    lineHeight: '140%',
                    letterSpacing: 0,
                    padding: '16px 0',

                    textTransform: 'none',
                    transition: 'color .2s ease',
                    margin: '0 1rem',
                    //borderBottom: `2px solid transparent`,
                    height: 'auto', // 'fit-content',
                    minHeight: 'auto',
                    maxWidth: 'fit-content !important'
                },
                iconWrapper: {
                    display: 'grid',
                    alignSelf: 'center',
                    marginRight: '6px',
                    '& > svg': {
                        height: themeIconsSizeDefinition.sm,
                        width: themeIconsSizeDefinition.sm
                    }
                },
                textColorPrimary: {
                    //marginTop: '0.22rem',
                    color: themeColorDefinition.UIElements.texts.lighter,
                    borderTopRightRadius: '1rem',
                    borderTopLeftRadius: '1rem',
                    //paddingLeft: '0.4rem',
                    //paddingRight: '0.4rem',
                    '&:hover': {
                        color: palettePrimary[AppConfigPaletteColorFields.Main],
                        boxShadow: `inset 0 -1px 0 0 ${palettePrimary[AppConfigPaletteColorFields.Main]}`,
                    },
                    '&.Mui-selected': {
                        fontWeight: 600,
                    },
                },
                textColorInherit: {
                    color: greyColor500,
                    opacity: 1,
                    '&:hover': {
                        borderBottom: `2px solid ${blueColorBase}`,
                    },
                },
            },
        },

        MuiTextField: {
            styleOverrides: {
                root: {
                    WebkitTextFillColor: `${themeColorDefinition.UIElements.texts.main} !important`,
                    '& input:-webkit-autofill': {
                        borderRadius: '0.875rem',
                        fontWeight: 400,
                        backgroundColor: 'transparent',
                        border: 'none',
                        WebkitTextFillColor: themeColorDefinition.UIElements.texts.default
                    },
                    '& input:-moz-autofill': {
                        borderRadius: '0.875rem',
                        fontWeight: 400,
                        backgroundColor: 'transparent',
                        border: 'none',
                        WebkitTextFillColor: themeColorDefinition.UIElements.texts.default
                    },
                    '& input[type=number]': {
                        '-moz-appearance': 'textfield'
                    },
                    '& input[type=number]::-webkit-outer-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0
                    },
                    '& input[type=number]::-webkit-inner-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0
                    },
                    '& label': {
                        ...themeTypographyDefinition.label,
                        color: greyColor400
                    },
                    '& label.Mui-focused': {
                        color: greyColor400
                    },
                    '& label.Mui-error': {
                        color: `${themeColorDefinition.systemFeedback.error.primary} !important`
                    },
                    '& label.MuiInputLabel-shrink': {
                        ...themeTypographyDefinition.caption,
                        color: greyColor400,
                    },
                    '& .MuiFilledInput-root': {
                        borderRadius: '0.875rem',
                        border: '1px solid #BFBFBF',
                        backgroundColor: themeColorDefinition.UIElements.backgrounds.primary,
                        ...themeTypographyDefinition.textForms,
                        '&:hover': {
                            backgroundColor: themeColorDefinition.UIElements.backgrounds.primary,
                        },
                        '&.Mui-focused': {
                            border: '1px solid #5D5D5D',
                            ...themeShadowDefinition[400],
                        },
                        '&.Mui-error': {
                            border: `1px solid ${themeColorDefinition.systemFeedback.error.primary}`,
                        },
                        '&.Mui-disabled :not(.adornment-not-disabled):hover': {
                            cursor: 'not-allowed',
                        },
                        '&.Mui-disabled': { // 
                            backgroundColor: `${themeColorDefinition.UIElements.backgrounds.disabled} !important`,
                            border: 'none !important',
                        },
                        "&::before": {
                            borderBottom: "none !important",
                        },
                        "&::after": {
                            borderBottom: "none !important",
                        },
                    },
                    '& .MuiFilledInput-input': {
                        padding: '0.625rem 1rem', // 10px 16px
                        '&.Mui-disabled': {
                            fontWeight: 400,
                            WebkitTextFillColor: themeColorDefinition.UIElements.texts.disabled
                        },
                    }
                },
            }
        },

        MuiToggleButtonGroup: {
            variants: [
                {
                    props: { variant: 'approval'},
                    style: {
                        border: `1px solid ${themeColorDefinition.UIElements.borders.primary}`,
                        borderRadius: '12px',
                        padding: '10px!important',
                        '& .MuiToggleButtonGroup-grouped': {
                            border: 0,
                            gap: '12px !important',
                            padding: '16px 20px!important',
                            borderRadius: '12px !important', 
                            textTransform: 'none',
                            '& > p': {
                                ...themeTypographyDefinition.button2,
                                color: `${themeColorDefinition.UIElements.texts.main} !important`,
                            },
                            '& > svg': {
                                fontSize: themeIconsSizeDefinition.md,
                                height: themeIconsSizeDefinition.md,
                                width: themeIconsSizeDefinition.md,
                                stroke: `${themeColorDefinition.UIElements.texts.main} !important`,
                            }
                        },
                        '& > .MuiToggleButton-success.Mui-selected': {
                            backgroundColor: `#CFF2E2 !important`,
                            '& > svg': {
                                stroke: `${themeColorDefinition.systemFeedback.success.strong} !important`,
                            }
                        },
                        '& > .Mui-error.Mui-selected': {
                            backgroundColor: `${themeColorDefinition.systemFeedback.error.secondary} !important`,
                            '& > svg': {
                                stroke: `${themeColorDefinition.systemFeedback.error.primary} !important`,
                            }
                        }
                    },
                }
            ]
        },
        
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    padding: '0.4rem 0.6rem !important',
                },
            },
            variants: [
                {
                    props: {selected: false},
                    style: {
                        '& *': {
                            color: 'rgba(0, 0, 0, 0.54) !important'
                        }
                    }
                },
                {
                    props: {color: 'success', selected: true},
                    style: {
                        '& *': {
                            color: `${themeColorDefinition.systemFeedback.success.primary} !important`
                        }
                    }
                },
                {
                    props: {color: 'error', selected: true},
                    style: {
                        '& *': {
                            color: `${themeColorDefinition.systemFeedback.error.primary} !important`
                        }
                    }
                }
            ]
        },

        MuiTooltip: {
            styleOverrides: {
                arrow: {
                    ...themeTypographyDefinition.label,
                    fontWeight: 300,
                    color: 'rgba(0,0,0, 0.6) !important',
                },
                tooltip: {
                    fontFamily: 'Geist',
                    fontSize: '0.75rem', // 12px,
                    lineHeight: '1rem',
                    fontWeight: 400,
                    borderRadius: '0.5rem', // 8px
                    backgroundColor: 'rgba(0,0,0, 0.6) !important', //'white',
                    color: 'white',
                    padding: '0.75rem',
                    textAlign: 'center',
                    boxShadow: '0px 8px 16px -2px rgba(27, 33, 44, 0.12)'
                },
            },
            defaultProps: {
                arrow: true,
                // followCursor: true
            }
        },

        MuiTypography: {
            styleOverrides: {
                root: {
                    color: 'inherit'
                },
            },
            variants: [
                {
                    props: {color: 'dark'},
                    style: {
                        color: greyColor900,
                    },
                },
                {
                    props: {variant: 'cardHeader'},
                    style: {
                        ...themeTypographyDefinition.h5,
                        lineHeight: '110%',
                        letterSpacing: 0,
                        marginTop: 0,
                        flexWrap: 'wrap'
                    }
                }
            ],
        },
    },
});

interface ThemeItaptecProps {
    children?: ReactNode;
}

export function ThemeItaptecUX(props: ThemeItaptecProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {props.children}
        </ThemeProvider>
    );
}
