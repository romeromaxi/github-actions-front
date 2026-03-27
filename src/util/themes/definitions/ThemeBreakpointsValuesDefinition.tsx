

const themeBreakpointsValuesDefinition = {
    xs: 0,
    sm: 600,
    mid: 800,
    md: 960,
    ml: 1240,
    lg: 1440,
    xl: 1920,
}

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        mid: true;
        md: true;
        ml: true;
        lg: true;
        xl: true;
    }
}

export {
    themeBreakpointsValuesDefinition
}