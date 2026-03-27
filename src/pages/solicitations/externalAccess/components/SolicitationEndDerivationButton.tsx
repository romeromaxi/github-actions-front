import {Button} from "@mui/material";
import { HttpAction } from "http/index";
import React, {useState} from "react";
import { ActionExecute, ActionExecuteFields } from "types/workflow/actionData";
import { ActionsTypes } from "types/workflow/actionEnums";
import {SolicitationAccessView, SolicitationAccessViewFields} from "types/solicitations/solicitationData";
import {SolicitationAccessStateTypeCodes} from "types/solicitations/solicitationEnums";
import SolicitationUnableDerivationDialog from "./SolicitationUnableDerivationDialog";
import useAxios from "hooks/useAxios";
import {useAction} from "hooks/useAction";
import {DialogAlert} from "components/dialog";

interface SolicitationEndDerivationButtonProps {
    solicitationId: number,
    messageId: number,
    accesses?: SolicitationAccessView[]
}

function SolicitationEndDerivationButton({ solicitationId, messageId, accesses }: SolicitationEndDerivationButtonProps) {
    const {fetchData} = useAxios();
    const {snackbarSuccess} = useAction();
    
    const [openUnableDerivation, setOpenUnableDerivation] = useState<boolean>(false);
    const [openConfirmEndDerivation, setOpenConfirmEndDerivation] = useState<boolean>(false);
    
    const closeUnableDerivation = () => setOpenUnableDerivation(false);
    
    const closeConfirmEndDerivation = () => setOpenConfirmEndDerivation(false);
    
    const executeEndDerivation = () => {
        const dataExecute: ActionExecute = {
            [ActionExecuteFields.MessageId]: messageId,
            [ActionExecuteFields.WorkflowVariables]: [],
            [ActionExecuteFields.Observations]: '',
        } as ActionExecute;

        const actionId = ActionsTypes.SendAssistanceAnalysisToApproval

        fetchData(
            () => HttpAction.executeAction(actionId, dataExecute),
            true
        ).then(() => {
            closeConfirmEndDerivation();
            snackbarSuccess('La solicitud fue derivada correctamente');
            window.location.reload();
        })
    }
    
    const onHandleClick = () => {
        setOpenConfirmEndDerivation(true);
/*        let hasResults = false;
        if (accesses && accesses.length)
            hasResults = accesses.some(x =>
                x[SolicitationAccessViewFields.SolicitationAccessStateCode] === SolicitationAccessStateTypeCodes.Interested &&
                x[SolicitationAccessViewFields.ReportedTrackingOfferer]);

        if (!hasResults) 
            setOpenUnableDerivation(true); 
        else
            setOpenConfirmEndDerivation(true);*/
    }
    
    return (
        <React.Fragment>
            <Button variant={'contained'} size='small' onClick={onHandleClick}>
                Terminar derivación
            </Button>
            
            <SolicitationUnableDerivationDialog open={openUnableDerivation}
                                                solicitationId={solicitationId}
                                                onClose={closeUnableDerivation}
                                                onSubmit={(_) => {}}
            />
            
            <DialogAlert open={openConfirmEndDerivation}
                         onClose={closeConfirmEndDerivation}
                         onConfirm={executeEndDerivation}
                         title={"Terminar derivación"}
                         textContent={"¿Estás seguro que deseás terminar con la etapa de derivación de la solicitud?"}
            />
        </React.Fragment>
    )
}

export default SolicitationEndDerivationButton;