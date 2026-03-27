import React, {useEffect, useState} from "react";
import {Grid, Stack, Table, TableCell, TableRow, TooltipProps, Typography, useMediaQuery, useTheme} from "@mui/material";
import {ProductLineFields, ProductLineViewDetail} from "types/lines/productLineData";
import {ProductLineTemplate, ProductLineTemplateFields} from "types/productLineTemplate/ProductLineTemplateData";
import {Skeleton} from "@mui/lab";
import useProductLineTemplate from "hooks/useProductLineTemplate";
import {TypographyBase} from "components/misc/TypographyBase";
import {EntityWithIdFields} from "types/baseEntities";
import { typographyStyles } from "./TypographyStyles";

interface ProductLineDetailCharacteristicsTableProps {
    productLine?: ProductLineViewDetail
}

interface ProductLineDetailCharacteristicRowProps {
    label: string,
    value: string,
    labelTooltip?: string
}

function ProductLineDetailCharacteristicRow({ label, value, labelTooltip }: ProductLineDetailCharacteristicRowProps) {
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <TableRow sx={{
      position: 'relative',
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      padding: { xs: '16px 16px', sm: '0' },
    }}>
      <TypographyBase
        variant={typographyStyles.variants.tableLabel(isMobileScreenSize)}
        sx={{
          ...(typographyStyles.tableLabel)
        }}
      >
        {label}
      </TypographyBase>

      <TableCell
        align="left"
        sx={{
          width: { xs: '100%', sm: '50%' },
          border: 'none',
          display: { xs: 'none', sm: 'table-cell' },
        }}
      >
        {label}
      </TableCell>

      <TableCell
        sx={{
          width: { xs: '100%', sm: '50%' },
          padding: { xs: '8px 0', sm: '8px 16px' },
          border: 'none',
        }}
      >
        <Typography
          variant={typographyStyles.variants.tableValue(isMobileScreenSize)}
          sx={{
            ...(typographyStyles.tableValue)
          }}
        >
          {value}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

interface ProductLineDetailCharacteristicByTemplateProps {
  template: ProductLineTemplate,
  productLine: ProductLineViewDetail,
  addLabel?: string
  tooltip?: string
}

function ProductLineDetailCharacteristicByTemplate({template, productLine, addLabel, tooltip}: ProductLineDetailCharacteristicByTemplateProps) {
    const { getSummaryPlaceholdersForDetail } = useProductLineTemplate();
    const keyBase = `productLineDetailCharacteristicRow_${template[EntityWithIdFields.Id]}`;
   
    return (
      <React.Fragment>
          {
              getSummaryPlaceholdersForDetail(template, productLine).map((x, idx) => (
                <ProductLineDetailCharacteristicRow key={`${keyBase}_${idx}`}
                                                    label={x.label}
                                                    value={`${x.placeholder}${addLabel ?? ''}`}
                                                    labelTooltip={tooltip ?? x.tooltip}
                />
              ))
          }
      </React.Fragment>
    )
}


export default function ProductLineDetailCharacteristicsTable({ productLine } : ProductLineDetailCharacteristicsTableProps) {
  const { getFieldsForDetail } = useProductLineTemplate();
  const [rowsComponent, setRowsComponent] = useState<React.ReactElement[]>(); 
  const [footerDescriptions, setFooterDescriptions] = useState<string[]>(); 

  useEffect(() => {
    if (productLine && getFieldsForDetail) {
      const components : React.ReactElement[] = [];
      const footerDescs : string[] = [];

      (getFieldsForDetail[productLine[ProductLineFields.ProductTemplateCode]] ?? []).forEach((template, idx) => {
        let addLabel = undefined;
        const observationsDesc = template[ProductLineTemplateFields.ProductLineObservationsFieldDesc];
        const productLineObservations = observationsDesc ? productLine[observationsDesc] : "";
        
        if (productLineObservations) {
          const asterisk = '*'.repeat(footerDescs.length + 1);
          footerDescs.push(`${asterisk} ${productLineObservations}`);
          addLabel = ` ${asterisk}`;
        }
        
        components.push(
          <ProductLineDetailCharacteristicByTemplate template={template}
                                                     productLine={productLine}
                                                     key={`productLineDetailCharacteristicByTemplate_${idx}_${idx}`}
                                                     addLabel={addLabel}
                                                     tooltip={addLabel ? productLineObservations : undefined}
          />
        )
      });
      
      setRowsComponent(components);
      if (footerDescs && footerDescs.length) setFooterDescriptions(footerDescs);
    }
  }, [productLine, getFieldsForDetail]);
    
  return (
      <Grid item container xs={12}>
        <Grid item xs={12}>
          {
            (productLine && getFieldsForDetail) ?
              <Table variant={'interleaving-style'} sx={{ tableLayout: 'fixed' }}>
                <ProductLineDetailCharacteristicRow label={'Nombre'}
                                                    value={productLine[ProductLineFields.Line]}
                />
                
                <ProductLineDetailCharacteristicRow label={'Producto'}
                                                    value={productLine[ProductLineFields.ProductDesc]}
                />
                
                { rowsComponent && rowsComponent }
              </Table>
              :
              <LoadingProductLineDetailTable />
          }
        </Grid>
        
        {
          footerDescriptions && footerDescriptions.length &&
            <Grid item xs={12} mt={1}>
                <Stack spacing={1}>
                  {
                    footerDescriptions.map((desc, idx) => (
                      <TypographyBase key={`footerDescriptionsCharacteristicsTable_${idx}`}
                                      variant={'caption'}
                                      fontStyle={'italic'}
                      >
                        {desc}
                      </TypographyBase>
                    ))
                  }
                </Stack>
            </Grid>
        }
      </Grid>
  );
}


export function LoadingProductLineDetailTable() {
    return (
        <Table variant={'interleaving-style'}>
            {Array.from({ length: 4 }).map((_, idx) => (
                <TableRow key={`LoadingProductLineDetailTable_${idx}`}>
                    <TableCell>
                        <Skeleton />
                    </TableCell>
                </TableRow>
            ))}
        </Table>
    );
}
