import {LufeFinanceIndicator, LufeFinanceIndicatorFields} from "../../../../../../../types/lufe/lufeFinanceIndicators";
import React, {useState} from "react";
import {Box, Collapse, Stack, Typography} from "@mui/material";
import {dateFormatter} from "../../../../../../../util/formatters/dateFormatter";
import {BaseIconWrapper} from "../../../../../../../components/icons/Icons";
import {CaretDown, CaretUp} from "@phosphor-icons/react";
import OffererLufeFinanceIndicatorDetail from "./OffererLufeFinanceIndicatorDetail";


interface OffererLufeFinanceIndicatorCollapsableProps {
    indicator: LufeFinanceIndicator
}


const OffererLufeFinanceIndicatorCollapsable = ({indicator} : OffererLufeFinanceIndicatorCollapsableProps) => {
    const [expanded, setExpanded] = useState<boolean>(false)

    return (
        <Box sx={{ border: '1px solid #EDF2F7', borderRadius: '24px', padding: '0px !important',  overflow: 'hidden' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                <Stack>
                    <Typography variant="body2" fontWeight={500}>
                        {`Período ${indicator[LufeFinanceIndicatorFields.Period]?.slice(0, -2) ?? '-'}`}
                    </Typography>
                    <Typography variant='caption' color='text.lighter'>
                        {`Fecha de presentación: ${dateFormatter.toShortDate(indicator[LufeFinanceIndicatorFields.PresentationDate])}`}
                    </Typography>
                </Stack>
                <Box onClick={() => setExpanded(!expanded)} sx={{ cursor: 'pointer'}}>
                    <BaseIconWrapper Icon={expanded ? CaretUp : CaretDown} size={'md'} bg={'#F7FAFC'} />
                </Box>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <OffererLufeFinanceIndicatorDetail indicator={indicator} />
            </Collapse>
        </Box>
    )
}


export default OffererLufeFinanceIndicatorCollapsable