import {Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import React from "react";

interface CardHeaderTitleWithFieldsPendingProps {
    title: string,
    missingFields?: number
}

function CardHeaderTitleWithFieldsPending({ title, missingFields }: CardHeaderTitleWithFieldsPendingProps) {
    if (!!missingFields && missingFields > 0) {
        const missingLabel = missingFields === 1 ? 'dato requerido' : 'datos requeridos';

        return (
            <Stack direction={'row'} spacing={1.25} alignItems={'center'}>
                <TypographyBase variant={'cardHeader'}>{title}</TypographyBase>

                <TypographyBase variant={'button2'} color={'warning.main'}>
                    {`${missingFields} ${missingLabel}`}
                </TypographyBase>
            </Stack>
        )
    }
    
    return (
        <TypographyBase variant={'cardHeader'}>{title}</TypographyBase>
    );
}

export default CardHeaderTitleWithFieldsPending;