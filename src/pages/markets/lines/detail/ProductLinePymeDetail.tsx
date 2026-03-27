import {useParams} from 'react-router-dom';
import {HttpProductLine} from 'http/index';
import React, {useEffect, useState} from 'react';
import {ProductLineFields, ProductLineViewDetail} from 'types/lines/productLineData';
import {Grid, Stack} from '@mui/material';
import ProductLineDetailSummaryCard from "./components/ProductLineDetailSummaryCard";
import {HttpMarketLineViewDetail} from "http/market/httpMarketLineViewDetail";
import ProductLineDetailBody from "./components/ProductLineDetailBody";
import ProductLineDetailRelatedProducts from "./components/ProductLineDetailRelatedProducts";
import {EntityWithIdFields} from "types/baseEntities";
import ProductLineUnavailableDialog from "../components/ProductLineUnavailableDialog";

export const ProductLineDetailContext = React.createContext({
  idProductLine: 0 as number,
  productLine: undefined as undefined | ProductLineViewDetail
});

const ProductLinePymeDetail = () => {
  const { uniProductLineId } = useParams();  
  const [line, setLine] = useState<ProductLineViewDetail>();
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (uniProductLineId) {
      setLine(undefined);
      
      HttpProductLine.getByUniqueProductLineId(uniProductLineId)
          .then(lineResponse => {
            if (lineResponse[ProductLineFields.IsActive]) {
              setLine(lineResponse);
              HttpMarketLineViewDetail.recordLineDetailViewed(uniProductLineId)
            } else {
              setIsActive(false);
            }
          })
          .catch(() => setIsActive(false));
    }
  }, [uniProductLineId]);
  
  return (
    <ProductLineDetailContext.Provider value={{
      idProductLine: line?.[EntityWithIdFields.Id] ?? 0,
      productLine: line
    }}>
      {
        isActive ?
          <Grid container spacing={2}>
            <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
              <Stack spacing={'1rem'}>
                <ProductLineDetailBody />
    
                <ProductLineDetailRelatedProducts />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
              <ProductLineDetailSummaryCard />
            </Grid>
          </Grid> 
            :
            <Grid container spacing={2}>
              <Grid item xs={12} height={'60dvh'}>
              </Grid>
            </Grid>
      }
      
      <ProductLineUnavailableDialog open={!isActive} />
      
    </ProductLineDetailContext.Provider>
  );
};

export default ProductLinePymeDetail;