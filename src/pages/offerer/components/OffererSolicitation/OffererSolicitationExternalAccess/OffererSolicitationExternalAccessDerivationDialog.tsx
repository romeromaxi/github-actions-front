import {
    SolicitationAccessView,
    SolicitationAccessViewFields
} from "../../../../../types/solicitations/solicitationData";
import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, Stack} from "@mui/material";
import React, {useState} from "react";
import BaseDialogTitle from "../../../../../components/dialog/BaseDialogTitle";


interface OffererSolicitationExternalAccessDerivationDialogProps {
    open: boolean,
    onClose: () => void,
    onSubmit: (derivation: SolicitationAccessView, attach: boolean) => void,
    derivationItem: SolicitationAccessView
}


const OffererSolicitationExternalAccessDerivationDialog = ({open, onClose, onSubmit, derivationItem} : OffererSolicitationExternalAccessDerivationDialogProps) => {
    const [attachDoc, setAttachDoc] = useState<boolean>(false)
    
    return (
        <Dialog open={open}
                onClose={onClose}
                fullWidth
                maxWidth={'sm'}
        >
            <BaseDialogTitle onClose={onClose} title='Consulta de derivación' />
            <DialogContent>
                <Stack spacing={2}>
                    <DialogContentText sx={{ whiteSpace: 'pre-line' }}>
                        {`¿Estás seguro que deseas enviarle la consulta de derivación a ${derivationItem[SolicitationAccessViewFields.FinancialEntityBusinessName]}? En caso de confirmar, se generará una solicitud entre LUC y el oferente, que podrás gestionar desde “Solicitudes”`}
                    </DialogContentText>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Checkbox checked={attachDoc} onChange={() => setAttachDoc(!attachDoc)} />
                        <DialogContentText>Adjuntar documentación validada</DialogContentText>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions sx={{display: 'flex', flexDirection: 'row'}}>
                <Button size={'medium'} onClick={onClose}>
                    Cancelar
                </Button>
                <Button size={'medium'} variant={'contained'} onClick={() => onSubmit(derivationItem, attachDoc)}>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default OffererSolicitationExternalAccessDerivationDialog