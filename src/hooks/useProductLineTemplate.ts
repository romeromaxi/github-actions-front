import {useContext, useMemo} from "react";
import {ProductLineTemplateContext} from "../App";
import {
    DictionaryTemplateConfig,
    ProductLineItemTypeFields,
    ProductLineTemplate,
    ProductLineTemplateFields
} from "../types/productLineTemplate/ProductLineTemplateData";
import {ProductLineFields, ProductLineView, ProductLineViewDetail} from "../types/lines/productLineData";
import {numberFormatter} from "../util/formatters/numberFormatter";
import {ProductLineMaskType} from "../types/lines/productLineEnums";

const tooltipNotSpecify : string = "No Especificado";
const tooltipNotDisposed : string = "No se dispone";

export interface ReplaceSummaryPlaceholdersResult {
    placeholder: string,
    tooltip: string
}

export interface ReplaceSummaryPlaceholdersDetailResult extends ReplaceSummaryPlaceholdersResult {
    label: string,
}

const useProductLineTemplate = () => {
    const { dictionaryTemplateConfig } = useContext(ProductLineTemplateContext)

    const getFieldsForSummary = useMemo(() => {
        const filteredDictionary: DictionaryTemplateConfig = {};
        
        if (dictionaryTemplateConfig) {
            Object.keys(dictionaryTemplateConfig).forEach(key => {
                const filteredValues = dictionaryTemplateConfig[Number(key)].filter(
                    (item) => item[ProductLineTemplateFields.ShowLineCard]
                );
                if (filteredValues.length > 0) {
                    filteredDictionary[Number(key)] = filteredValues;
                }
            });
        }

        return filteredDictionary;
    }, [dictionaryTemplateConfig]);

    const getFieldsForDetail = useMemo(() => {
        const filteredDictionary: DictionaryTemplateConfig = {};
        
        if (dictionaryTemplateConfig) {
            Object.keys(dictionaryTemplateConfig).forEach(key => {
                const filteredValues = dictionaryTemplateConfig[Number(key)]
                  .filter((item) => item[ProductLineTemplateFields.ShowLineDetailCard])
                  .sort((a, b) => a[ProductLineTemplateFields.Order] - b[ProductLineTemplateFields.Order]); 

                if (filteredValues.length > 0) {
                    filteredDictionary[Number(key)] = filteredValues;
                }
            });
        }
        
        return filteredDictionary;
    }, [dictionaryTemplateConfig]);

    const getSummaryField = (item: ProductLineTemplate) => {
        return {
            [ProductLineItemTypeFields.Value]: item[ProductLineTemplateFields.ProductLineFieldDesc],
            [ProductLineItemTypeFields.ValueMin]: item[ProductLineTemplateFields.ProductLineMinFieldDesc],
            [ProductLineItemTypeFields.ValueMax]: item[ProductLineTemplateFields.ProductLineMaxFieldDesc],
            [ProductLineItemTypeFields.ValueDetail]: item[ProductLineTemplateFields.ProductLineDetailFieldDesc],
            [ProductLineItemTypeFields.MaskType]: item[ProductLineTemplateFields.ProductLineFieldMaskTypeCode]
        }
    }

    const replaceSummaryPlaceholders = (item: ProductLineTemplate, line: ProductLineView) : ReplaceSummaryPlaceholdersResult => {
        const emptyField = item[ProductLineTemplateFields.EmptyFieldText]
        const mask = item[ProductLineTemplateFields.FieldMask]
        const field = getSummaryField(item)
        const fieldBitValue = line[item[ProductLineTemplateFields.ProductLineBitFieldDesc]];
        const maskType = field[ProductLineItemTypeFields.MaskType];
        
        let returnEmptyField = false;
        let tooltipValue = "";

        const handleFalseFieldBitValue = (mask: string) => {
            const placeholderRegex = /{value}|{valueMin}|{valueMax}|{valueDetalle}|{valuePorcentaje}|{valueConMoneda}|{valueConMonedaMin}|{valueConMonedaMax}/;
            const parts = mask.split(placeholderRegex);
            
            if (parts.length > 1) {
                return { placeholder: `${parts[0]}No`, tooltip: tooltipNotDisposed };
            } else {
                // Fallback en caso de que no hubiese prefijo de la máscara (aunque debería haberlo siempre)
                return { placeholder: `${mask} No`, tooltip: tooltipNotDisposed };
            }
        };

        const checkForNullMaskType = (maskType: number | undefined, line: ProductLineView, field: any) => {
            switch (maskType) {
                case ProductLineMaskType.Value:
                    if (!line[field[ProductLineItemTypeFields.Value]])
                        returnEmptyField = true;
                    break;
                    
                case ProductLineMaskType.ValueMin:
                    if (!line[field[ProductLineItemTypeFields.ValueMin]])
                        returnEmptyField = true;
                    break;
        
                case ProductLineMaskType.ValueMax:
                    if (!line[field[ProductLineItemTypeFields.ValueMax]])
                        returnEmptyField = true;
                    break;
        
                case ProductLineMaskType.Range:
                    if (!line[field[ProductLineItemTypeFields.ValueMin]] && !line[field[ProductLineItemTypeFields.ValueMax]])
                        returnEmptyField = true;
                    break;
        
                case ProductLineMaskType.DescriptionListed:
                    if (!line[field[ProductLineItemTypeFields.ValueDetail]])
                        returnEmptyField = true;
                    else if (field[ProductLineItemTypeFields.ValueDetail].includes('Moneda'))
                        tooltipValue = line[ProductLineFields.CurrencyDesc] ?? "";
                    break;
            }
        };

        if(fieldBitValue == false) {
            return handleFalseFieldBitValue(mask);
        } else {
            checkForNullMaskType(maskType, line, field);
        }

        const replacements = {
            '{value}': line[field[ProductLineItemTypeFields.Value]] || emptyField,
            '{valueMin}': line[field[ProductLineItemTypeFields.ValueMin]] || emptyField,
            '{valueMax}': line[field[ProductLineItemTypeFields.ValueMax]] || emptyField,
            '{valueDetalle}': line[field[ProductLineItemTypeFields.ValueDetail]] || emptyField,
            '{valuePorcentaje}': line[field[ProductLineItemTypeFields.Value]] ? numberFormatter.toStringWithPercentage(line[field[ProductLineItemTypeFields.Value]]) : emptyField,
            '{valueConMoneda}': line[field[ProductLineItemTypeFields.Value]] ? numberFormatter.toStringWithAmount(line[field[ProductLineItemTypeFields.Value]], line?.[ProductLineFields.CurrencyCodeDesc], 0) : emptyField,
            '{valueConMonedaMin}': line[field[ProductLineItemTypeFields.ValueMin]] ? numberFormatter.toStringWithAmount(line[field[ProductLineItemTypeFields.ValueMin]], line?.[ProductLineFields.CurrencyCodeDesc], 0) : emptyField,
            '{valueConMonedaMax}': line[field[ProductLineItemTypeFields.ValueMax]] ? numberFormatter.toStringWithAmount(line[field[ProductLineItemTypeFields.ValueMax]], line?.[ProductLineFields.CurrencyCodeDesc], 0) : emptyField
        };

        const replaceValue = mask.replace(/{value}|{valueMin}|{valueMax}|{valueDetalle}|{valuePorcentaje}|{valueConMoneda}|{valueConMonedaMin}|{valueConMonedaMax}/g, (placeholder) => {
            return replacements[placeholder] ?? placeholder;
        });
        
        return { placeholder: replaceValue, tooltip: returnEmptyField ? tooltipNotSpecify : tooltipValue };
    }

    const generateCombinedLineSummary = (templates: ProductLineTemplate[], line: ProductLineView): ReplaceSummaryPlaceholdersResult => {
        const hasMultipleValues = templates.filter(item => {
            const fieldMap = {
                value: item[ProductLineTemplateFields.ProductLineFieldDesc],
                valueMax: item[ProductLineTemplateFields.ProductLineMaxFieldDesc],
                valueDetail: item[ProductLineTemplateFields.ProductLineDetailFieldDesc]
            };
            return [fieldMap.value, fieldMap.valueMax, fieldMap.valueDetail]
                .some(key => !!line[key as keyof ProductLineView]);
        }).length > 1;
        
        const parts: string[] = [];

        templates.forEach((item, idx) => {
            const empty = item[ProductLineTemplateFields.EmptyFieldText];
            const mask = item[ProductLineTemplateFields.FieldMask] || '';
            const fieldDef = {
                [ProductLineItemTypeFields.Value]: item[ProductLineTemplateFields.ProductLineFieldDesc],
                [ProductLineItemTypeFields.ValueMin]: item[ProductLineTemplateFields.ProductLineMinFieldDesc],
                [ProductLineItemTypeFields.ValueMax]: item[ProductLineTemplateFields.ProductLineMaxFieldDesc],
                [ProductLineItemTypeFields.ValueDetail]: item[ProductLineTemplateFields.ProductLineDetailFieldDesc],
                [ProductLineItemTypeFields.MaskType]: item[ProductLineTemplateFields.ProductLineFieldMaskTypeCode]
            };
            
            const lineValue = line[fieldDef[ProductLineItemTypeFields.Value]];
            const lineValueMax = line[fieldDef[ProductLineItemTypeFields.ValueMax]];
            const lineValueDetail = line[fieldDef[ProductLineItemTypeFields.ValueDetail]];
            
            if (!lineValue && !lineValueMax && !lineValueDetail)
                return;
            
            const replacements: Record<string,string> = {
                '{value}': lineValue ?? empty,
                '{valueMax}': lineValueMax ?? empty,
                '{valueDetalle}': lineValueDetail ?? empty,
                '{valuePorcentaje}': lineValue ? numberFormatter.toStringWithPercentage(lineValue) : empty,
                '{valueConMoneda}': lineValue ? 
                    numberFormatter.toStringWithAmount(lineValue, line[ProductLineFields.CurrencyCodeDesc] || 'N/E', 0) 
                    : 
                    !!line[ProductLineFields.CurrencyCodeDesc] ? `${line[ProductLineFields.CurrencyCodeDesc]} ${empty}` : empty,
                '{valueConMonedaMax}': lineValueMax ? 
                    numberFormatter.toStringWithAmount(lineValueMax, line[ProductLineFields.CurrencyCodeDesc] || 'N/E', 0)
                    :
                    !!line[ProductLineFields.CurrencyCodeDesc] ? `${line[ProductLineFields.CurrencyCodeDesc]} ${empty}` : empty,
            };
            
            const text = mask.replace(
                /\{value\}|\{valueMax\}|\{valueDetalle\}|\{valuePorcentaje\}|\{valueConMoneda\}|\{valueConMonedaMax\}/g, 
                    ph => (!hasMultipleValues || idx > 0) ? replacements[ph] || ph : ''
            );
            parts.push(text);
        });

        let tooltipValue = '';
        if (!!parts.length)
            tooltipValue = line[ProductLineFields.CurrencyDesc] ?? "";
        
        return {
            placeholder: parts.join(' y '),
            tooltip: tooltipValue
        };
    }    
    
    const getPlaceholderValueInDetailMask = (mask: string, value: any, emptyField: string, currencyCode: string) : ReplaceSummaryPlaceholdersResult => {
        if (value === null || value === undefined || value === '')
            return { placeholder: emptyField, tooltip: tooltipNotSpecify }
        
        if (!mask) return { placeholder: `${value}`, tooltip: '' }
        
        const replacements = {
            '{value}': value || 'N/E',
            '{valueBooleano}': value ? "Sí" : "No",
            '{valuePorcentaje}': numberFormatter.toStringWithPercentage(value) || 'N/E',
            '{valueConMoneda}': numberFormatter.toStringWithAmount(value, currencyCode, 0) || 'N/E',
        };
        
        const replaceValue = mask.replace(/{value}|{valueBooleano}|{valuePorcentaje}|{valueConMoneda}/g, (placeholder) => {
            return replacements[placeholder] ?? placeholder;
        })
        
        return { placeholder: replaceValue, tooltip: '' }
    }
    
    const getSummaryPlaceholdersForDetail = (item: ProductLineTemplate, productLine: ProductLineViewDetail) : ReplaceSummaryPlaceholdersDetailResult[] => {
        const mask = item[ProductLineTemplateFields.DetailFieldMask];
        const fieldDescription = item[ProductLineTemplateFields.LineFieldDesc];
        const fieldBit = item[ProductLineTemplateFields.ProductLineBitFieldDesc];
        const fieldMin = item[ProductLineTemplateFields.ProductLineMinFieldDesc];
        const fieldMax = item[ProductLineTemplateFields.ProductLineMaxFieldDesc];
        const fieldDetail = item[ProductLineTemplateFields.ProductLineDetailFieldDesc];
        const fieldBase = item[ProductLineTemplateFields.ProductLineFieldDesc];
        const emptyField = item[ProductLineTemplateFields.EmptyFieldText]

        const currencyCode = productLine[ProductLineFields.CurrencyCodeDesc] ?? "";
        const placeholders : ReplaceSummaryPlaceholdersDetailResult[] = [];
        
        if (fieldBit) {
            let finalPlaceholders = "";
            if (productLine[fieldBit] !== null && productLine[fieldBit] !== undefined) {
                finalPlaceholders = !productLine[fieldBit] ? "No" : 
                  getPlaceholderValueInDetailMask(mask, fieldDetail ? productLine[fieldDetail] : productLine[fieldBase], emptyField, currencyCode).placeholder
            }

            placeholders.push({
                label: fieldDescription,
                placeholder: finalPlaceholders || emptyField,
                tooltip: finalPlaceholders ? "" : tooltipNotSpecify
            });
        } else if (!!fieldMin || !!fieldMax) {
            let finalPlaceholders = "";
            
            let minValue, maxValue;

            if (fieldMin && productLine[fieldMin]) {
                minValue = getPlaceholderValueInDetailMask(mask, productLine[fieldMin], emptyField, currencyCode).placeholder;
                finalPlaceholders = `Desde ${minValue}`
            }

            if (fieldMax && productLine[fieldMax]) {
                maxValue = getPlaceholderValueInDetailMask(mask, productLine[fieldMax], emptyField, currencyCode).placeholder
                finalPlaceholders += `${minValue ? " - " : ""}Hasta ${maxValue}`;
            }
            
            placeholders.push({
                label: fieldDescription,
                placeholder: finalPlaceholders || emptyField,
                tooltip: finalPlaceholders ? "" : tooltipNotSpecify
            });
        } else if (!fieldMin && !fieldMax) {
            const value = fieldDetail ? productLine[fieldDetail] : productLine[fieldBase];
            
            placeholders.push({
                label: fieldDescription,
                ...getPlaceholderValueInDetailMask(mask,value, emptyField, currencyCode)
            });
        }

        return placeholders;
    }

    return {
        getFieldsForSummary,
        getFieldsForDetail,
        replaceSummaryPlaceholders,
        getSummaryPlaceholdersForDetail,
        generateCombinedLineSummary
    };
}


export default useProductLineTemplate