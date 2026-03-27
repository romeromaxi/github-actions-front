import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
// @ts-ignore
import lucTeOrienta from "assets/img/market/home/02LUCteOrienta.png"

const ProductLinesHelpBanner = () => {
    const navigate = useNavigate()
    
    return (
        <Box sx={{
            padding: '40px',
            borderRadius: '32px',
            backgroundColor: 'white',
            marginTop: '12px'
        }}>
            <Grid container spacing={3}>
                <Grid item md={7} xs={12}>
                    <Stack spacing={2}>
                        <Typography fontSize={24} fontWeight={500}>
                            Te ayudamos a encontrar la mejor opción para tu empresa
                        </Typography>
                        <Typography color={'text.lighter'}>
                            LUC te acerca las mejores opciones de financiamiento y aval para tu empresa
                        </Typography>
                        <Button variant={'outlined'} color={'secondary'} sx={{width: 1/2}} onClick={() => navigate('/market/luc-te-orienta?redirect=ac08111f742d99c360628ede78261580dfb05dec36a39b209e41003262f5fdd8f703eef5c6848a8a98ca46f05a2d5ed4d83bbedc823f4c14b7a8c824f8be672f1a046c785baa1804a7b87f7b4dfd36a7')}>
                            Quiero que me asesoren
                        </Button>
                    </Stack>
                </Grid>
                <Grid item md={5} xs={12}>
                    <Box component="img" src={lucTeOrienta} sx={{width: '100%', height: 'fit-content'}} />
                </Grid>
            </Grid>
        </Box>    
    )
}


export default ProductLinesHelpBanner