import {SolicitationViewDTO} from "../../../../../types/solicitations/solicitationData";
import {Grid} from "@mui/material";
import SolicitationLeftPanelComponent
    from "../../../../../components/solicitations/leftPanel/SolicitationLeftPanelComponent";
import {ProfilePersonTypes} from "../../../../../types/person/personData";
import SolicitationRightPanelComponent
    from "../../../../../components/solicitations/rightPanel/SolicitationRightPanelComponent";
import OffererSolicitationReceptionContent from "./OffererSolicitationReceptionContent";


interface OffererSolicitationReceptionProps {
    solicitation: SolicitationViewDTO
}


const OffererSolicitationReception = ({solicitation} : OffererSolicitationReceptionProps) => {
    
    return (
        <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={3}>
                <SolicitationLeftPanelComponent variant={ProfilePersonTypes.Offerer} solicitation={solicitation} />
            </Grid>
            <Grid item xs={12} md={6}>
                <OffererSolicitationReceptionContent solicitation={solicitation} />
            </Grid>
            <Grid item xs={12} md={3}>
                <SolicitationRightPanelComponent variant={ProfilePersonTypes.Offerer} solicitation={solicitation} />
            </Grid>
        </Grid>
    )
}


export default OffererSolicitationReception