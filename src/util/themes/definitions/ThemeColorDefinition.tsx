import {AppConfigFields, AppConfigPaletteColorFields, AppConfigPaletteFields} from "../../../types/appConfigEntities";

const themeColorDefinition = {
    UIElements: {
        // Used in main backgrounds
        texts: {
            main: '#232926',
            disabled: '#69716D',
          
            default: '#2D3748',
            darker: '#171923',
            lighter: '#69716D',
            tertiary: '#C2C2C2'
        },
        // Used in alternative backgrouds 
        altTexts: {
            main: '#FFFFFF',
            default: '#FFFFFF',
            lighter: '#ADADAD'
        },
        // The main backgrounds used in the product
        backgrounds: {
            primary: '#FFFFFF',
            secondary: '#F7FAFC',
            tertiary: '#FAFAFA',
            disabled: '#F6F6F6',
            brandSubtle: '#D8F3E6',
        },
        // Backgrounds used in alternative color sectinos of your product
        altBackgrounds: {
            primary: '#35394E',
            secondary: '#1D202D'
        },
        // Used in main backgrounds
        borders: {
            primary: '#BFBFBF',
            secondary: '#EDF2F7',
            tertiary: '#ECECEC'
        },
        // Used in alternative backgrouds 
        altBorders: {
            primary: '#484D67',
            secondary: '#585E7D'
        }
    },
    systemFeedback: {
        success: {
            primary: '#27B877',
            primaryContrastText: '#FFFFFF',
            secondary: '#E9F8F1',
            secondaryContraxtText: '#67C076',
            strong: '#008547',
            tertiary: '#E7FDEF'
        },
        error: {
            primary: '#D92619',
            primaryContrastText: '#FFFFFF', 
            secondary: '#F5D6D4',         
            secondaryContrastText: '#5B0600',
            strong: '#5B0600',        
            tertiary: '#FCEEF1'
        },
        warning: {
            primary: '#E98400',     
            primaryContrastText: '#FFFFFF',
            secondary: '#FAEDCB',        
            secondaryContrastText: '#634700',
            strong: '#C14A00', // o '#634700'            
            tertiary: '#FFF3E5'
        },
        info: {
            primary: '#6194F5',
            primaryContrastText: '#FFFFFF',
            secondary: '#CBDDFF',
            secondaryContraxtText: '#6194F5',
            strong: '#6194F5',
            tertiary: '#E5EEFF'
        },
        accent: {
            primary: '#164293',
            primaryContrastText: '#FFFFFF',
            strong: '#0D2858',
            secondary: '#8AA3D0', // light
            tertiary: '#D6E0F3', // moreLight
        },
        accentNotifications: {
            primary: '#3392FF',
            primaryContrastText: '#FFFFFF',
        }
    },
    actions: {
        // Used in main backgrouds
        main: {
            default: window.APP_CONFIG[AppConfigFields.Palette][AppConfigPaletteFields.Primary][AppConfigPaletteColorFields.Main],
            hover: window.APP_CONFIG[AppConfigFields.Palette][AppConfigPaletteFields.Primary][AppConfigPaletteColorFields.Dark], // '#728197'
            pressed: '#1A212D',
            focus: '#2D3748',
            disabled: '#E8ECEF',
            text: '#FFFFFF',
            textDisabled: '#A9A9A9'
        },
        // Used in alternative backgrounds
        alt: {
            default: '#DEE2E7',
            hover: '#EDF2F7',
            pressed: '#E1E7EF',
            focus: '#E1E7EF',
            disabled: '#CCD6E0',
            text: '#576171',
            textDisabled: '#CCD6E0'
        }
    }
}

export { themeColorDefinition }