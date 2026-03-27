import React from "react";
import {Card, CardHeader, Stack} from "@mui/material";
import SolicitationFollowUpSteps from "pages/solicitations/components/SolicitationFollowUpSteps";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {EntityWithIdFields} from "types/baseEntities";

function OffererSolicitationFollowUp() {
  const { solicitation } = useSolicitation();
  
  return (
    <Card>
      <CardHeader title={"Seguimiento de la solicitud"} />
      
      <Stack spacing={1.5} sx={{ width: '100%', height: 'fit-content !important'}}>
        <SolicitationFollowUpSteps solicitationId={solicitation?.[EntityWithIdFields.Id]} />
      </Stack>
    </Card>
  )
}

export default OffererSolicitationFollowUp;