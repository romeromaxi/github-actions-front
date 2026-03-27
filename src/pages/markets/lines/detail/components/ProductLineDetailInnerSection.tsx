import React, {useContext} from "react";
import {Skeleton} from "@mui/lab";
import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import {ProductLineDetailContext} from "../ProductLinePymeDetail";
import {TextInnerHtml} from "components/text/TextInnerHtml";
import {ProductLineDescriptionsFields, ProductLineFields} from "types/lines/productLineData";

interface ProductLineDetailInnerSectionProps {
    title: string,
    nameInnerText: ProductLineDescriptionsFields
}

export default function ProductLineDetailInnerSection({ title, nameInnerText}: ProductLineDetailInnerSectionProps) {
    const { productLine } = useContext(ProductLineDetailContext);
    const inCarrito = window.location.toString().includes('/market/lines/carrito');
  
    return (
        <Card sx={{ 
                   paddingTop: inCarrito ? '20px' : '40px', 
                   paddingBottom: '40px', 
                   width: '100%', 
                   boxSizing: 'border-box' 
            }}
        >
            <CardHeader title={title}
                        sx={{ padding: 0, borderBottom: 'none' }}
            />

            <CardContent>
                <Typography variant={'body2'}>
                    {
                        productLine ?
                            <TextInnerHtml html={productLine[ProductLineFields.ProductLineDescriptions]?.[nameInnerText] ?? ''} />
                            :
                            <Skeleton variant={'text'} width={'80%'} />
                    }
                </Typography>
            </CardContent>
        </Card>
    )
}