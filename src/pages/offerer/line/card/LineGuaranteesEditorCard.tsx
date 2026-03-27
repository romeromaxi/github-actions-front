import React from "react";
import {ProductLineDescriptionsFields, ProductLineFields} from "types/lines/productLineData";
import LineProductEditorHtmlTabCard from "./LineProductEditorHtmlTabCard";


const LineGuaranteesEditorCard = () => {
    return (
        <LineProductEditorHtmlTabCard title={'Garantías'}
                                      name={`${ProductLineFields.ProductLineDescriptions}.${ProductLineDescriptionsFields.GuaranteeDetail}`}
        />
    )
}


export default LineGuaranteesEditorCard