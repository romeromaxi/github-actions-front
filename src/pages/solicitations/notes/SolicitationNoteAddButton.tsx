import React, {useState} from "react";
import {Button} from "@mui/material";
import {PlusIcon} from "lucide-react";
import SolicitationNoteDialog from "./SolicitationNoteDialog";
import {SolicitationNoteRelatedData} from "types/solicitations/solicitationsNotesData";

interface SolicitationNoteAddButtonProps {
    solicitationId: number,
    onReloadNotes: () => void,
    relatedData?: SolicitationNoteRelatedData
}

function SolicitationNoteAddButton({ solicitationId, onReloadNotes, relatedData }: SolicitationNoteAddButtonProps) {
    const [open, setOpen] = useState<boolean>(false);
    
    const handleOpenDialog = () => setOpen(true);
    
    const handleCloseDialog = () => setOpen(false);
    
    return (
        <React.Fragment>
            <Button variant={'outlined'}
                    color={'secondary'}
                    size={'small'}
                    startIcon={<PlusIcon />}
                    onClick={handleOpenDialog}
            >
                Añadir nota
            </Button>

            <SolicitationNoteDialog open={open}
                                    solicitationId={solicitationId}
                                    onClose={handleCloseDialog}
                                    onReload={onReloadNotes}
                                    relatedData={relatedData}
            />
        </React.Fragment>
    )
}

export default SolicitationNoteAddButton;