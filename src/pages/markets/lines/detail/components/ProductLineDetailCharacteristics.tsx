import React, {useContext} from "react";
import {ProductLineDetailContext} from "../ProductLinePymeDetail";
import {Card, CardContent, CardHeader} from "@mui/material";
import ProductLineDetailCharacteristicsTable from "./ProductLineDetailCharacteristicsTable";

export default function ProductLineDetailCharacteristics() {
    const { productLine } = useContext(ProductLineDetailContext);
    const inCarrito = window.location.toString().includes('/market/lines/carrito');
      
        return (
            <Card sx={{ 
                    paddingTop: inCarrito ? '20px' : '40px', 
                    paddingBottom: inCarrito ? '20px' : '40px', 
                    width: '100%', 
                    boxSizing: 'border-box' 
            }}
        >
            <CardHeader title={"Características"}
                        sx={{ padding: 0, borderBottom: 'none' }}
            />
            
            <CardContent>
                <ProductLineDetailCharacteristicsTable productLine={productLine} />
            </CardContent>
        </Card>
    )
}