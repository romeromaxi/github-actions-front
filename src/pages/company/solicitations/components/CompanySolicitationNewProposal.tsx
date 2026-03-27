import React, {useEffect, useState} from "react";
import {
    SolicitationCommunicationFields,
    SolicitationCommunicationView
} from "types/solicitations/solicitationCommunicationData";
import {HttpSolicitationCommunication} from "http/solicitations/httpSolicitationCommunication";
import {
    CompanySolicitationNewProposalNotSuitableAssistedSearchOption,
    CompanySolicitationNewProposalNotSuitableGeneralOption, CompanySolicitationNewProposalNotSuitableOption,
    CompanySolicitationNewProposalSuitableOption
} from "./CompanySolicitationNewProposalsOptions";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {EntityWithIdFields} from "types/baseEntities";
import {SolicitationTypes} from "types/solicitations/solicitationEnums";

interface CompanySolicitationNewProposalProps {
    solicitation?: SolicitationViewDTO
}

const CompanySolicitationNewProposal = ({solicitation} : CompanySolicitationNewProposalProps) => {
    const [communications, setCommunications] = useState<SolicitationCommunicationView[]>()
    
    useEffect(() => {
        const solicitationId = solicitation?.[EntityWithIdFields.Id]
        
        if (solicitationId) {
            setCommunications(undefined);
            HttpSolicitationCommunication.getByIdSolicitation(solicitationId)
                .then(setCommunications)
        }
    }, [solicitation]);
    
    if (!solicitation || !communications || communications.length === 0) return null;
    
    return (
        (communications && communications?.length > 0) ?
        (
            communications[0]?.[SolicitationCommunicationFields.IsSuitable] ?
                <CompanySolicitationNewProposalSuitableOption communication={communications[0]}
                                                              solicitation={solicitation}
                />
                :
                communications[0]?.[SolicitationCommunicationFields.AptitudeMessage] ?
                    <CompanySolicitationNewProposalNotSuitableOption title={'La entidad decidió no avanzar con esta solicitud'}
                                                                     message={communications[0]?.[SolicitationCommunicationFields.AptitudeMessage]}
                                                                     showAssistedSearch={solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.General}
                    /> 
                    :
                    solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.General ?
                        <CompanySolicitationNewProposalNotSuitableGeneralOption />
                        :
                        <CompanySolicitationNewProposalNotSuitableAssistedSearchOption />
        )
            :
            null
    )
}


export default CompanySolicitationNewProposal