import {Dialog, DialogContent, Stack, Typography} from "@mui/material";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {ControlledCheckBox} from "components/forms";
import {SendButton, UpdateButton} from "components/buttons/Buttons";
import React from "react";
import useAxios from "hooks/useAxios";
import {useForm} from "react-hook-form";
import {HttpCompany} from "http/index";
import {useAction} from "hooks/useAction";
import {FileBaseInsert, FileBaseInsertFields} from "types/files/filesData";
import {CompanyApprovalFormFields} from "types/company/companyData";


interface NewCompanySameCuitDialogProps {
    open: boolean;
    companyId: number;
    onClose: () => void;
    onSubmit: () => void;
    powerOfAttorneyFile?: FileBaseInsert;
}


interface NewCompanySameCuitDialogForm {
    checked: boolean;
}

const NewCompanySameCuitDialog = ({open, onClose, companyId, onSubmit, powerOfAttorneyFile} : NewCompanySameCuitDialogProps) => {
    const { fetchData } = useAxios();
    const { snackbarSuccess } = useAction();
    const { control, handleSubmit, watch } = useForm<NewCompanySameCuitDialogForm>();
    const watchCheck = watch('checked');
    
    const onHandleSubmit = (data: any) => {
        if (!!powerOfAttorneyFile) {
            fetchData(
                () => HttpCompany.changeResponsible(companyId),
                true
            ).then((r) => {
                let formData: FormData = new FormData();
                const codModulo = 1;
                const codOrigen = 1;
                formData.append(
                    CompanyApprovalFormFields.FileAble,
                    powerOfAttorneyFile.file,
                    powerOfAttorneyFile.descArchivo,
                );
                formData.append(FileBaseInsertFields.ModuleCode, codModulo.toString());
                formData.append(FileBaseInsertFields.OriginCode, codOrigen.toString());
                fetchData(() => HttpCompany.requestApproval(companyId, formData))
                    .then((r) => {
                        if (!r.tieneError) {
                            onSubmit()
                            snackbarSuccess('Fuiste designado como titular de la empresa y la documentación fue enviada correctamente')
                        }
                    })
            })
        }
    }
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth='sm'
                fullWidth
        >
            <BaseDialogTitle onClose={onClose} title='Los CUITs coinciden' />
            <DialogContent>
                <Stack spacing={2} justifyContent='center'>
                    <Typography>
                        El CUIT que ingresaste coincide con el de tu perfil, ingresá el CUIT de otra persona o indica que sos el Responsable
                    </Typography>
                    <ControlledCheckBox label={'Sí, soy el responsable'}
                                        name={'checked'}
                                        control={control}
                    />
                    <Stack
                        direction={'row'}
                        spacing={{ xs: 2, sm: 4, md: 8 }}
                        justifyContent={'space-between'}
                    >
                        <UpdateButton color={'inherit'} fullWidth onClick={onClose}>
                            Ingresar otro CUIT
                        </UpdateButton>
                        <SendButton onClick={handleSubmit(onHandleSubmit)} fullWidth disabled={!watchCheck}>
                            Confirmar
                        </SendButton>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}


export default NewCompanySameCuitDialog