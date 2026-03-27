import {
    ProductLineTemplate,
    ProductLineTemplateFields
} from "types/productLineTemplate/ProductLineTemplateData";
import {themeIconsSizeDefinition} from "util/themes/definitions";
import MarketLineFooterTypography from "components/text/MarketLineFooterTypography";
import {Stack} from "@mui/material";
import {ProductLineView} from "types/lines/productLineData";
import useProductLineTemplate from "hooks/useProductLineTemplate";

interface ProductLineFieldDetailProps {
    template: ProductLineTemplate,
    line: ProductLineView
}

const ProductLineFieldDetail = ({template, line} : ProductLineFieldDetailProps) => {
    const {replaceSummaryPlaceholders} = useProductLineTemplate();

    const renderProductLineTemplateField = () => {
        const { placeholder, tooltip } = replaceSummaryPlaceholders(template, line);

        return <MarketLineFooterTypography tooltip={tooltip}>{placeholder}</MarketLineFooterTypography>
    }

    return (
        <Stack direction='row' spacing={1}>
            <i className={template[ProductLineTemplateFields.CssIcon]} style={{fontSize: themeIconsSizeDefinition.md}}></i>
            {renderProductLineTemplateField()}
        </Stack>
    )
}

export default ProductLineFieldDetail;