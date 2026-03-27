import {TypographyBase} from "../misc/TypographyBase";
import {Stack, StackProps, Typography} from "@mui/material";
import {LoadPendingWarning} from "./LoadPendingWarning";
import React, { forwardRef } from "react";

interface LabelFormBaseProps extends StackProps {
  label: React.ReactNode,
  required?: boolean,
  loadPending?: boolean
}

const LabelFormBase = forwardRef<HTMLDivElement, LabelFormBaseProps>(
  ({ label, required, loadPending, ...stackProps }, ref) => {
    return (
        <Stack direction="row" ref={ref} justifyContent="flex-start" spacing={1.25}>
            <TypographyBase variant={'labelForms'}>{label}</TypographyBase>
            
            { required && <Typography>{'*'}</Typography>}
            
            { loadPending && <LoadPendingWarning /> }
        </Stack>
  )
});

export default LabelFormBase;
