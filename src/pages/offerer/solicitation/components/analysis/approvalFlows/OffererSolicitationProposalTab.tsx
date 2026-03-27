import React from "react";
import {Grid} from "@mui/material";
import {SolicitationViewDTO} from "types/solicitations/solicitationData";

interface OffererSolicitationProposalTabProps {
  solicitation: SolicitationViewDTO,
  actualState: number,
  isViewState?: boolean
}

function OffererSolicitationProposalTab({}: OffererSolicitationProposalTabProps){
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
      </Grid>
    </Grid>
  )
}

export default OffererSolicitationProposalTab;