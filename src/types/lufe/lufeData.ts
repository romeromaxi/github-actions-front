import {EntityWithId} from "../baseEntities";
import {LufePymeRequest} from "./lufePymeData";
import {LufeAuthorityData} from "./lufeAuthorityData";
import {LufeFinanceIndicator} from "./lufeFinanceIndicators";
import {LufePostBalanceIndicator} from "./lufePostBalanceIndicators";
import {LufeDebtState} from "./lufeDebtState";


export enum LufeDetailFields {
    CUIT = 'cuit',
    RequestDate = 'fechaConsulta',
    PymeModelRequest = 'consultaLufePyme',
    AuthoritiesModelRequest = 'consultaLufeAutoridades',
    FinanceIndicatorsModelRequest = 'consultaLufeIndicadoresFinancieros',
    PostBalanceIndicatorsModelRequest = 'consultaLufeIndicadoresPostBalance',
    DebtStateRequest = 'consultaLufeEstadoDeuda'
}

export interface LufeDetail extends EntityWithId<number> {
    [LufeDetailFields.CUIT]?: string;
    [LufeDetailFields.RequestDate]?: Date,
    [LufeDetailFields.PymeModelRequest]?: LufePymeRequest,
    [LufeDetailFields.AuthoritiesModelRequest]?: LufeAuthorityData[],
    [LufeDetailFields.FinanceIndicatorsModelRequest]?: LufeFinanceIndicator[],
    [LufeDetailFields.PostBalanceIndicatorsModelRequest]?: LufePostBalanceIndicator[],
    [LufeDetailFields.DebtStateRequest]?: LufeDebtState
}