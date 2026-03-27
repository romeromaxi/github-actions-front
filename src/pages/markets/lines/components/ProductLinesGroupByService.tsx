import {ProductLineFields, ProductLineView,} from 'types/lines/productLineData';
import {Grid, useMediaQuery, useTheme} from '@mui/material';
import React, {useEffect, useState} from 'react';
import ProductLineCardLoading from './ProductLineCardLoading';
import ProductLinesGroupByServiceAccordion from "./ProductLinesGroupByServiceAccordion";
import FlyerAssistedSearchLuc from "components/flyers/FlyerAssistedSearchLuc";

interface ProductLinesGroupByServiceProps {
  productLineList?: ProductLineView[];
}

export interface ProductLineGroupedData {
  serviceCode: number;
  serviceDesc: string;
  products: {
    productId: number;
    productDesc: string;
    productLines: ProductLineView[];
  }[];
}

function ProductLinesGroupByService(props: ProductLinesGroupByServiceProps) {
  const [groupedLines, setGroupedLines] = useState<ProductLineGroupedData[]>([]);
  const [settedValues, setSettedValues] = useState<boolean>(false);

  const theme = useTheme();
  const isSmallerThanLargeScreenSize = useMediaQuery(theme.breakpoints.down(1440));

  const groupByProduct = (data: ProductLineView[]): ProductLineGroupedData[] => {
    const groupedByProduct = data.reduce<Record<number, ProductLineGroupedData>>((acc, curr) => {
      const productId = curr[ProductLineFields.ProductCode];

      // cabe aclarar que esto quedó medio redundante (en términos de performance debería ser más o menos lo mismo)
      // se dejó la interfaz igualmente por si sugieren otro cambio acá, además de no hacer tantos cambios en el resto de mapeos
      if (!acc[productId]) {
        acc[productId] = {
          serviceCode: productId,
          serviceDesc: curr[ProductLineFields.ProductDesc],
          products: [{
            productId,
            productDesc: curr[ProductLineFields.ProductDesc],
            productLines: [],
          }],
        };
      }

      acc[productId].products[0].productLines.push(curr);

      return acc;
    }, {});

    setSettedValues(true);
    return Object.values(groupedByProduct);
  };
  
  const sortedGroups = (groupedData: ProductLineGroupedData[]): ProductLineGroupedData[] => {
    groupedData.sort((serviceA, serviceB) => {
      const countLinesA = serviceA.products.reduce(
          (sum, product) => sum + product.productLines.length,
          0
      );

      const countLinesB = serviceB.products.reduce(
          (sum, product) => sum + product.productLines.length,
          0
      );

      return countLinesB - countLinesA;
    });

    groupedData.forEach(service => {
      service.products.sort((productA, productB) => {
        return productB.productLines.length - productA.productLines.length;
      });
    });
    
    return groupedData;
  }
  
  useEffect(() => {
    if (props.productLineList) {
      const group = groupByProduct(props.productLineList)
      const groupSorted = sortedGroups(group);
      setGroupedLines(groupSorted);
    } else {
      setGroupedLines([]);
      setSettedValues(false);
    }
  }, [props.productLineList]);

  const mapLoading = () => {
  
    return Array.from(Array(6).keys()).map((item) => (
      <Grid item xs={isSmallerThanLargeScreenSize ? 12 : 4} key={`keyProductLineCardBaseLoading_${item}`}>
        <ProductLineCardLoading />
      </Grid>
    ));
  };

  return (
    <Grid container spacing={6} alignContent="flex-start">
      {(!!groupedLines && !!groupedLines.length) ?
          groupedLines.map((sv, index) => (
              <Grid
                  item
                  xs={12}
                  container
                  key={`productLinesGroupByService_${index}`}
              >
                <ProductLinesGroupByServiceAccordion service={sv} />
              </Grid>
          ))
              :
              settedValues ?
                  <Grid item xs={12}>
                    <FlyerAssistedSearchLuc />
                  </Grid>
                :
                  mapLoading()  
      }

      {
        (!!groupedLines && !!groupedLines.length && groupedLines.length <= 2 && groupedLines[0].products[0].productLines.length <= 6) &&
          <Grid item xs={12} container>
            <FlyerAssistedSearchLuc />
          </Grid>
      }
    </Grid>
  );
}

export default ProductLinesGroupByService;
