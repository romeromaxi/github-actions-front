import React from "react";
import {ProductLineDescriptionsFields, ProductLineFields} from "types/lines/productLineData";
import LineProductEditorHtmlTabCard from "./LineProductEditorHtmlTabCard";


const LineDisclaimerEditorTab = () => {
    return (
        <LineProductEditorHtmlTabCard title={'Disclaimer'}
                                      name={`${ProductLineFields.ProductLineDescriptions}.${ProductLineDescriptionsFields.Disclaimer}`}
                                      helperText={
                                          'Indicar toda la información adicional/disclaimer que consideres importante que conozca el solicitante'
                                      }
                                      showInAlert
        />
    )
}

export default LineDisclaimerEditorTab