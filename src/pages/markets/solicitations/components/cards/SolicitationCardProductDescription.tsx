import React from "react";
import {Box} from "@mui/material";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {DataWithLabel} from "components/misc/DataWithLabel";
import {TypographyBase} from "components/misc/TypographyBase";

interface SolicitationCardProductDescriptionProps {
    solicitation: any;
}

function SolicitationCardProductDescription({solicitation}: SolicitationCardProductDescriptionProps) {
    return (
        <DataWithLabel
            label={<TypographyBase variant="body4" fontWeight={400} color='text.lighter'>Tipo de producto</TypographyBase>}
            data={
                <Box sx={{overflow: 'hidden'}}>
                    <TypographyBase variant={'subtitle1'} fontWeight={600} maxLines={1} tooltip>
                        {solicitation[SolicitationViewDTOFields.ProductDesc] || '-'}
                    </TypographyBase>
                </Box>
            }
        />
    )
}

export default SolicitationCardProductDescription;