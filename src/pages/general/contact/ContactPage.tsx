import { Stack } from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import ContactForm from "pages/general/contact/ContactForm";

function ContactPage() {
    return (
        <Stack width={1} paddingX={{ sm: 6, md: 18 }}>
            <Stack spacing={4}>
                <Stack spacing={2}>
                    <TypographyBase fontFamily={'Geist'} textTransform={'uppercase'}
                                    fontWeight={600}
                                    letterSpacing={'-0.01em'}
                                    color={'#399D14'}
                    >
                        Contactanos
                    </TypographyBase>

                    <TypographyBase variant={'h2'} fontWeight={600}>
                        ¿Tenés dudas? Conversemos
                    </TypographyBase>

                    <TypographyBase color={'text.lighter'} fontWeight={300}>
                        Completá el formulario y alguien de LUC te va a escribir pronto.
                    </TypographyBase>
                </Stack>

                <ContactForm />
            </Stack>
        </Stack>
    )
}

export default ContactPage;