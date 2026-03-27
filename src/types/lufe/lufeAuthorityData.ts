import {EntityWithId} from "../baseEntities";


export enum LufeAuthorityDataFields {
    RequestId = 'idLufeConsulta',
    CUIT = 'cuit',
    Denomination = 'denominacion',
    Shareholder = 'es_accionista',
    Percentage = 'porc_accionista',
    Charge = 'cargo',
    LastModifiedDate = 'fechaUltMod'
}


export interface LufeAuthorityData extends EntityWithId<number> {
    [LufeAuthorityDataFields.RequestId]: number,
    [LufeAuthorityDataFields.CUIT]?: string,
    [LufeAuthorityDataFields.Denomination]?: string,
    [LufeAuthorityDataFields.Shareholder]?: boolean,
    [LufeAuthorityDataFields.Percentage]?: number,
    [LufeAuthorityDataFields.Charge]?: string,
    [LufeAuthorityDataFields.LastModifiedDate]?: Date
}