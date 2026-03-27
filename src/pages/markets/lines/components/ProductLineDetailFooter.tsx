
import useProductLineTemplate from "hooks/useProductLineTemplate";
import {ProductLineFields, ProductLineView} from "types/lines/productLineData";
import MarketLineFooterTypography from "components/text/MarketLineFooterTypography";

interface ProductLineDetaiLFooterProps {
  line: ProductLineView;
}

function ProductLineDetailFooter({ line }: ProductLineDetaiLFooterProps) {
  const { getFieldsForSummary, generateCombinedLineSummary  } = useProductLineTemplate();
  const fieldsForSummary = getFieldsForSummary[line[ProductLineFields.ProductTemplateCode]] || [];
  const { placeholder, tooltip } = generateCombinedLineSummary(fieldsForSummary, line);
    
  return (
     <MarketLineFooterTypography fontSize={'12px'} tooltip={tooltip}>
        {placeholder}
     </MarketLineFooterTypography>
  );
}

export default ProductLineDetailFooter;
