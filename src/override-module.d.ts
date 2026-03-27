declare module '@mui/material/Card' {
    interface CardPropsVariantOverrides {
        onboarding: true;
        infoBureau: true;
    }
}

declare module '@mui/material/Chip' {
    interface ChipPropsVariantOverrides {
        newStatus: true;
    }
}