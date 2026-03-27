import React, {useContext} from "react";
import {ProductLineDetailContext} from "../ProductLinePymeDetail";
import {Card, CardContent, CardHeader, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import {ProductLineFields} from "types/lines/productLineData";
import {Skeleton} from "@mui/lab";
import {OffererLogoWithName} from "../../../../offerer/components/OffererLogo";

interface ProductLineDetailTitleProps {
  hideActions?: boolean
}

export default function ProductLineDetailTitle({ hideActions }: ProductLineDetailTitleProps) {
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down('sm'));

    const { productLine } = useContext(ProductLineDetailContext);
    
    const lineTitle = productLine ?
        // Se usa h3 pero con fuente mas grande, para mantener por ahora la fuente WorkSans
        <Typography variant={'h3'} fontSize={isMobileScreenSize ? '1.4rem' : '1.7rem'} fontWeight={500} sx={{ wordWrap: 'break-word' }}>{productLine[ProductLineFields.LineLarge]?.toUpperCase()}</Typography> :
        <Skeleton variant={'text'} width={'80%'} />;

    const inCarrito = window.location.toString().includes('/market/lines/carrito');
  
    return (
        <Card sx={{ 
            paddingTop: inCarrito ? '20px' : '40px', 
            paddingBottom: '40px', 
            width: '100%', 
            boxSizing: 'border-box' 
        }}>
            <CardHeader
                title={
                    <OffererLogoWithName offererId={productLine ? productLine[ProductLineFields.OffererId] : undefined}
                                         offererBusinessName={productLine?.[ProductLineFields.OffererBusinessName]}
                                         withTooltip
                                         NameProps={{
                                             fontSize: isMobileScreenSize ? '0.875rem' : '1.125rem',
                                             sx: {
                                                 whiteSpace: isMobileScreenSize ? 'normal' : 'nowrap',
                                                 overflow: 'hidden',
                                                 textOverflow: 'ellipsis',
                                                 display: '-webkit-box',
                                                 WebkitLineClamp: isMobileScreenSize ? 2 : 1,
                                                 WebkitBoxOrient: 'vertical',
                                             }
                                         }}
                    />
                }
                sx={{ padding: '0px !important', borderBottom: 'none' }}
            />
            
            <CardContent>
                <Stack mt={3}>
                    {lineTitle}
                </Stack>
            </CardContent>
        </Card>
    )
}