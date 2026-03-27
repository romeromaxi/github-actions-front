import BaseDialogTitle from "../../../../components/dialog/BaseDialogTitle";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import React from "react";
import {SendButton} from "../../../../components/buttons/Buttons";
import useAxios from "../../../../hooks/useAxios";
import {HttpProductLineChosen} from "../../../../http/line/httpProductLineChosen";
import {useSnackbarActions} from "../../../../hooks/useSnackbarActions";
import MarketLandingProductLinesAdvertising from "../../../markets/home/MarketLandingProductLinesAdvertising";


interface DialogProposalLinesApplyProps {
    open: boolean;
    onClose: () => void;
    onReload: () => void;
}


const DialogProposalLinesApply = ({open, onClose, onReload}: DialogProposalLinesApplyProps) => {
    const { fetchData } = useAxios()
    const { addSnackbarSuccess } = useSnackbarActions(); 
   const onApply = () => {
       fetchData(
           () => HttpProductLineChosen.applyProposal(),
           true
       ).then((r) => {
           addSnackbarSuccess('Las lineas propuestas se aplicaron correctamente');
           onReload();
           onClose();
       })
   }
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth={'lg'}
                fullWidth
        >
            <BaseDialogTitle onClose={onClose} title={'Aplicar líneas propuestas'}
                             subtitle={'Si queres confirmar estas lineas como destacadas, presiona el botón'}
            />
            <DialogContent>
                <MarketLandingProductLinesAdvertising hideViewAll loadLinesFn={HttpProductLineChosen.getProposals}/>
            </DialogContent>
            <DialogActions>
                <SendButton onClick={onApply}>
                    Aplicar
                </SendButton>
            </DialogActions>
        </Dialog>
    )
}


export default DialogProposalLinesApply;