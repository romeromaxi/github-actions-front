import {Stack, TextField, TextFieldProps } from "@mui/material";
import LabelFormBase from "./LabelFormBase";
import React from "react";

export function TextFieldBase({ label, ...props }: TextFieldProps) {
    return (
        <Stack spacing={1.25}>
            <LabelFormBase label={label} />

            <TextField variant={'filled'}
                       size={'small'}
                       { ...props }
            />
        </Stack>
    )
}

 