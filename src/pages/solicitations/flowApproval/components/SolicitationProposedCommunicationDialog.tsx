import React, {useContext, useEffect, useMemo, useState} from "react";
import {Dialog} from "@mui/material";
import {OffererSolicitationAnalysisFormDataRequest} from "types/offerer/offererSolicitationData";
import {
    SolicitationAnalysisViewDTO,
    SolicitationAnalysisViewDTOFields
} from "types/solicitations/solicitationAnalysisData";
import {SolicitationAptitudeFormViewDTO,} from "types/solicitations/solicitationDocumentationAnalysisData";
import {SolicitationProposedApprovalFlowContext} from "../SolicitationProposedApprovalFlow";
import {EntityWithIdAndDescriptionFields} from "types/baseEntities";
import SolicitationProposedCommunicationDialogResponseContent
    from "./SolicitationProposedCommunicationDialogResponseContent";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {dateFormatter} from "util/formatters/dateFormatter";
import SolicitationProposedCommunicationDialogSentContent from "./SolicitationProposedCommunicationDialogSentContent";
import {Systems} from "../../../../types/workflow/workflowEnums";
import {SolicitationProposedApprovalFlowTypes} from "types/solicitations/solicitationEnums";
import {SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";

const titleCommunicationMap : Record<Systems, Record<SolicitationProposedApprovalFlowTypes, string>> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: "Comunicación de recepción",
        [SolicitationProposedApprovalFlowTypes.SendingResults]: "Comunicación de precalificación"
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: "",
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ""
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: "Comunicación de recepción",
        [SolicitationProposedApprovalFlowTypes.SendingResults]: "Resumen de la asistencia"
    },
}

interface SolicitationProposedCommunicationDialogProps {
    open: boolean,
    suitable?: boolean,
    justView: boolean,
    onSave?: (messages: OffererSolicitationAnalysisFormDataRequest[]) => void,
    onClose: () => void,
    dataAnalysis?: SolicitationAnalysisViewDTO
}

function SolicitationProposedCommunicationDialog({
    open, suitable, justView, onSave, onClose, dataAnalysis
}: SolicitationProposedCommunicationDialogProps) {
    const { solicitation, flowType, HttpAnalysis } = useContext(SolicitationProposedApprovalFlowContext);
    const [formContent, setFormContent] = useState<SolicitationAptitudeFormViewDTO>();

    const prevMessage = useMemo(() => (
        dataAnalysis?.[SolicitationAnalysisViewDTOFields.AptitudeMessage] ?? ''
    ), [dataAnalysis])
    
    const titleDialog = useMemo(() => (
        titleCommunicationMap[solicitation[SolicitationViewDTOFields.SystemCode] as Systems][flowType]
    ), [justView, prevMessage, dataAnalysis])

    const subtitleDialog = useMemo(() => {
        if (justView && dataAnalysis && dataAnalysis[SolicitationAnalysisViewDTOFields.AptitudeDate]) 
            return `Enviado ${dateFormatter.toLongDate(dataAnalysis[SolicitationAnalysisViewDTOFields.AptitudeDate])}`;

        return undefined
    }, [justView, prevMessage, dataAnalysis])
    
    useEffect(() => {
        if (open) {
            const suitableFormPromise = suitable ? HttpAnalysis.getSuitableForm : HttpAnalysis.getNotSuitableForm;

            suitableFormPromise(solicitation[EntityWithIdAndDescriptionFields.Id])
                .then(setFormContent)
        }
    }, [open]);

    useEffect(() => {
        if (!open) setFormContent(undefined);
    }, [open, suitable]);
    
    return (
        <Dialog open={open} maxWidth={'sm'} fullWidth onClose={onClose}>
            <BaseDialogTitle title={titleDialog} 
                             subtitle={subtitleDialog}
                             onClose={onClose}
            />
            
            {
                justView ? (
                    <SolicitationProposedCommunicationDialogSentContent message={prevMessage} />
                ) : (
                    <SolicitationProposedCommunicationDialogResponseContent open={open} 
                                                                            content={formContent} 
                                                                            onSave={onSave}
                    />
                )
            }
        </Dialog>
    )
}

export default SolicitationProposedCommunicationDialog;