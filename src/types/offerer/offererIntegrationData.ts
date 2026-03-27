import {BaseRequest, EntityWithId} from "../baseEntities";


export enum OffererIntegrationViewFields {
    HasLufeApiKey = 'tieneApiKeyLufe'
}


export interface OffererIntegrationView extends EntityWithId<number> {
    [OffererIntegrationViewFields.HasLufeApiKey]: boolean
}


export enum OffererIntegrationDeleteFields {
    CleanLufeApiKey = 'limpiarApiKeyLufe'
}

export interface OffererIntegrationDelete extends BaseRequest {
    [OffererIntegrationDeleteFields.CleanLufeApiKey]?: boolean
}


export enum OffererIntegrationUpdateFields {
    LufeApiKey = 'apiKeyLufe'
}

export interface OffererIntegrationUpdate extends BaseRequest {
    [OffererIntegrationUpdateFields.LufeApiKey]?: string
}