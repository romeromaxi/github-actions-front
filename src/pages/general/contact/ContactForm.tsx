import React, {useMemo, useState} from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {Button, Card, CardActions, CardContent, Grid, Stack} from "@mui/material";
import {SitesContactForm, SitesContactFormFields} from "types/sites/sitesTypes";
import {RequiredMailSchema, RequiredStringSchema} from "util/validation/validationSchemas";
import {ControlledTextFieldFilled} from "components/forms";
import { HttpSites } from "http/sites/httpSites";
import useAxios from "hooks/useAxios";
import {TypographyBase} from "components/misc/TypographyBase";
import {WrapperIcons} from "components/icons/Icons";
import { Check, X } from "@phosphor-icons/react";

enum ContactFormRequestStatus {
    Idle,
    Success,
    Failure
}

function ContactForm() {
    const { fetchData } = useAxios();
    const [requestStatus, setRequestStatus] = useState<ContactFormRequestStatus>(ContactFormRequestStatus.Idle);
    
    const formContactSchema = yup.object().shape({
        [SitesContactFormFields.Name]: RequiredStringSchema,
        [SitesContactFormFields.Mail]: RequiredMailSchema,
        [SitesContactFormFields.Message]: RequiredStringSchema
    })

    const { control, handleSubmit } = useForm<SitesContactForm>({
        resolver: yupResolver(formContactSchema)
    });

    const onSubmit = (data: SitesContactForm) => {
        const submitData: SitesContactForm = {
            ...data,
            [SitesContactFormFields.Subject]: "Solicitud de contacto"
        }

        fetchData(
            () => HttpSites.contact(submitData),
            true
        )
            .then(() => setRequestStatus(ContactFormRequestStatus.Success))
            .catch(() => setRequestStatus(ContactFormRequestStatus.Failure))
    }
    
    const componentForm = (
        <React.Fragment>
            <CardContent>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <TypographyBase variant={'subtitle2'} fontWeight={500}>Tu nombre</TypographyBase>
                        <ControlledTextFieldFilled control={control}
                                                   name={SitesContactFormFields.Name}
                                                   placeholder={'Dejanos tu nombre'}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TypographyBase variant={'subtitle2'} fontWeight={500}>Tu Email</TypographyBase>
                        <ControlledTextFieldFilled control={control}
                                                   name={SitesContactFormFields.Mail}
                                                   placeholder={'Ingresá tu correo electrónico'}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TypographyBase variant={'subtitle2'} fontWeight={500}>¿En qué te podemos ayudar?</TypographyBase>
                        <ControlledTextFieldFilled control={control}
                                                   name={SitesContactFormFields.Message}
                                                   placeholder={'Escribinos un mensaje'}
                                                   minRows={4}
                                                   multiline
                        />
                    </Grid>
                </Grid>
            </CardContent>

            <CardActions sx={{ marginTop: 4 }}>
                <Button color={'primary'} variant={'contained'}
                        onClick={handleSubmit(onSubmit)}
                >
                    Enviar
                </Button>
            </CardActions>
        </React.Fragment>
    )
    
    return (
        <Card>
            {
                requestStatus === ContactFormRequestStatus.Idle ?
                    componentForm
                    :
                    <ContactFormFeedbackMessage status={requestStatus}/>
            }
        </Card>
    )
}

interface ContactFormFeedbackMessageProps {
    status: ContactFormRequestStatus
}

function ContactFormFeedbackMessage(props: ContactFormFeedbackMessageProps) {
    const { icon, color, title, description} = useMemo(() => {
        switch (props.status) {
            case ContactFormRequestStatus.Success:
                return {
                    icon: Check,
                    color: '#008547', 
                    title: 'Tu duda fue enviada correctamente', 
                    description: 'Será respondida a la brevedad.'
                }
                
            case ContactFormRequestStatus.Failure:
                return {
                    icon: X,
                    color: 'error',
                    title: 'No pudimos procesar su solicitud',
                    description: 'Al parecer ocurrió un error. Por favor, intente en unos instantes.'
                }

            case ContactFormRequestStatus.Idle:
            default:
                return {
                    icon: null, color: '', title: null, description: null
                }
        }
    }, [props.status])
        
    if (props.status === ContactFormRequestStatus.Idle) return null;
    
    return (
        <CardContent>
            <Stack spacing={1.5} alignItems={'center'}>
                {
                    icon &&
                        <WrapperIcons Icon={icon} size={'md'} color={color} />
                }
                
                {
                    title &&
                        <TypographyBase fontWeight={600} color={color}>
                            {title}
                        </TypographyBase>
                }

                {
                    description && 
                        <TypographyBase variant={'subtitle2'} color={'text.lighter'} fontWeight={300}>
                            {description}
                        </TypographyBase>
                }
            </Stack>
        </CardContent>
    )
}

export default ContactForm;