import {Stack} from "@mui/material";
import {ControlledTextFieldFilled} from "../../../components/forms";
import React from "react";
import {useForm} from "react-hook-form";
import {BackButton, ConfirmButton} from "../../../components/buttons/Buttons";
import {userStorage} from "../../../util/localStorage/userStorage";
import {HttpSites} from "../../../http/sites/httpSites";
import {SitesContactForm, SitesContactFormFields} from "../../../types/sites/sitesTypes";
import useAxios from "../../../hooks/useAxios";
import {useAction} from "../../../hooks/useAction";
import {RequiredStringSchema} from "../../../util/validation/validationSchemas";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";

interface NewCompanyValidationErrorFormType {
    [SitesContactFormFields.Subject]: string,
    [SitesContactFormFields.Message]: string,
}

interface NewCompanyValidationErrorFormProps {
    onBack: () => void,
    afterSubmit: () => void
}

const NewCompanyValidationErrorForm = ({onBack, afterSubmit} : NewCompanyValidationErrorFormProps) => {
    
    const newCompanyValidationErrorSchema = yup.object().shape({
        [SitesContactFormFields.Subject]: RequiredStringSchema,
        [SitesContactFormFields.Message]: RequiredStringSchema
    })
    
    const methods = useForm<NewCompanyValidationErrorFormType>({
        resolver: yupResolver(newCompanyValidationErrorSchema)
    })
    const userName = userStorage.getFullName()
    const userMail = userStorage.getUserMail()
    const {snackbarSuccess} = useAction()
    const {fetchData} = useAxios()
    
    const onSubmit = (data: NewCompanyValidationErrorFormType) => {
        const submitData: SitesContactForm = {
            ...data,
            [SitesContactFormFields.Name]: userName || '',
            [SitesContactFormFields.Mail]: userMail || ''
        }
        
        
        fetchData(
            () => HttpSites.contact(submitData),
            true
        ).then(() => {
            afterSubmit()
            snackbarSuccess('El formulario de contacto se ha enviado con éxito')
        })
    }
    
    return (
        <Stack spacing={1} sx={{width: '100%'}}>
            <ControlledTextFieldFilled control={methods.control}
                                       name={SitesContactFormFields.Subject}
                                       fullWidth
                                       label={'Asunto'}
            />
            <ControlledTextFieldFilled control={methods.control}
                                       name={SitesContactFormFields.Message}
                                       fullWidth
                                       multiline
                                       rows={3}
                                       label={'Mensaje'}
            />
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <BackButton size={'small'} onClick={onBack}>Volver</BackButton>
                <ConfirmButton onClick={methods.handleSubmit(onSubmit)} size={'small'}>Contactar</ConfirmButton> 
            </Stack>
        </Stack>
    )
}


export default  NewCompanyValidationErrorForm