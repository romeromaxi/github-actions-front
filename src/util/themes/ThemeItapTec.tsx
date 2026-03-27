import React, { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  themeBreakpointsValuesDefinition,
  themeColorDefinition,
  themeShadowDefinition,
  themeTypographyDefinition
} from "./definitions";
import {
  AppConfigFields,
  AppConfigPaletteColor,
  AppConfigPaletteColorFields,
  AppConfigPaletteFields
} from "../../types/appConfigEntities";

export const backgroundColorBase: string = '#F6F6F6';

const palettePrimary : AppConfigPaletteColor =
  window.APP_CONFIG[AppConfigFields.Palette][AppConfigPaletteFields.Primary];

const paletteSecondary : AppConfigPaletteColor =
  window.APP_CONFIG[AppConfigFields.Palette][AppConfigPaletteFields.Secondary];

const primaryColor: string = palettePrimary[AppConfigPaletteColorFields.Main];

export const blueColorBase: string = primaryColor;
export const lightBlueColorBase: string = '#009EF7';
export const lightBlueColorLight: string = '#F1FAFF';

export const greenColorBase: string = '#04C8C8';
export const greenLightColorBase: string = '#DCFDFD';

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

const theme = createTheme({
  palette: {
    text: {
      disabled: greyColorDisabled,
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
    success: {
      light: greenLightColorBase,
      main: greenColorBase,
      contrastText: whiteColor,
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

  typography: {
    htmlFontSize: 20,
    fontFamily: ['Yantramanav'].join(','),

    h1: {
      fontSize: 'calc(1.3rem + .6vw)',
      lineHeight: 1.2,
      marginTop: 0,
    },
    h2: {
      fontSize: 'calc(1.275rem + .3vw)',
      lineHeight: 1.2,
      marginTop: 0,
    },
    h3: {
      fontSize: 'calc(1.26rem + .12vw)',
    },
    caption: {
      fontSize: '16px'
    }
  },

  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
        standardSuccess: {
          color: '#1E4620 !important',
          backgroundColor: '#EDF7ED !important',
          '& > div svg': {
            color: '#4CAF50 !important',
          },
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none !important',
          borderRadius: '1px !important',
          border: '1px solid #EDEDED',
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
          '& h4': {
            fontFamily: 'Yantramanav !important',
            fontSize: '1.125rem !important',
            fontWeight: '500 !important',
            textAlign: 'center',
            padding: '8px 10px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.625rem',
          justifyContent: 'center',
          alignItems: 'center',
          textTransform: 'none',
          lineHeight: 1.5,
        },
/*        containedPrimary: {
          '&:hover': {
            backgroundColor: greenColorBase,
            boxShadow: 'none',
          },
        },
        outlinedPrimary: {
          backgroundColor: greenLightColorBase,
          border: 'none',
          '&:hover': {
            color: 'white',
            border: 'none',
            backgroundColor: primaryColor,
            boxShadow: 'none',
          },
        },
        containedInherit: {
          boxShadow:
              'inset 0 1px 0 rgba(255, 255, 255, 0.15),0 1px 1px rgba(0, 0, 0, 0.075)',
          color: greyColor600,
          backgroundColor: greyColor100,
          height: 'fit-content',
          '&:hover': {
            backgroundColor: greyColor200,
            boxShadow: 'none',
          },
        },*/
        sizeMedium: {
          padding: '0.825rem 1.75rem',
          fontSize: '1.195rem',
          '& > span': {
            marginTop: '-2px !important',
            '& > svg': {
              fontSize: '1.2rem !important',
            },
          },
        },
        sizeSmall: {
          padding: 'calc(.55rem + 1px) calc(1.25rem + 1px) !important',
          fontSize: '0.975rem',
          letterSpacing: '0.3px',
          '& > span': {
            marginTop: '-1px !important',
            '& > svg': {
              fontSize: '1.2rem !important',
            },
          },
        },
      },

      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            '&:hover': {
              backgroundColor: "#01471E", //palettePrimary[AppConfigPaletteColorFields.Light],
              boxShadow: 'none',
            },
          },
        },
        {
          props: { variant: "outlined", color: "primary" },
          style: {
            backgroundColor: palettePrimary[AppConfigPaletteColorFields.ContrastText],
            border: 'none',
            boxShadow: `inset 0 0 0 2px ${palettePrimary[AppConfigPaletteColorFields.Main]}`,
            '&:hover': {
              border: 'none',
              boxShadow: `inset 0 0 0 2px ${palettePrimary[AppConfigPaletteColorFields.Main]}`,
              color: palettePrimary[AppConfigPaletteColorFields.ContrastText],
              backgroundColor: palettePrimary[AppConfigPaletteColorFields.Main],
            },
          },
        },
        {
          props: { variant: "contained", color: "inherit" },
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
          props: { variant: "contained", color: "secondary" },
          style: {
            backgroundColor: paletteSecondary[AppConfigPaletteColorFields.Main],
            boxShadow: 'none',
            '&:hover': {
              color: palettePrimary[AppConfigPaletteColorFields.ContrastText],
              backgroundColor: palettePrimary[AppConfigPaletteColorFields.Main],
              boxShadow: 'none',
            },
          },
        },
      ]
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: 0,
          boxShadow: '0px 10px 35px 0px rgb(56 71 109 / 8%)',
          backgroundColor: 'white',
          borderRadius: '32px !important',
        },
      },
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
          padding: '1.25rem 2.25rem 0 2.25rem',
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: {
          /*backgroundColor: 'transparent',*/
          padding: '0.6rem 2.25rem 0.6rem 2.25rem',
          marginBottom: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          flexWrap: 'wrap',
          minHeight: '30px',
          borderBottom: `1px solid ${greyColor200}`,
        },
        title: {
          fontSize: 'calc(1.26rem + .12vw)',
          paddingTop: '0.5rem',
          fontWeight: 600,
          color: greyColor900,
          lineHeight: 1.2,
          marginTop: 0,
        },
        subheader: {
          fontSize: '1rem',
          fontWeight: 500,
          color: greyColorDisabled,
        },
        action: {
          alignSelf: 'center'
        }
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '.95rem !important',
          fontWeight: 600,
          borderRadius: '0.425rem',
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
          fontSize: '.85rem !important',
          padding: '0.325rem 0.5rem',
        },
        sizeMedium: {
          padding: '0.75rem 1rem',
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '1.75rem 2.5rem !important',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '1.5rem',
          borderBottom: `1px solid ${greyColor200}`,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.95rem',
          color: greyColor400,
        },
      },
    },

    MuiFab: {
      variants: [
        {
          props: { size: 'small' },
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

    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          '&.Mui-disabled :hover': {
            cursor: 'not-allowed',
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: greyColorDisabled,
          '&:hover': {
            color: greenColorBase,
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
          color: `${palettePrimary[AppConfigPaletteColorFields.ContrastText]} !important`,
          backgroundColor: `${palettePrimary[AppConfigPaletteColorFields.Main]} !important`,
          // backgroundColor: greyColor100,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          borderRadius: 1,
          '&:hover': {
            color: primaryColor,
            backgroundColor: greenLightColorBase,
          },
        },
        colorSecondary: {
          color: `${paletteSecondary[AppConfigPaletteColorFields.ContrastText]} !important`,
          backgroundColor: `${paletteSecondary[AppConfigPaletteColorFields.Main]} !important`,
          '&:hover': {
            color: `${palettePrimary[AppConfigPaletteColorFields.ContrastText]} !important`,
            backgroundColor:`${palettePrimary[AppConfigPaletteColorFields.Main]} !important`,
          },
        },
        sizeSmall: {
          height: '25px',
          width: '25px',
          lineHeight: 1,
          borderRadius: '0.425rem',
          '& svg': {
            fontSize: '0.925rem',
          },
        },
      },
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

    MuiLink: {
      styleOverrides: {
        root: {
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            '& span': {
              color: primaryColor,
            },
            '& .MuiListItemIcon-root': {
              color: primaryColor,
            },
            '& .MuiListItemText-root': {
              '& span': {
                color: primaryColor,
              },
            },
            backgroundColor: 'transparent',
          },
          '& span': {
            color: greyColor600,
          },
          '& .MuiListItemIcon-root': {
            color: greyColor600,
            height: '1.5rem',
            width: '1.5rem',
          },
          '& .MuiListItemText-root': {
            '& span': {
              color: greyColor600,
              fontWeight: '500 !important',
              fontSize: '1.15rem',
            },
            backgroundColor: 'transparent !important',
          },
          '&.Mui-selected': {
            backgroundColor: 'transparent !important',
            '& span': {
              color: primaryColor,
            },
            '& .MuiListItemText-root': {
              '& span': {
                color: primaryColor,
              },
              backgroundColor: 'transparent !important',
            },
            '& .MuiListItemIcon-root': {
              color: primaryColor,
            },
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: 'transparent !important',
          zIndex: 1,
          fontSize: '1rem',
          padding: '20px 14px 8px',
        },
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
      styleOverrides: {
        label: {
          fontSize: '1.25rem',
          fontWeight: '600 !important',
          color: greyColor800,
          opacity: 1,
          '&.Mui-active': {
            color: greyColor600,
          },
          '&.Mui-completed': {
            color: greyColorDisabled,
          },
        },
      },
    },

    MuiTableRow: {
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
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.95rem',
          fontWeight: 600,
          backgroundColor: 'transparent',
          borderBottom: `1px dashed ${greyColor200}`,
          textAlign: 'right',
          '& p': {
            fontWeight: 600,
            fontSize: '0.95rem',
          },
        },
        head: {
          color: greyColor400,
          textTransform: 'uppercase',
          padding: '0.7rem 0rem !important',
        },
        body: {
          color: greyColor900,
          fontSize: '1.075rem',
          padding: '0.2rem 0.1rem !important',
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '1.15rem',
          textTransform: 'none',
          transition: 'color .2s ease',
          margin: '0 1rem',
          borderBottom: `2px solid transparent`,
        },
        textColorPrimary: {
          marginTop: '0.22rem',
          color: primaryColor,
          borderTopRightRadius: '1rem',
          borderTopLeftRadius: '1rem',
          paddingLeft: '0.4rem',
          paddingRight: '0.4rem',
          '&:hover': {
            borderBottom: `2px solid ${primaryColor}`,
            backgroundColor: lightBlueColorLight,
          },
          '&.Mui-selected': {
            backgroundColor: lightBlueColorLight,
            // #04C8C8
          },
        },
        textColorInherit: {
          color: greyColor500,
          opacity: 1,
          '&:hover': {
            borderBottom: `2px solid ${primaryColor}`,
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& input:-webkit-autofill': {
            borderRadius: '1rem',
            fontWeight: 400,
            backgroundColor: 'transparent',
            border: '1px solid #EDF2F7',
            WebkitTextFillColor: themeColorDefinition.UIElements.texts.default
          },
          '& input:-moz-autofill': {
            borderRadius: '1rem',
            fontWeight: 400,
            backgroundColor: 'transparent',
            border: '1px solid #EDF2F7',
            WebkitTextFillColor: themeColorDefinition.UIElements.texts.default
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
            marginTop: '5px !important'
          },
          '& .MuiFilledInput-root': {
            borderRadius: '1rem',
            backgroundColor: 'transparent',
            border: '1px solid #EDF2F7',
            fontWeight: 400,
            // padding: '12px',
            ...themeTypographyDefinition.label,
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&.Mui-focused': {
              backgroundColor: 'transparent',
              border: '1px solid #576171',
              ...themeShadowDefinition.lg,
            },
            '&.Mui-error': {
              border: `1px solid ${themeColorDefinition.systemFeedback.error.primary}`,
            },
            '&.Mui-disabled :not(.adornment-not-disabled):hover': {
              cursor: 'not-allowed',
            },
            '&.Mui-disabled': { // 
              backgroundColor: '#FAFAFA !important',
              border: '1px solid #EDF2F7',
            },
          },
          '& .MuiFilledInput-input': {
            '&.Mui-disabled': {
              fontWeight: 400,
              WebkitTextFillColor: themeColorDefinition.UIElements.texts.lighter
            },
          }
        },
      }
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          padding: '0.4rem 0.6rem !important',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: 'white',
          fontSize: '1.1rem',
        },
        tooltip: {
          fontSize: '1.1rem',
        },
        tooltipArrow: {
          fontSize: '1.1rem',
          fontFamily: 'Yantramanav',
          fontStyle: 'light',
          backgroundColor: 'white',
          color: 'black',
          padding: '12px 25px',
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Yantramanav',
        },
      },
      variants: [
        {
          props: { color: 'dark' },
          style: {
            color: greyColor900,
          },
        },
      ],
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
            maxWidth: '1300px',
            marginLeft: 'auto',
            marginRight: 'auto',
          },
          [`@media (min-width:${themeBreakpointsValuesDefinition.lg}px)`]: {
            maxWidth: '1600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          },
        }
      }
    },

  },
});

interface ThemeItaptecProps {
  children?: ReactNode;
}

export function ThemeItaptec(props: ThemeItaptecProps) {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
  );
}
