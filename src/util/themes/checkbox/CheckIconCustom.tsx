import React from "react";
import {Box} from "@mui/material";
import {themeColorDefinition} from "../definitions";
import CheckIconCustomStyles from "./CheckIconCustom.styles";

const classNameCustom = "icono-check-custom";

function CheckIconCustom() {
    const classes = CheckIconCustomStyles();
    
    return (
        <Box className={`${classNameCustom} ${classes.root}`} sx={{
            boxShadow: `inset 0 0 0 2px ${themeColorDefinition.UIElements.borders.primary}`,
        }}
        >
        </Box>
    )
}

function CheckIconCustomChecked() {
    const classes = CheckIconCustomStyles();
    
    return (
        <Box className={`${classNameCustom} ${classes.root} ${classes.checked}`}>
          <Box className={classes.checkedInside} />          
        </Box>
    )
}

export {
    CheckIconCustom,
    CheckIconCustomChecked
}