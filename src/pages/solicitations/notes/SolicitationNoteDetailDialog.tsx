import React from "react";
import {Dialog, DialogContent, DialogProps, Stack} from "@mui/material";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {DataWithLabel} from "components/misc/DataWithLabel";
import {SolicitationNote, SolicitationNoteFields} from "types/solicitations/solicitationsNotesData";
import {dateFormatter} from "util/formatters/dateFormatter";

interface SolicitationNoteDetailDialogProps extends Omit<DialogProps, 'open'> {
    open: boolean;
    note: SolicitationNote | null;
    onClose: () => void;
}

function SolicitationNoteDetailDialog({ open, note, onClose, ...rest }: SolicitationNoteDetailDialogProps) {
    if (!note) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" {...rest}>
            <BaseDialogTitle
                onClose={onClose}
                title="Detalle de la nota"
            />
            <DialogContent>
                <Stack spacing={3}>
                    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems='center'>
                        <DataWithLabel
                            label="Creada por"
                            data={note[SolicitationNoteFields.UserBusinessName]}
                        />
                        <DataWithLabel
                            label="Fecha de creación"
                            data={dateFormatter.toShortDate(note[SolicitationNoteFields.CreationDate])}
                        />
                    </Stack>
                    <DataWithLabel
                        label="Nota"
                        data={note[SolicitationNoteFields.Message]}
                    />
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default SolicitationNoteDetailDialog;