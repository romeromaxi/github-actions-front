import React, {useContext, useMemo} from "react";
import {Stack} from "@mui/material";
import OffererSolicitationCompanyHeader from "../components/OffererSolicitationCompanyHeader";
import OffererSolicitationAttachmentMessage from "../components/OffererSolicitationAttachmentMessage";
import OffererSolicitationLastEventCard from "../components/OffererSolicitationLastEventCard";
import {SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {useSolicitation} from "../../../../hooks/contexts/SolicitationsContext";
import {OffererContext} from "../../components/OffererContextProvider";
import OffererSolicitationChat from "../components/OffererSolicitationChat";
import SolicitationRequestedDocumentation, { SolicitationRequestedDocumentationVariant } from "../../../solicitations/components/SolicitationRequestedDocumentation";
import OffererSolicitationActionGeneral from "../components/OffererSolicitationActionGeneral";
import OffererSolicitationResult from "../components/results/OffererSolicitationResult";

interface OffererSolicitationTabSummaryProps {
    includeChatTab?: boolean
}

function OffererSolicitationTabSummary({ includeChatTab = false}: OffererSolicitationTabSummaryProps) {
    const { solicitation, isCommercialResponsible, betweenOfferers } = useSolicitation();
    const offerer = useContext(OffererContext);

    const chatEmptyDesc = useMemo(() => {
        if (!solicitation) return ''
        if (betweenOfferers) {
            const offererBase = offerer[EntityWithIdFields.Id] === solicitation[SolicitationViewDTOFields.OffererId]
            return `Este es el inicio de tu chat con el ${offererBase ? 'derivador' : 'oferente'}. Acá vas a poder charlar con ${offererBase ? solicitation[SolicitationViewDTOFields.IntermediaryOffererBusinessName] :
                solicitation[SolicitationViewDTOFields.OffererBusinessName]}.`
        }

        return `Este es el inicio de tu chat con la empresa. Acá vas a poder charlar con ${solicitation[SolicitationViewDTOFields.CompanyBusinessName]}.`
    }, [solicitation, betweenOfferers, offerer])
    
    return (
        <Stack spacing={3}>
            {
                !betweenOfferers && 
                    <OffererSolicitationResult />
            }
            
            {
                !betweenOfferers &&
                    <OffererSolicitationActionGeneral />
            }
            
            {
                includeChatTab &&
                    <OffererSolicitationChat chatEmptyDesc={chatEmptyDesc} />
            }
            
            <OffererSolicitationCompanyHeader />
            
            <OffererSolicitationAttachmentMessage />

            <OffererSolicitationLastEventCard />

            {
                includeChatTab &&
                    <SolicitationRequestedDocumentation solicitationId={solicitation?.[EntityWithIdFields.Id]}
                                                        solicitation={solicitation}
                                                        offererId={offerer[EntityWithIdFields.Id]}
                                                        variant={offerer?.[EntityWithIdFields.Id] === solicitation?.[SolicitationViewDTOFields.OffererId] ? SolicitationRequestedDocumentationVariant.RequestAndSend : SolicitationRequestedDocumentationVariant.SendAndUpload}
                                                        allowRequestNewFile={isCommercialResponsible}
                                                        buttonPosition='top'
                    />
            }
        </Stack>
    )
}

export default OffererSolicitationTabSummary;