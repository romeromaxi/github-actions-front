import {EntityWithId} from "../baseEntities";


export enum LufeDebtStateFields {
    RequestId = 'idLufeConsulta',
    HasSocialTaxDebt = 'tiene_deuda_impositiva_social',
    HasSocialDebt = 'tiene_deuda_social',
    Debts = 'deudas',
    LastModifiedDate = 'fechaUltMod'
}


export enum LufeDebtFields {
    Debt = 'deuda'
}

interface LufeDebt {
    [LufeDebtFields.Debt]: LufeDebtDetail[]
}
export enum LufeDebtDetailFields {
    RequestId = 'idLufeConsulta',
    Tax = 'impuesto',
    FiscalPeriod = 'periodoFiscal'
}

export interface LufeDebtDetail extends EntityWithId<number> {
    [LufeDebtDetailFields.RequestId]: number,
    [LufeDebtDetailFields.Tax]: string,
    [LufeDebtDetailFields.FiscalPeriod]: string
}

export interface LufeDebtState extends EntityWithId<number> {
    [LufeDebtStateFields.RequestId]: number,
    [LufeDebtStateFields.HasSocialTaxDebt]?: boolean,
    [LufeDebtStateFields.HasSocialDebt]?: boolean,
    [LufeDebtStateFields.Debts]?: LufeDebt,
    [LufeDebtStateFields.LastModifiedDate]?: Date
}