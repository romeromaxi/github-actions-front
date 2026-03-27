
import {
    Stack
} from "@mui/material";
import CompanySolicitationEventTimeline from "./CompanySolicitationEventTimeline";
import {SolicitationViewDTO} from "../../../../types/solicitations/solicitationData";
import {EntityWithIdFields} from "../../../../types/baseEntities";


interface CompanySolicitationRightPanelFirstProps {
    solicitation: SolicitationViewDTO
}


const CompanySolicitationRightPanelFirst = ({solicitation} : CompanySolicitationRightPanelFirstProps) => {

    return (
        <Stack spacing={2}>
            <CompanySolicitationEventTimeline solicitationId={solicitation[EntityWithIdFields.Id]}/>
        </Stack>
    );
}


export default CompanySolicitationRightPanelFirst