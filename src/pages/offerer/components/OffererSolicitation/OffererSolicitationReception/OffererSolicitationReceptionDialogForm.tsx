import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import BaseDialogTitle from "../../../../../components/dialog/BaseDialogTitle";
import React from "react";
import {useForm} from "react-hook-form";
import OffererSolicitationAnalysisFormDialog
    from "../OffererSolicitationAssessment/OffererSolicitationAnalysisFormDialog";
import {SolicitationViewDTO} from "../../../../../types/solicitations/solicitationData";


interface OffererSolicitationReceptionDialogFormProps {
    open: boolean,
    onClose: () => void,
    solicitation: SolicitationViewDTO,
    suitable: boolean
}


const OffererSolicitationReceptionDialogForm = ({open, onClose, solicitation, suitable} :OffererSolicitationReceptionDialogFormProps) => {
    
    const methods = useForm()
    
    const onSubmit = (a: any) => {}
    
    return (
        /*
        <Dialog open={open}
                onClose={onClose}
                maxWidth={'sm'}
                fullWidth
        >
            <BaseDialogTitle title={'Formulario de respuesta'} onClose={onClose} />
            <DialogContent>
                
            </DialogContent>
            <DialogActions>
                <Button variant={'contained'} color={'primary'} onClick={methods.handleSubmit(onSubmit)}>
                    Enviar para aprobación
                </Button>
            </DialogActions>
        </Dialog>
         */
        <OffererSolicitationAnalysisFormDialog open={open}
                                               onClose={onClose}
                                               solicitation={solicitation}
                                               justView={false}
                                               onSave={onSubmit}
                                               suitable={suitable}
                                               data
        />
                                               
    )
}


export default OffererSolicitationReceptionDialogForm