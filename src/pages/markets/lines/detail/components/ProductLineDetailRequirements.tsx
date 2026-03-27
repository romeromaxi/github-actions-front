import React, {useContext, useEffect, useState} from "react";
import {Skeleton} from "@mui/lab";
import {Card, CardContent, CardHeader, Table, TableCell, TableRow} from "@mui/material";
import {ProductLineDetailContext} from "../ProductLinePymeDetail";
import {ProductLineRequisiteDescriptionView} from "types/lines/productLineData";
import { HttpProductLineRequisite } from "http/index";
import ProductLineDetailRequirementsRowGroup from "./ProductLineDetailRequirementsRowGroup";

export default function ProductLineDetailRequirements() {
    const { idProductLine } = useContext(ProductLineDetailContext);
    const [requisitesDescription, setRequisitesDescription] = useState<ProductLineRequisiteDescriptionView[]>();
    const inCarrito = window.location.toString().includes('/market/lines/carrito');

    useEffect(() => {
        if (idProductLine)
            HttpProductLineRequisite.getRequisiteDescriptionByProductLine(idProductLine)
                .then(setRequisitesDescription);
    }, [idProductLine]);

        return (
            <Card sx={{ 
                    paddingTop: inCarrito ? '20px' : '40px', 
                    paddingBottom: inCarrito ? '20px' : '40px', 
                    width: '100%', 
                    boxSizing: 'border-box' 
                }}>
            <CardHeader title={'¿Para qué empresas está destinada la línea?'}
                        sx={{ padding: 0, borderBottom: 'none' }}
            />

            <CardContent>
                <Table variant={'interleaving-style'}>
                    {
                      requisitesDescription ?
                        requisitesDescription.length ? 
                          requisitesDescription.map((r, idx) => (
                            <ProductLineDetailRequirementsRowGroup key={`productLineRequisiteRowGroup_${idx}`} 
                                                                   requisiteDescription={r} />
                            ))
                          : 
                          <div></div> 
                        : 
                        Array.from({ length: 4 }).map((_, idx) => (
                          <TableRow key={`LoadingProductLineDetailRequirements_${idx}`}>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                          </TableRow>
                        ))
                    }
                </Table>
            </CardContent>
        </Card>
    )
}

/*
<Table>
  {Array.from({ length: 4 }).map((_, idx) => (
    <StyledTableRow key={`LoadingProductLineDetailTable_${idx}`}>
      <StyledTableCell>
        <Skeleton />
      </StyledTableCell>
    </StyledTableRow>
  ))}
</Table>*/
