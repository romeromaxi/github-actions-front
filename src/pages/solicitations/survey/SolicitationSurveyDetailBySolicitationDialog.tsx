import React, {useEffect, useState} from "react";
import {Dialog, DialogContent} from "@mui/material";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {SolicitationSurveyQuestionAnswer} from "types/solicitations/solicitationSurveyData";
import {HttpSolicitationSurvey} from "http/solicitations/httpSolicitationSurvey";
import SolicitationSurveyDetailView from "./SolicitationSurveyDetailView";

interface SolicitationSurveyDetailBySolicitationDialogProps {
    open: boolean,
    solicitationId: number,
    onClose: () => void
}

function SolicitationSurveyDetailBySolicitationDialog({ open, solicitationId, onClose}: SolicitationSurveyDetailBySolicitationDialogProps) {
    const [answersSurvey, setAnserwsSurvey] = useState<SolicitationSurveyQuestionAnswer[]>();

    useEffect(() => {
        if (open && solicitationId)
            HttpSolicitationSurvey.getSurveyAnswersBySolicitationId(solicitationId)
                .then(setAnserwsSurvey)
    }, [open, solicitationId]);
    
    return (
        <Dialog open={open} 
                onClose={onClose} 
                maxWidth={'md'}
                fullWidth
        >
            
            <BaseDialogTitle onClose={onClose} title={'Datos solicitud'} />
            
            <DialogContent>
                <SolicitationSurveyDetailView answers={answersSurvey} />
            </DialogContent>
        </Dialog>
    )
}

export default SolicitationSurveyDetailBySolicitationDialog;
