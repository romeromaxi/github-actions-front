import {useForm} from "react-hook-form";
import {Grid, Stack, Typography} from "@mui/material";
import {ControlledTextFieldFilled} from "../../components/forms";
import {NextButton} from "../../components/buttons/Buttons";


const ContactForm = () => {
    const methods = useForm()
    
    const onSubmit = (data: any) => {
        console.log("d", data)
    }
    
    return (
        <Grid container spacing={4} justifyContent={'center'} my={4}
              sx={{ padding: '40px 10px', borderRadius: '32px', backgroundColor: '#F7FAFC'}}
        >
            <Grid item xs={12}>
                <Stack lineHeight={'140%'}>
                    <Typography variant={'h3'} fontWeight={500} textAlign={'center'}>
                        ¿No encontrás lo que estás buscando?
                    </Typography>
                    <Typography variant={'h3'} fontWeight={500} textAlign={'center'}>
                        Te ayudamos
                    </Typography>
                </Stack>
            </Grid>
            <Grid item md={3}>
            </Grid>
            <Grid item xs={12} md={6}>
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <ControlledTextFieldFilled control={methods.control}
                                               name={'mailContacto'}
                                               placeholder={'vos@tuempresa.com'}
                    />
                    <NextButton size={'small'} onClick={methods.handleSubmit(onSubmit)} fullWidth>
                        Quiero que me asesoren
                    </NextButton>
                </Stack>
            </Grid>
            <Grid item md={3}>
            </Grid>
        </Grid>
    )
}


export default ContactForm