import { EntityWithId, EntityWithIdAndDescription } from '../baseEntities';
import { HttpCacheGeneral } from 'http/index';
import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import { ProductLineFieldSelectIds } from './productLineEnums';

export enum LineProductFieldFields {
  LineProductFieldDescription = 'descProductoLineaCampo',
  LineProductFieldLabel = 'descripcion',
  LineProductFieldTypeCode = 'codProductoLineaCampoTipo',
  LineProductFieldFormatCode = 'codProductoLineaCampoFormato',
  LineProductFieldDataTypeCode = 'codProductoLineaCampoDatoTipo',
  ShowBit = 'mostrarBit',
  ShowObservations = 'mostrarObservaciones',
}

export interface LineProductField extends EntityWithId<number> {
  [LineProductFieldFields.LineProductFieldDescription]: string;
  [LineProductFieldFields.LineProductFieldLabel]: string;
  [LineProductFieldFields.LineProductFieldTypeCode]: number;
  [LineProductFieldFields.LineProductFieldFormatCode]: number;
  [LineProductFieldFields.LineProductFieldDataTypeCode]: number;
  [LineProductFieldFields.ShowBit]: boolean;
  [LineProductFieldFields.ShowObservations]: boolean;
}

type CallbackFunctionType = {
  [key: number]: () => Promise<EntityWithIdAndDescription[]>;
};
export const callbackFunctionByFields: CallbackFunctionType = {
  [ProductLineFieldSelectIds.Currency]: HttpCacheGeneral.getCurrencies,
  [ProductLineFieldSelectIds.AmortizationTypes]:
    HttpCacheProduct.getAmortizationTypes,
  [ProductLineFieldSelectIds.CheckIssuer]: HttpCacheGeneral.getCheckIssuer,
  [ProductLineFieldSelectIds.CheckTypes]: HttpCacheGeneral.getCheckTypes,
  [ProductLineFieldSelectIds.CurrencyMultiple]: HttpCacheGeneral.getCurrencies,
  [ProductLineFieldSelectIds.AmortizationTypesMultiple]:
    HttpCacheProduct.getAmortizationTypes,
  [ProductLineFieldSelectIds.RatesTypesMultiple]:
    HttpCacheProduct.getRatesTypes,
  [ProductLineFieldSelectIds.AssetsTypesMultiple]:
    HttpCacheGeneral.getAssetsTypes,
};
