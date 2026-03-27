import { Dialog } from "@mui/material";
import OffererSolicitationAnalysisFormDialogResponse
    from "../../../offerer/components/OffererSolicitation/OffererSolicitationAssessment/OffererSolicitationAnalysisFormDialogResponse";
import {useEffect, useState} from "react";
import {HttpSolicitationDerivation} from "../../../../http/solicitations/httpSolicitationDerivation";
import {SolicitationAptitudeFormViewDTO} from "../../../../types/solicitations/solicitationDocumentationAnalysisData";
import {OffererSolicitationAnalysisFormDataRequest} from "../../../../types/offerer/offererSolicitationData";

interface SolicitationUnableDerivationDialogProps {
    open: boolean,
    solicitationId: number,
    onClose: () => void,
    onSubmit: (msgs?: OffererSolicitationAnalysisFormDataRequest[]) => void
}

function SolicitationUnableDerivationDialog({ open, solicitationId, onClose, onSubmit }: SolicitationUnableDerivationDialogProps) {
    const [formContent, setFormContent] = useState<SolicitationAptitudeFormViewDTO>();
    
    const onSaveDialog = (msgs?: OffererSolicitationAnalysisFormDataRequest[]) => onSubmit(msgs);
    
    useEffect(() => {
        if (open)
            HttpSolicitationDerivation.getNotSuitableForm(solicitationId).then(setFormContent);
        else 
            setFormContent(undefined);
    }, [open]);
    
    return (
        <Dialog open={open} 
                onClose={onClose}
                maxWidth={'sm'}
                fullWidth
        >
            <OffererSolicitationAnalysisFormDialogResponse open={open} 
                                                           content={formContent}
                                                           onClose={onClose} 
                                                           textConfirm={"Confirmar"}
                                                           onSave={onSaveDialog}
            />
            
        </Dialog>
    )
}

export default SolicitationUnableDerivationDialog;