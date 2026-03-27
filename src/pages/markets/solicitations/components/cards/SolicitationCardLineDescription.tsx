import React, {useState} from "react";
import {Box} from "@mui/material";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {DataWithLabel} from "components/misc/DataWithLabel";
import {OffererLogoWithName} from "pages/offerer/components/OffererLogo";
import {TypographyBase} from "components/misc/TypographyBase";
import {SolicitationSummaryFields} from "types/solicitations/solicitationData";
import ProductLineSummaryDetailDrawer from "pages/markets/lines/detail/ProductLineSummaryDetailDrawer";
import {HttpProductLine} from "http/index";
import {ProductLineViewDetail} from "types/lines/productLineData";

interface SolicitationCardLineDescriptionProps {
    solicitation: any;
}

function SolicitationCardLineDescription({solicitation}: SolicitationCardLineDescriptionProps) {
    const [lineDetail, setLineDetail] = useState<ProductLineViewDetail | undefined>(undefined);
    
    const offererBusinessName = solicitation[SolicitationViewDTOFields.OffererBusinessName];
    const lineDesc = solicitation[SolicitationViewDTOFields.LineDesc] || solicitation[SolicitationSummaryFields.LineDesc];

    const handleOpenLineDetail = async (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        
        try {
            const lineData = await HttpProductLine.getByProductLineId(solicitation[SolicitationViewDTOFields.ProductLineId]);
            setLineDetail(lineData);
        } catch (error) {
            console.error("Error loading line detail:", error);
        }
    };

    
    return (
        <React.Fragment>
            <DataWithLabel
                label={
                    <Box pt={'2.5px'} sx={{overflow: 'hidden'}}>
                        <TypographyBase variant={'body4'}
                                        color={'text.lighter'}
                                        fontWeight={400}
                                        maxLines={1}
                                        tooltip
                                        onClick={handleOpenLineDetail}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                color: '#008547'
                                            }
                                        }}
                        >
                            {lineDesc}
                        </TypographyBase>
                    </Box>
                }
                data={
                    <OffererLogoWithName offererId={solicitation[SolicitationViewDTOFields.OffererId]}
                                         offererUrlLogo={solicitation[SolicitationViewDTOFields.OffererUrlLogo]}
                                         offererBusinessName={offererBusinessName}
                                         NameProps={{variant: 'body2', fontWeight: 600, fontFamily: 'Poppins', tooltip: true, maxLines: 1}}
                                         size={20}
                    />
                }
            />

            {
                lineDetail && (
                    <ProductLineSummaryDetailDrawer open
                                                    line={lineDetail}
                                                    onClose={() => setLineDetail(undefined)}
                    />
                )
            }
        </React.Fragment>
    )
}

export default SolicitationCardLineDescription;