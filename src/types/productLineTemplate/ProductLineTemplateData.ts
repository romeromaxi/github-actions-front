import {EntityWithIdAndDescription} from "../baseEntities";


export enum ProductLineTemplateFields {
    ProductTemplateCode = 'codProductoPlantilla',
    ProductTemplateDesc = 'descProductoPlantilla',
    ProductLineFieldLabel = 'etiquetaLineaCampo',
    ProductLineFieldCode = 'codProductoLineaCampo',
    ProductLineFieldDesc = 'descProductoLineaCampo',
    ProductLineMinFieldDesc = 'descProductoLineaCampoMin',
    ProductLineMaxFieldDesc = 'descProductoLineaCampoMax',
    ProductLineBitFieldDesc = 'descProductoLineaCampoBit',
    ProductLineDetailFieldDesc = 'descProductoLineaCampoDetalle',
    ProductLineObservationsFieldDesc = 'descProductoLineaCampoObservaciones',
    LineFieldDesc = 'descripcionLineaCampo',
    FieldMask = 'mascaraCampo',
    DetailFieldMask = 'mascaraCampoDetalle',
    EmptyFieldText = 'textoCampoVacio',
    CssIcon = 'iconoCss',
    Order = 'orden',
    ShowLineCard = 'muestraCardLinea',
    ShowLineDetailCard = 'muestraCardDetalleLinea',
    ProductLineFieldMaskTypeCode = 'codProductoLineaCampoMascaraTipo',
    ProductLineFieldMaskTypeDesc = 'descProductoLineaCampoMascaraTipo',
    LineProductFieldTypeCode = 'codProductoLineaCampoTipo',
    LineProductFieldDataTypeCode = 'codProductoLineaCampoDatoTipo',
    LineProductFieldFormatCode = 'codProductoLineaCampoFormato'
}


export interface ProductLineTemplate extends EntityWithIdAndDescription {
    [ProductLineTemplateFields.ProductTemplateCode]: number,
    [ProductLineTemplateFields.ProductTemplateDesc]: string,
    [ProductLineTemplateFields.ProductLineFieldCode]: number,
    [ProductLineTemplateFields.ProductLineFieldDesc]: string,
    [ProductLineTemplateFields.ProductLineBitFieldDesc]: string,
    [ProductLineTemplateFields.ProductLineMinFieldDesc]: string,
    [ProductLineTemplateFields.ProductLineMaxFieldDesc]: string,
    [ProductLineTemplateFields.ProductLineDetailFieldDesc]: string,
    [ProductLineTemplateFields.ProductLineObservationsFieldDesc]: string,
    [ProductLineTemplateFields.LineFieldDesc]: string,
    [ProductLineTemplateFields.FieldMask]: string,
    [ProductLineTemplateFields.DetailFieldMask]: string,
    [ProductLineTemplateFields.CssIcon]: string,
    [ProductLineTemplateFields.Order]: number,
    [ProductLineTemplateFields.ShowLineCard]: boolean,
    [ProductLineTemplateFields.ShowLineDetailCard]: boolean,
    [ProductLineTemplateFields.ProductLineFieldMaskTypeCode]?: number,
    [ProductLineTemplateFields.ProductLineFieldMaskTypeDesc]: string,
    [ProductLineTemplateFields.EmptyFieldText]: string,

    [ProductLineTemplateFields.ProductLineFieldLabel]: string,
    [ProductLineTemplateFields.LineProductFieldTypeCode]: number,
    [ProductLineTemplateFields.LineProductFieldDataTypeCode]: number,
    [ProductLineTemplateFields.LineProductFieldFormatCode]: number
}

export interface DictionaryTemplateConfig {
    [key: number]: ProductLineTemplate[];
}


export enum ProductLineItemTypeFields {
    Value = 'valor',
    ValueMin = 'valorMin',
    ValueMax = 'valorMax',
    ValueDetail = 'valorDetalle',
    MaskType = 'mascara'
}

interface ProductLineItemType {
    [ProductLineItemTypeFields.Value]: string,
    [ProductLineItemTypeFields.ValueMin]: string,
    [ProductLineItemTypeFields.ValueMax]: string,
    [ProductLineItemTypeFields.ValueDetail]: string,
    [ProductLineItemTypeFields.MaskType]: string
}