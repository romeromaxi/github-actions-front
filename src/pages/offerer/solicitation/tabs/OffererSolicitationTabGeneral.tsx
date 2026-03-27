import { Stack } from "@mui/material";
import {OffererSolicitationCompanyHeaderOld} from "../components/OffererSolicitationCompanyHeader";
import OffererSolicitationAnalysis from "../components/analysis/OffererSolicitationAnalysis";

function OffererSolicitationTabGeneral() {
  return (
    <Stack direction={"column"} spacing={1}>
      <OffererSolicitationCompanyHeaderOld />
      
      <OffererSolicitationAnalysis />
    </Stack>
  )
}

export default OffererSolicitationTabGeneral;