import {Box, Button, Stack, Typography, useMediaQuery} from "@mui/material";
import { ArrowRight } from "@phosphor-icons/react";
import {useNavigate} from "react-router-dom";
import {WrapperIcons} from "../../../../components/icons/Icons";
import React, {ReactNode} from "react";


interface ProductLinesWithoutGroupProps {
    customAction?: ReactNode
}

const ProductLinesWithoutGroup = ({customAction} : ProductLinesWithoutGroupProps) => {
    const navigate = useNavigate()
    
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const gotoAssistedSearch = () => navigate('/market/luc?redirect=ac08111f742d99c360628ede782615800ab2b5e0ef3fbd90ed919c0b919447a9b60e27623ee78fcc7021a47e7144df4ec044368bbd4452bb8e80e90600778c72e1721c923214746df1a57d1c1577c2db')
   
    return (
        <Box sx={{
            padding: '24px',
            gap: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#016938',
            backgroundImage: 'url(/images/allies-texture.png)',
            borderRadius: '32px'
        }}>
            <Box sx={{
                gap: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: isMobileScreenSize ? '90%' : '55%'
            }}>
                {/*<Box
                    component="img"
                    src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                    mt={2}
                    sx={{
                        width: '60%',
                        height: 'auto',
                    }}
                />*/}

                <Typography fontSize={24} fontWeight={600} textAlign={'center'} color='white'>
                    Parece que no hay una opción para esta búsqueda en la tienda en este momento
                </Typography>
                <Typography textAlign={'center'} color='white'>
                    Podés enviar tu solicitud a la Búsqueda asistida LUC para que nuestro equipo la analice y te ayude a contactar a quien la ofrezca, aunque no estén visibles en la tienda.
                </Typography>
                <Stack direction='row' alignItems='center' spacing={2}>
                    {
                        customAction ?
                            customAction
                            :
                            <Button sx={{
                                color: '#008547 !important',
                                backgroundColor: 'white !important',
                                fontFamily: 'Geist',
                                fontWeight: 600,
                                lineHeight: '140%',
                                order: 2,
                            }}
                                    variant="contained"
                                    fullWidth
                                    onClick={gotoAssistedSearch} size={'small'}
                                    endIcon={<WrapperIcons Icon={ArrowRight} size={'sm'} /> }
                            >
                                Búsqueda asistida LUC
                            </Button>
                    }
                </Stack>
            </Box>
        </Box>
    )
}


export default ProductLinesWithoutGroup