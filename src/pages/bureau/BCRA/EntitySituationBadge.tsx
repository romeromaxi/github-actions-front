import React from "react";
import {Box} from "@mui/material";
import {themeTypographyDefinition} from "util/themes/definitions";
import {SituationColorMap} from "util/typification/situationColor";
import {SituationTypeCodes} from "types/general/generalEnums";

interface EntitySituationBadgeProps {
    situationCode: number,
    size?: 'small' | 'medium'
}

function EntitySituationBadge({ situationCode, size = 'small' }: EntitySituationBadgeProps) {
    const finalProps = size === 'small' ?
        {
            width: '1.125rem',
            sx: { ...themeTypographyDefinition.subtitle2, fontSize: '0.625rem' }
        }
        :
        {
            width: '1.5rem',
            sx: { ...themeTypographyDefinition.body4 }
        }
    
    return (
        <Box borderRadius={'34px'}
             width={finalProps.width}
             height={finalProps.width}
             color={'white'}
             textAlign={'center'}
             alignContent={'center'}
             sx={{
                 ...finalProps.sx,
                 placeSelf: 'center',
                 backgroundColor: SituationColorMap[situationCode as SituationTypeCodes].dark,
             }}
        >
            {situationCode}
        </Box>
    )
}

export default EntitySituationBadge;