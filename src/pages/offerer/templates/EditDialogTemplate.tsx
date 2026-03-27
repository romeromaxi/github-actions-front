import {
    FileSolicitationTemplate,
    FileSolicitationTemplateFields,
} from '../../../types/files/filesDataCache';
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
import {
    EntityWithIdAndDescription,
    EntityWithIdAndDescriptionFields,
    EntityWithIdFields,
} from '../../../types/baseEntities';
import useAxios from '../../../hooks/useAxios';
import {useAction} from '../../../hooks/useAction';
import {ControlledTextFieldFilled} from '../../../components/forms';
import BaseDialogTitle from '../../../components/dialog/BaseDialogTitle';
import {PersonTypes} from '../../../types/person/personEnums';
import {HttpCachePerson} from '../../../http';
import {Skeleton} from '@mui/lab';
import {UpdateButton} from '../../../components/buttons/Buttons';

interface EditDialogTemplateProps {
    open: boolean;
    onClose: () => void;
    template: FileSolicitationTemplate;
    offererId: number;
    onReload: () => void;
}

const EditDialogTemplate = ({
                                open,
                                onClose,
                                template,
                                offererId,
                                onReload,
                            }: EditDialogTemplateProps) => {
    const methods = useForm<OffererTemplateInsert>();
    const [personTypes, setPersonTypes] =
        useState<EntityWithIdAndDescription[]>();
    const [forHuman, setForHuman] = useState<boolean>(
        template[FileSolicitationTemplateFields.ForHumanPerson],
    );
    const [forLegal, setForLegal] = useState<boolean>(
        template[FileSolicitationTemplateFields.ForLegalPerson],
    );
    const {fetchData} = useAxios();
    const {snackbarSuccess} = useAction();

    useEffect(() => {
        if (open) {
            methods.reset({
                [OffererTemplateInsertFields.Detail]:
                    template[FileSolicitationTemplateFields.Detail],
                [OffererTemplateInsertFields.Description]:
                    template[EntityWithIdAndDescriptionFields.Description],
                [OffererTemplateInsertFields.PersonTypeCods]:
                    template[FileSolicitationTemplateFields.PersonTypeCodes],
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
            () =>
                HttpOffererTemplates.update(
                    offererId,
                    template[EntityWithIdFields.Id],
                    submitData,
                ),
            true,
        ).then(() => {
            snackbarSuccess('El documento fue actualizado correctamente');
            onReload();
            onClose();
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={'sm'}>
            <BaseDialogTitle
                onClose={onClose}
                title={`Editar documento #${template[EntityWithIdAndDescriptionFields.Id]}`}
            />
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
                <UpdateButton onClick={methods.handleSubmit(onSubmit)}>
                    Actualizar
                </UpdateButton>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialogTemplate;
