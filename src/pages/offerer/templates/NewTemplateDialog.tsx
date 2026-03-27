import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    Typography,
} from '@mui/material';
import {
    OffererTemplateInsert,
    OffererTemplateInsertFields,
} from '../../../types/offerer/offererData';
import {useForm} from 'react-hook-form';
import {useEffect, useState} from 'react';
import {HttpOffererTemplates} from '../../../http/offerer/httpOffererTemplates';
import useAxios from '../../../hooks/useAxios';
import {useAction} from '../../../hooks/useAction';
import {ControlledTextFieldFilled} from '../../../components/forms';
import BaseDialogTitle from '../../../components/dialog/BaseDialogTitle';
import {PersonTypes} from '../../../types/person/personEnums';
import {SaveButton} from '../../../components/buttons/Buttons';
import {
    EntityWithIdAndDescription,
    EntityWithIdAndDescriptionFields,
} from '../../../types/baseEntities';
import {HttpCachePerson} from '../../../http';
import {Skeleton} from '@mui/lab';

interface NewTemplateDialogProps {
    open: boolean;
    onClose: () => void;
    offererId: number;
    onReload: () => void;
}

const NewTemplateDialog = ({
                               open,
                               onClose,
                               offererId,
                               onReload,
                           }: NewTemplateDialogProps) => {
    const methods = useForm<OffererTemplateInsert>();
    const [personTypes, setPersonTypes] =
        useState<EntityWithIdAndDescription[]>();
    const [forHuman, setForHuman] = useState<boolean>(false);
    const [forLegal, setForLegal] = useState<boolean>(false);
    const {fetchData} = useAxios();
    const {snackbarSuccess} = useAction();

    useEffect(() => {
        if (open) {
            methods.reset({
                [OffererTemplateInsertFields.Detail]: undefined,
                [OffererTemplateInsertFields.Description]: undefined,
                [OffererTemplateInsertFields.PersonTypeCods]: [],
            });

            HttpCachePerson.getTypes().then((r) => setPersonTypes(r));
        }
    }, [open]);

    const onSubmit = (data: OffererTemplateInsert) => {
        let codes: number[] = [];

        if (forLegal) {
            codes.push(PersonTypes.Legal);
        }

        if (forHuman) {
            codes.push(PersonTypes.Physical);
        }

        const submitData: OffererTemplateInsert = {
            ...data,
            [OffererTemplateInsertFields.PersonTypeCods]: codes,
        };

        fetchData(
            () => HttpOffererTemplates.insert(offererId, submitData),
            true,
        ).then(() => {
            snackbarSuccess('El documento fue dado de alta correctamente');
            onReload();
            onClose();
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={'sm'}>
            <BaseDialogTitle onClose={onClose} title={`Nuevo documento`}/>
            <DialogContent>
                <Stack spacing={2}>
                    <ControlledTextFieldFilled
                        control={methods.control}
                        name={OffererTemplateInsertFields.Description}
                        label={'Descripción'}
                        fullWidth
                    />
                    <ControlledTextFieldFilled
                        control={methods.control}
                        name={OffererTemplateInsertFields.Detail}
                        label={'Detalle'}
                        fullWidth
                        multiline
                        rows={3}
                    />
                    <Stack
                        direction="row"
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        {personTypes
                            ? personTypes.map((type) => (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Checkbox
                                        checked={
                                            type[EntityWithIdAndDescriptionFields.Id] ==
                                            PersonTypes.Legal
                                                ? forLegal
                                                : forHuman
                                        }
                                        onChange={() => {
                                            type[EntityWithIdAndDescriptionFields.Id] ==
                                            PersonTypes.Legal
                                                ? setForLegal(!forLegal)
                                                : setForHuman(!forHuman);
                                        }}
                                    />
                      
                                    <Typography>{`Para personas ${type[EntityWithIdAndDescriptionFields.Description].toLowerCase()}`}</Typography>
                                </Stack>
                            ))
                            : Array.from({length: 2}).map(() => <Skeleton width={80}/>)}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <SaveButton onClick={methods.handleSubmit(onSubmit)}>
                    Guardar
                </SaveButton>
            </DialogActions>
        </Dialog>
    );
};

export default NewTemplateDialog;
