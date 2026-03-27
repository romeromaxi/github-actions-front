import {EntityWithId} from "../baseEntities";


export enum LufePostBalanceIndicatorFields {
    RequestId = 'idLufeConsulta',
    Period = 'periodo',
    Sales = 'ventas',
    Purchases = 'compras'
}


export interface LufePostBalanceIndicator extends EntityWithId<number> {
    [LufePostBalanceIndicatorFields.RequestId]: number,
    [LufePostBalanceIndicatorFields.Period]?: string,
    [LufePostBalanceIndicatorFields.Sales]?: number,
    [LufePostBalanceIndicatorFields.Purchases]?: number
}