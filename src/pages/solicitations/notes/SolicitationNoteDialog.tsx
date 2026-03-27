import React, {useEffect} from 'react';
import {
    Dialog, DialogContent, DialogActions, Button, Stack,
} from '@mui/material';
import {useForm} from 'react-hook-form';
import {ControlledTextField} from 'components/forms';
import {
    SolicitationNote, SolicitationNoteFields, SolicitationNoteRelatedData, SolicitationNoteInsert
} from 'types/solicitations/solicitationsNotesData';
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import useAxios from "hooks/useAxios";
import {HttpSolicitationsNotes} from "http/solicitations/httpSolicitationsNotes";
import LabelFormBase from "components/forms/LabelFormBase";

interface SolicitationNoteDialogProps {
    open: boolean,
    onClose: () => void,
    note?: SolicitationNote,
    onReload: () => void,
    solicitationId: number,
    relatedData?: SolicitationNoteRelatedData
}

const SolicitationNoteDialog = ({
    open, onClose, note, onReload, solicitationId, relatedData
}: SolicitationNoteDialogProps) => {
    const isEdit = Boolean(note);
    const {fetchData} = useAxios();

    const {control, handleSubmit, reset, formState} = useForm<SolicitationNoteInsert>({
        defaultValues: {
            [SolicitationNoteFields.Message]: note?.[SolicitationNoteFields.Message] || '',
            [SolicitationNoteFields.RelatedDataCode]: relatedData?.[SolicitationNoteFields.RelatedDataCode],
            [SolicitationNoteFields.RelatedDataId]: relatedData?.[SolicitationNoteFields.RelatedDataId]
        },
    });

    useEffect(() => {
        reset({[SolicitationNoteFields.Message]: note?.[SolicitationNoteFields.Message] || ''});
    }, [note, open, reset]);

    const handleClose = () => {
        onClose();
        onReload();
    }

    const submitHandler = (data: SolicitationNoteInsert) => {
        const dataToSubmit = {
            ...data,
            [SolicitationNoteFields.RelatedDataCode]: relatedData?.[SolicitationNoteFields.RelatedDataCode],
            [SolicitationNoteFields.RelatedDataId]: relatedData?.[SolicitationNoteFields.RelatedDataId]
        }
        
        if (!isEdit) {
            fetchData(
                () => HttpSolicitationsNotes.insert(solicitationId, dataToSubmit),
                true
            ).then(handleClose);
        } else {
            // endpoint de edición
        }
    };

    const onDelete = () => console.log('onDelete');

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <BaseDialogTitle
                onClose={onClose}
                title={isEdit ? 'Editar nota' : 'Añadir nota'}
            />
            <DialogContent>
                <Stack spacing={0.8}>
                    <LabelFormBase label={'Notas'} />
                    
                    <ControlledTextField
                        name={SolicitationNoteFields.Message}
                        control={control}
                        fullWidth
                        multiline
                        minRows={6}
                        placeholder="Escribe aquí tu nota"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                {isEdit ? (
                    <Stack direction="row" alignItems={'center'} justifyContent={'space-between'}
                           sx={{width: '100% !important'}}>
                        <Button
                            variant="text"
                            color="error"
                            onClick={onDelete}
                        >
                            Eliminar
                        </Button>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Button variant="outlined" color="secondary" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(submitHandler)}
                                disabled={formState.isSubmitting || !formState.isDirty || !formState.isValid}
                            >
                                Guardar cambios
                            </Button>
                        </Stack>
                    </Stack>
                ) : (
                    <Stack direction="row" alignItems="center" spacing={2}
                           sx={{width: '100%', justifyContent: 'flex-end'}}>
                        <Button variant="outlined" color="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit(submitHandler)}
                            disabled={formState.isSubmitting || !formState.isDirty || !formState.isValid}
                        >
                            Añadir nota
                        </Button>
                    </Stack>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SolicitationNoteDialog;
