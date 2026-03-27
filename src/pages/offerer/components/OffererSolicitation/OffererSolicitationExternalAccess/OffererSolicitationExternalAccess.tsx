import {Grid} from "@mui/material";
import {SolicitationViewDTO} from "../../../../../types/solicitations/solicitationData";
import {EntityWithIdFields} from "../../../../../types/baseEntities";
import OffererSolicitationExternalAccessContent from "./OffererSolicitationExternalAccessContent";
import SolicitationLeftPanelComponent
    from "../../../../../components/solicitations/leftPanel/SolicitationLeftPanelComponent";
import {ProfilePersonTypes} from "../../../../../types/person/personData";


interface OffererSolicitationExternalAccessProps {
    solicitation: SolicitationViewDTO
}


const OffererSolicitationExternalAccess = ({solicitation} : OffererSolicitationExternalAccessProps) => {
    
    
    return (
        <Grid container spacing={2} mb={2}>
            <Grid item xs={3}>
                <SolicitationLeftPanelComponent variant={ProfilePersonTypes.Offerer} solicitation={solicitation} />
            </Grid>
            <Grid item xs={9}>
                <OffererSolicitationExternalAccessContent solicitation={solicitation} />
            </Grid>
        </Grid>
    )
}


export default OffererSolicitationExternalAccess