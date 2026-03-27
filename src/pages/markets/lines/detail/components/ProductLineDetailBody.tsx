import React from "react";
import {Stack} from "@mui/material";
import ProductLineDetailInnerSection from "./ProductLineDetailInnerSection";
import {ProductLineDescriptionsFields} from "types/lines/productLineData";
import ProductLineDetailCharacteristics from "./ProductLineDetailCharacteristics";
import ProductLineDetailRequirements from "./ProductLineDetailRequirements";
import ProductLineDetailTitle from "./ProductLineDetailTitle";
import ProductLineDetailOffererRelated from "./ProductLineDetailOffererRelated";

interface ProductLineDetailBodyProps {
  hideActions?: boolean
}

function ProductLineDetailBody({ hideActions }: ProductLineDetailBodyProps) {
  return (
    <Stack spacing={'1.5rem'}>
      <ProductLineDetailTitle hideActions={hideActions} />
      
      <ProductLineDetailInnerSection title={"Información general"}
                                     nameInnerText={ProductLineDescriptionsFields.CommercialDescription} />

      <ProductLineDetailCharacteristics />

      <ProductLineDetailRequirements />

      <ProductLineDetailInnerSection title={"Garantía"}
                                     nameInnerText={ProductLineDescriptionsFields.GuaranteeDetail} />
      
      <ProductLineDetailOffererRelated />

      <ProductLineDetailInnerSection title={"Notas"}
                                     nameInnerText={ProductLineDescriptionsFields.Disclaimer} />
    </Stack>
  )
}

export default ProductLineDetailBody;