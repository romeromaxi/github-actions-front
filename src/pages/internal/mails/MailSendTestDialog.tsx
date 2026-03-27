import {Dialog, DialogActions, DialogContent, Stack, Typography} from "@mui/material";
import {ControlledTextFieldFilled} from "components/forms";
import {useForm} from "react-hook-form";
import {MailSendTest, MailSendTestFields} from "types/general/generalMailData";
import {SendButton} from "components/buttons/Buttons";
import {HttpMailTemplate} from "http/configuration/httpMailTemplate";
import useAxios from "hooks/useAxios";
import {BaseResponseFields} from "types/baseEntities";
import {useAction} from "hooks/useAction";

interface MailSendTestDialogProps {
    body: string,
    subject: string,
    description: string,
    open: boolean,
    onClose: () => void
}

const MailSendTestDialog = ({body, subject, description, open, onClose} : MailSendTestDialogProps) => {
    const {fetchData} = useAxios()
    const {snackbarSuccess} = useAction() 
    const methods = useForm<MailSendTest>()
    
    const onSubmit = (data: MailSendTest) => {
        const dataSend = {
            ...data,
            [MailSendTestFields.Body]: body,
            [MailSendTestFields.Subject]: subject
        }
        
        fetchData(
            () => HttpMailTemplate.sendTest(dataSend),
            true
            ).then((r) => {
            if (!r[BaseResponseFields.HasError]) {
                snackbarSuccess(`El mail de prueba fue enviado a ${data[MailSendTestFields.SendTo]}`)
                onClose()
            }
        })
    }
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth={'xs'}
                fullWidth
        >
            <DialogContent>
                <Stack spacing={2}>
                    <Typography fontWeight={500} textAlign={'center'} fontSize={18}>
                        Ingresá el mail al que querés enviar esta plantilla de prueba
                    </Typography>
                    <ControlledTextFieldFilled control={methods.control}
                                               label={'Enviar a'}
                                               fullWidth
                                               name={MailSendTestFields.SendTo}
                    />
                </Stack>                
            </DialogContent>
            <DialogActions>
                <SendButton size={'small'} onClick={methods.handleSubmit(onSubmit)}>
                    Enviar
                </SendButton>
            </DialogActions>
        </Dialog>
    )
}


export default MailSendTestDialog