import React from "react";
import {Box, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";

interface DebtFinancialInfoEmptyProps {
    label: string
}

function DebtFinancialInfoEmpty({ label }: DebtFinancialInfoEmptyProps) {
    return (
        <Stack alignItems={'center'}
               textAlign={'center'}
        >
            <Box component="img"
                 width={{ xs: '150px', sm: '290px' }}
                 height={{ xs: '150px', sm: '290px' }}
                 src={'/images/assets/bureau/debt-current-empty.svg'} />

            <TypographyBase variant={'h5'} color={'text.lighter'}>
                {label}
            </TypographyBase>
        </Stack>
    )
}

export default DebtFinancialInfoEmpty;