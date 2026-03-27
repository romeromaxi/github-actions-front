import React, {ElementType, useMemo} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {WrapperIcons} from "../../../../components/icons/Icons";
import { CaretDown } from "@phosphor-icons/react";
import { ProductLineGroupedData } from "./ProductLinesGroupByService";
import { getServiceIconByCode } from "../../../../util/typification/marketIcons";
import ProductLineCard from "./ProductLineCard";
import {shuffle} from "../../../../util/helpers";
import {ProductLineView} from "../../../../types/lines/productLineData";

interface ProductLinesGroupByServiceAccordionProps {
  service: ProductLineGroupedData;
}

function ProductLinesGroupByServiceAccordion(
  { service }: ProductLinesGroupByServiceAccordionProps,
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const productLinesSorted: ProductLineView[] = useMemo(() => (
      shuffle(service.products[0].productLines)
  ), [service.products]);

  const renderComponentIcon = (icon: ElementType) => (
    <WrapperIcons
      Icon={icon}
      size={isMobile ? 'sm' : 'md'}
    />
  );

  const renderTitleAccordion = () => (
      <Typography
        variant="h4"
        fontWeight={600}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {service.serviceDesc}
      </Typography>
  );

  return (
    <Accordion defaultExpanded
               sx={{ width: '100%', backgroundColor: 'transparent !important', paddingTop: '13.5px', paddingBottom: '7px', '&.Mui-expanded': { paddingTop: '6px', paddingBottom: '3px' }}}>
      <AccordionSummary expandIcon={renderComponentIcon(CaretDown)}>
        {renderTitleAccordion()}
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
          {productLinesSorted && productLinesSorted.length !== 0 && (
            <Grid item xs={12} container spacing={1} key={`sectionProduct_${service.products[0].productId}_}`}>
              <Grid item xs={12} container spacing={4}>
                {productLinesSorted.map((p, i) => (
                  <Grid item xs={12} sm={6} lg={4} key={`productLineCardSingle_${i}`}>
                    <ProductLineCard productLine={p} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )
          }
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default ProductLinesGroupByServiceAccordion;