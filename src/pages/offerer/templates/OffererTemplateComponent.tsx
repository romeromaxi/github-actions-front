import {Box, Grid, Stack} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import {CheckIcon, FileTextIcon, XIcon} from "lucide-react";
import {TypographyBase} from "components/misc/TypographyBase";
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import {FileSolicitationTemplate, FileSolicitationTemplateFields} from "types/files/filesDataCache";
import {Delete2IconButton, Edit2IconButton} from "components/buttons/Buttons";
import React, {useState} from "react";
import EditDialogTemplate from "./EditDialogTemplate";
import {DialogAlert} from "components/dialog";
import {HttpOffererTemplates} from "http/offerer/httpOffererTemplates";
import useAxios from "hooks/useAxios";
import {useSnackbarActions} from "hooks/useSnackbarActions";

interface OffererTemplateComponentProps {
    offererId: number,
    template: FileSolicitationTemplate,
    onReload: () => void
}

function OffererTemplateComponent({ offererId, template, onReload }: OffererTemplateComponentProps) {
    const { addSnackbarSuccess } = useSnackbarActions();
    const { fetchData } = useAxios();
    const [editing, setEditing] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    const onEdit = () => setEditing(true);

    const handleCloseEdit = () => setEditing(false);

    const handleDeleteClick = () => setOpenDelete(true);

    const handleCloseDelete = () => setOpenDelete(false);

    const handleConfirmDelete = () => {
        setOpenDelete(false);

        fetchData(
            () => HttpOffererTemplates.delete(offererId, template[EntityWithIdFields.Id]),
            true,
        ).then(() => {
            addSnackbarSuccess(`Se eliminó correctamente el documento #${template[EntityWithIdFields.Id]}`);
            onReload();
        });
    };
    
    return (
        <React.Fragment>

            <Grid container>
                <Grid item xs={12} md={6.5} sx={{ mb: { xs: 2, md: 0 } }}>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Box sx={{width: '42px', height: '42px', color: '#5B6560', backgroundColor: '#F2F2F2', borderRadius: '8.75px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <WrapperIcons Icon={FileTextIcon} color={'inherit'} size={'md'} />
                        </Box>
                        <Stack spacing={0.5} overflow='hidden'>
                            <TypographyBase variant='body2' fontWeight={600}>
                                {template[EntityWithIdAndDescriptionFields.Description]}
                            </TypographyBase>
                            <TypographyBase variant='body2' color={'text.lighter'} maxLines={1} tooltip>
                                {template[FileSolicitationTemplateFields.Detail]}
                            </TypographyBase>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={9} md={3.5} sx={{ mb: { xs: 2, md: 0 } }}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={1}>
                        <Stack spacing={0.5}>
                            <TypographyBase variant='body4' color='text.lighter'>Para personas humanas</TypographyBase>
                            {template[FileSolicitationTemplateFields.ForHumanPerson] ? (
                                <WrapperIcons Icon={CheckIcon} size={'md'} color={'success'} />
                            ) : (
                                <WrapperIcons Icon={XIcon} size={'md'} color={'text.tertiary'} />
                            )}
                        </Stack>
                        <Stack spacing={0.5}>
                            <TypographyBase variant='body4' color='text.lighter'>Para personas jurídicas</TypographyBase>
                            {template[FileSolicitationTemplateFields.ForLegalPerson] ? (
                                <WrapperIcons Icon={CheckIcon} size={'md'} color={'success'} />
                            ) : (
                                <WrapperIcons Icon={XIcon} size={'md'} color={'text.tertiary'} />
                            )}
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={3} md={2} sx={{ mb: { xs: 2, md: 0 } }}>
                    <Stack direction='row' alignItems='center' spacing={2} justifyContent='flex-end' mt={0.5}>
                        <Edit2IconButton variant='outlined' color='secondary' size="small"
                                         onClick={onEdit}
                        />
                        <Delete2IconButton variant='outlined' color='error' size='small'
                                           onClick={handleDeleteClick}
                        />
                    </Stack>
                </Grid>
            </Grid>

            {
                editing && (
                    <EditDialogTemplate open={editing} 
                                        onClose={handleCloseEdit} 
                                        offererId={offererId} 
                                        template={{ ...template }} 
                                        onReload={onReload}
                    />
            )}
            
            <DialogAlert open={openDelete} 
                         severity={'error'} 
                         title={'Eliminar archivo'} 
                         textContent={'¿Estás seguro de eliminar este archivo?'} 
                         onClose={handleCloseDelete} 
                         onConfirm={handleConfirmDelete} 
                         textConfirm={'Sí, eliminar'} 
            />
        </React.Fragment>
    )
}

export default OffererTemplateComponent;