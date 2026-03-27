
import {Stack} from "@mui/material";
import CompanySolicitationEventTimeline from "./CompanySolicitationEventTimeline";
import {SolicitationViewDTO} from "../../../../types/solicitations/solicitationData";
import {EntityWithIdFields} from "../../../../types/baseEntities";


interface CompanySolicitationRightPanelThirdProps {
    solicitation: SolicitationViewDTO
}


const CompanySolicitationRightPanelThird = ({solicitation} : CompanySolicitationRightPanelThirdProps) => {
    return (
        <Stack spacing={2}>
            <CompanySolicitationEventTimeline solicitationId={solicitation[EntityWithIdFields.Id]}/>
        </Stack>
    );
}


export default CompanySolicitationRightPanelThird