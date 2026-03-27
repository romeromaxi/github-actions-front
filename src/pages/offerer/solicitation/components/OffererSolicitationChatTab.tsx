import OffererSolicitationChat from "./OffererSolicitationChat";
import {Stack} from "@mui/material";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import SolicitationRequestedDocumentation, {
  SolicitationRequestedDocumentationVariant
} from "../../../solicitations/components/SolicitationRequestedDocumentation";
import {useMemo} from "react";
import {SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";
import {SolicitationTypes} from "../../../../types/solicitations/solicitationEnums";


interface OffererSolicitationChatTabProps {
  offerer: any;
  solicitation: any;
  offererBase: boolean;
  isCommercialResponsible: boolean;
}

const OffererSolicitationChatTab = ({offerer, solicitation, offererBase, isCommercialResponsible}: OffererSolicitationChatTabProps) => {

  const chatEmptyDesc = useMemo(() => {
    if (!solicitation) return ''
    if (solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.BetweenOfferers) {
      const offererBase = offerer[EntityWithIdFields.Id] === solicitation[SolicitationViewDTOFields.OffererId]
      return `Este es el inicio de tu chat con el ${offererBase ? 'derivador' : 'oferente'}. Acá vas a poder charlar con ${offererBase ? solicitation[SolicitationViewDTOFields.IntermediaryOffererBusinessName] :
          solicitation[SolicitationViewDTOFields.OffererBusinessName]}.`
    }

    return `Este es el inicio de tu chat con la empresa. Acá vas a poder charlar con ${solicitation[SolicitationViewDTOFields.CompanyBusinessName]}.`
  }, [solicitation])
  
  return (
      <Stack spacing={3}>
        <OffererSolicitationChat chatEmptyDesc={chatEmptyDesc} />
        <SolicitationRequestedDocumentation solicitationId={solicitation?.[EntityWithIdFields.Id]}
                                            solicitation={solicitation}
                                            offererId={offerer[EntityWithIdFields.Id]}
                                            variant={offererBase ? SolicitationRequestedDocumentationVariant.RequestAndSend : SolicitationRequestedDocumentationVariant.SendAndUpload}
                                            allowRequestNewFile={isCommercialResponsible}
                                            buttonPosition='top'
        />
      </Stack>
  )
}

export default OffererSolicitationChatTab;