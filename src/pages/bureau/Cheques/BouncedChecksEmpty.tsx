import React, {useMemo} from "react";
import {Box, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {dateFormatter} from "util/formatters/dateFormatter";
import {stringFormatter} from "util/formatters/stringFormatter";

interface BouncedChecksEmptyProps {
    lastDate?: Date,
    textDisclaimer?: string,
    variant?: 'general' | 'section'
}

function BouncedChecksEmpty({ 
    lastDate, 
    textDisclaimer = 'cheques rechazados',
    variant = 'general'
}: BouncedChecksEmptyProps) {
    const srcImage: string = variant === 'general' ? 
        '/images/assets/bureau/bounced-checks-empty.svg' : 
        '/images/assets/bureau/bounced-checks-section-empty.svg';
    
    const disclaimer = useMemo(() => {
        const lowerDisclaimer = stringFormatter.toLowerFirst(textDisclaimer);
        
        if (!lastDate) return `A la fecha de la última actualización, la PyME no tiene ${lowerDisclaimer}`;

        return `Al ${dateFormatter.toShortDate(lastDate)}, la PyME no tiene ${lowerDisclaimer}`;
    }, [lastDate, textDisclaimer]);
    
    return (
        <Stack alignItems={'center'}
               textAlign={'center'}
        >
            <Box component="img"
                 width={{ xs: '100px', sm: '290px' }}
                 height={{ xs: '99px', sm: '290px' }}
                 src={srcImage} />
            
            <TypographyBase variant={'h5'} color={'text.lighter'}>
                {disclaimer}
            </TypographyBase>
        </Stack>
    )
}

export default BouncedChecksEmpty;