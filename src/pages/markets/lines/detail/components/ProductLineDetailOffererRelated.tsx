import React, {useContext} from "react";
import {Card, CardContent, CardHeader, Table, TableCell, TableRow} from "@mui/material";
import {ProductLineDetailContext} from "../ProductLinePymeDetail";
import {Skeleton} from "@mui/lab";
import {ProductLineFields} from "types/lines/productLineData";
import {TypographyBase} from "components/misc/TypographyBase";

function ProductLineDetailOffererRelated() {
  const { productLine } = useContext(ProductLineDetailContext);
  const inCarrito = window.location.toString().includes('/market/lines/carrito');
  
    return (
        <Card sx={{ 
                paddingTop: inCarrito ? '20px' : '40px', 
                paddingBottom: '40px', 
                width: '100%', 
                boxSizing: 'border-box' 
            }}>
      <CardHeader title={'Entidades en convenio con esta línea'}
                  sx={{ padding: 0, borderBottom: 'none' }}
      />

      <CardContent>
        {
          productLine ?
            productLine[ProductLineFields.FinancialEntityRelatedDesc] ?
              <Table variant={'interleaving-style'} sx={{ tableLayout: 'fixed' }}>
                {
                  productLine[ProductLineFields.FinancialEntityRelatedDesc]?.split(', ').map((o, idx) => (
                    <TableRow>
                      <TableCell align={'left'}>
                        <TypographyBase variant={'body2'}
                                        tooltip
                                        maxLines={1}
                        >
                          {o}
                        </TypographyBase>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </Table>
              :
              <div style={{fontStyle: 'italic'}}>Sin información.</div>
            :
            <Skeleton variant={'text'} width={'80%'} />
        }
        
      </CardContent>
    </Card>
  )
}

export default ProductLineDetailOffererRelated;