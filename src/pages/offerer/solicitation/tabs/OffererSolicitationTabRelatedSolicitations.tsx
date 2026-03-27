import {Stack} from "@mui/material";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import SolicitationRelatedOffererCompany from "../../../solicitations/components/SolicitationRelatedOffererCompany";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {EntityWithIdFields} from "types/baseEntities";
import {HttpSolicitation} from "../../../../http";

function OffererSolicitationTabRelatedSolicitations() {
  const { solicitation } = useSolicitation();
  
  return (
    <Stack direction={'column'} spacing={1}>
      {
        solicitation &&
          <SolicitationRelatedOffererCompany solicitationIdBase={solicitation[EntityWithIdFields.Id]}
                                             promiseFn={() => HttpSolicitation.getByOffererAndCompanyId(
                                                 solicitation[SolicitationViewDTOFields.OffererId],
                                                 solicitation[SolicitationViewDTOFields.CompanyId]
                                             )}
          />
      }
    </Stack>
  )
}

export default OffererSolicitationTabRelatedSolicitations;