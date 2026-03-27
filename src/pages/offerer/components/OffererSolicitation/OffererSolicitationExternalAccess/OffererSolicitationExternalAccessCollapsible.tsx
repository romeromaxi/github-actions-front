import {
    SolicitationAccessView,
    SolicitationAccessViewFields
} from "../../../../../types/solicitations/solicitationData";
import {Box, Chip, Collapse, Stack, Tooltip, Typography} from "@mui/material";
import {boxSx} from "../../../../company/activity/components/ActivityBox.styles";
import React, {useState} from "react";
import {ExpandIconButton} from "../../../../../components/buttons/Buttons";
import OffererSolicitationExternalAccessCollapsibleContent from "./OffererSolicitationExternalAccessCollapsibleContent";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";


interface OffererSolicitationExternalAccessCollapsibleProps {
    items: SolicitationAccessView[]
}

const OffererSolicitationExternalAccessCollapsible = ({items} : OffererSolicitationExternalAccessCollapsibleProps) => {
    const [expand, setExpand] = useState<boolean>(false)
    const getResponsesQuantity = () => items.filter(item => item[SolicitationAccessViewFields.HasDefinedResult]).length
    
    return (
        <Box sx={{ ...boxSx, p: '0.5rem !important'}}>
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Typography fontSize={16} fontWeight={600}>{items[0][SolicitationAccessViewFields.FinancialEntityBusinessName]}</Typography>
                <Stack direction='row' alignItems={'center'} spacing={2}>
                    <Tooltip title={'Cantidad de respuestas'}>
                        <Chip
                            color={'primary'}
                            icon={<CheckCircleRoundedIcon fontSize={'small'}/>}
                            label={`${getResponsesQuantity()}/${items.length}`}
                            size={'small'}
                        />
                    </Tooltip>
                    <ExpandIconButton
                        onClick={() => setExpand(!expand)}
                        initialExpanded={'expandMore'}
                        tooltipTitle={expand ? 'Contraer' : 'Expandir'}
                    />
                </Stack>
            </Stack>
            <Collapse in={expand}>
                <OffererSolicitationExternalAccessCollapsibleContent items={items} />
            </Collapse>
        </Box>
    )
}


export default OffererSolicitationExternalAccessCollapsible