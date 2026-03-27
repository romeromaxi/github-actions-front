import React from "react";
import {Box} from "@mui/material";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {DataWithLabel} from "components/misc/DataWithLabel";
import {TypographyBase} from "components/misc/TypographyBase";
import {dateFormatter} from "util/formatters/dateFormatter";

interface SolicitationCardLastModifiedProps {
    solicitation: any;
}

function SolicitationCardLastModified({solicitation}: SolicitationCardLastModifiedProps) {
    const lastModified = solicitation[SolicitationViewDTOFields.CompanyLastModified] || null;
    
    return (
        <DataWithLabel
            label={<TypographyBase variant="body4" fontWeight={400} color='text.lighter'>Última actualización</TypographyBase>}
            data={
                <Box sx={{overflow: 'hidden'}}>
                    <TypographyBase variant={'subtitle1'} fontWeight={600} maxLines={1} tooltip>
                        {dateFormatter.toShortDateWithMonthName(lastModified)}
                    </TypographyBase>
                </Box>
            }
        />
    )
}

export default SolicitationCardLastModified;