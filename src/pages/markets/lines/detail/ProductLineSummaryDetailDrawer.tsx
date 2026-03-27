import React from "react";
import DrawerBase from "components/misc/DrawerBase";
import {
  ProductLineFields,
  ProductLineViewDetail
} from "types/lines/productLineData";
import {Stack, Theme, useMediaQuery} from "@mui/material";
import {ProductLineDetailContext} from "./ProductLinePymeDetail";
import {EntityWithIdFields} from "types/baseEntities";
import ProductLineDetailBody from "./components/ProductLineDetailBody";

interface ProductLineSummaryDetailDrawerProps {
  open: boolean,
  line: ProductLineViewDetail,
  onClose: () => void 
}

function ProductLineSummaryDetailDrawer({ open, line, onClose }: ProductLineSummaryDetailDrawerProps) {
  const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  
  return (
    <DrawerBase show={open}
                title={line[ProductLineFields.Line]}
                subtitle={line[ProductLineFields.LineLarge]}
                onCloseDrawer={onClose}
                width={isMobileScreenSize ? '100% !important' : '70% !important'}
    >
      <Stack 
        width={isMobileScreenSize ? '95% !important' : '100% !important'}
      >
        <ProductLineDetailContext.Provider value={{
          idProductLine: line[EntityWithIdFields.Id],
          productLine: line
        }}>
          <ProductLineDetailBody hideActions />
        </ProductLineDetailContext.Provider>
      </Stack>
    </DrawerBase>
  )
}

export default ProductLineSummaryDetailDrawer;