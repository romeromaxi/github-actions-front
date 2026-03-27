import React from "react";
import {Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";

interface BouncedChecksTotalProps {
    title: string,
    value: string,
    description: string,
    color: string
}

function BouncedChecksTotal({ title, value, description, color }: BouncedChecksTotalProps) {
    return (
        <Stack spacing={1}>
            <TypographyBase variant={'h5'}>
                {title}
            </TypographyBase>
            <TypographyBase variant={'h2'} color={color}>
                {value}
            </TypographyBase>
            <TypographyBase variant={'body2'}
                            fontWeight={600}
                            fontFamily={'Poppins'}
                            color={'text.lighter'}
            >
                {description}
            </TypographyBase>
        </Stack>
    )
}

export default BouncedChecksTotal;