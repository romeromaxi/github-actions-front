import {EntityWithId} from "../baseEntities";
import {PersonTypes} from "../person/personEnums";


export enum OffererClientPortfolioViewFields {
    BusinessName = 'razonSocial',
    CUIT = 'cuit',
    CreationDate = 'fechaAlta',
    LastModifiedDate = 'fechaUltActualizacion',
    UserLastModify = 'usuarioUltActualizacion',
    OffererId = 'idOferente',
    FolderTypeCode = 'codCarpetaTipo',
    FolderTypeDesc = 'descCarpetaTipo',
    PersonId = 'idPersona',
    BureauLastRequestId = 'idBasesPublicasConsultaUltimo',
    LastLufeRequestId = 'idLufeConsultaUltimo',
    FolderStateCode = 'codCarpetaEstado',
    CreateUser = 'usuarioAlta',
    PersonTypeCode = 'codPersonaTipo',
    PersonTypeDesc = 'descPersonaTipo'
}


export interface OffererClientPortfolioView extends EntityWithId<number> {
    [OffererClientPortfolioViewFields.BusinessName]: string;
    [OffererClientPortfolioViewFields.CUIT]: string;
    [OffererClientPortfolioViewFields.CreationDate]: Date;
    [OffererClientPortfolioViewFields.LastModifiedDate]: Date;
    [OffererClientPortfolioViewFields.UserLastModify]: string;
    [OffererClientPortfolioViewFields.FolderStateCode]: number;
    [OffererClientPortfolioViewFields.FolderTypeCode]: number;
    [OffererClientPortfolioViewFields.BureauLastRequestId]: number;
    [OffererClientPortfolioViewFields.LastLufeRequestId]: number;
    [OffererClientPortfolioViewFields.CreateUser]: string;
    [OffererClientPortfolioViewFields.PersonTypeCode]?: PersonTypes;
    [OffererClientPortfolioViewFields.PersonTypeDesc]?: string;
    [OffererClientPortfolioViewFields.FolderTypeDesc]: string;
}


export enum OffererClientPortfolioFilterFields {
    BusinessName = 'razonSocial',
    CUIT = 'cuit',
    PageSize = 'pageSize',
    CurrentPage = 'actualPage',
    OrderBy = 'orderBy'
}


export interface OffererClientPortfolioFilter {
    [OffererClientPortfolioFilterFields.BusinessName]: string;
    [OffererClientPortfolioFilterFields.CUIT]: string;
    [OffererClientPortfolioFilterFields.PageSize]: number;
    [OffererClientPortfolioFilterFields.CurrentPage]: number;
    [OffererClientPortfolioFilterFields.OrderBy]: string;
}


export interface OffererClientPortfolioFilterForm {
    [OffererClientPortfolioFilterFields.BusinessName]: string;
    [OffererClientPortfolioFilterFields.CUIT]: string;
}


export enum OffererClientPortfolioDetailFields {
    BusinessName = 'razonSocial',
    CUIT = 'cuit',
    CreationDate = 'fechaAlta',
    LastModifiedDate = 'fechaUltActualizacion',
    UserLastModify = 'usuarioUltActualizacion',
    OffererId = 'idOferente',
    FolderTypeCode = 'codCarpetaTipo',
    PersonId = 'idPersona',
    BureauLastRequestId = 'idBasesPublicasConsultaUltimo',
    LastLufeRequestId = 'idLufeConsultaUltimo',
    FolderStateCode = 'codCarpetaEstado',
    CreateUser = 'usuarioAlta',
    HasAssociatedLufeRequest = 'tieneConsultaLufeAsociada',
    HasLufeIntegration = 'tieneIntegracionLufe',
    PersonTypeCode = 'codPersonaTipo'
}


export interface OffererClientPortfolioDetail extends EntityWithId<string> {
    [OffererClientPortfolioDetailFields.BureauLastRequestId]: number;
    [OffererClientPortfolioDetailFields.LastLufeRequestId]: number;
    [OffererClientPortfolioDetailFields.BusinessName]: string;
    [OffererClientPortfolioDetailFields.CUIT]: string;
    [OffererClientPortfolioDetailFields.CreationDate]: Date;
    [OffererClientPortfolioDetailFields.LastModifiedDate]: Date;
    [OffererClientPortfolioDetailFields.UserLastModify]: string;
    [OffererClientPortfolioDetailFields.CreateUser]: string;
    [OffererClientPortfolioDetailFields.FolderTypeCode]: number;
    [OffererClientPortfolioDetailFields.FolderStateCode]: number;
    [OffererClientPortfolioDetailFields.HasAssociatedLufeRequest]: boolean;
    [OffererClientPortfolioDetailFields.HasLufeIntegration]: boolean;
    [OffererClientPortfolioDetailFields.PersonTypeCode]?: PersonTypes
}


export enum OffererClientPortfolioNewFormFields {
    CUIT = 'cuit',
    ClientPortfolioTypeCode = 'codCarpetaTipo',
    OffererId = 'idOferente'
}


export interface OffererClientPortfolioNewForm {
    [OffererClientPortfolioNewFormFields.CUIT]: string;
    [OffererClientPortfolioNewFormFields.ClientPortfolioTypeCode]: number;
    [OffererClientPortfolioNewFormFields.OffererId]: number;
}


export enum OffererClientPortfolioNewBatchFormFields {
    ExcelCuits = 'ExcelFile',
    ClientPortfolioTypeCode = 'codCarpetaTipo',
    OffererId = 'idOferente'
}


export interface OffererClientPortfolioNewBatchForm {
    [OffererClientPortfolioNewBatchFormFields.ExcelCuits]: File;
    [OffererClientPortfolioNewBatchFormFields.ClientPortfolioTypeCode]: number;
    [OffererClientPortfolioNewBatchFormFields.OffererId]: number;
}

export interface CarpetaBatchSincronizacionResponse {
    id: string;
    idOferente: number;
    fechaInicioProcesamiento: string;
    fechaFinProcesamiento?: string;
    totalCuits: number;
    cuitsProcesados: number;
    bitProcesadoBatch: number;
    cuitsPendientes: number;
}

export interface CarpetaBatchSincronizacionDetalleResponse {
    id: string;
    cuit: string;
    bitProcesado: number;
    fechaProcesado?: string; 
    mensajeError?: string;
    idPersona?: number;
    razonSocial?: string;
    descEstado?: string;
}

export enum CarpetaBatchSincronizacionResponseFields {
    Id = 'id',
    IdOferente = 'idOferente',
    FechaInicioProcesamiento = 'fechaInicioProcesamiento',
    FechaFinProcesamiento = 'fechaFinProcesamiento',
    TotalCuits = 'totalCuits',
    CuitsProcesados = 'cuitsProcesados',
    BitProcesadoBatch = 'bitProcesadoBatch',
    CuitsPendientes = 'cuitsPendientes'
}

export enum CarpetaBatchSincronizacionDetalleResponseFields {
    Id = 'id',
    Cuit = 'cuit',
    BitProcesado = 'bitProcesado',
    FechaProcesado = 'fechaProcesado',
    MensajeError = 'mensajeError',
    IdPersona = 'idPersona',
    RazonSocial = 'razonSocial',
    DescEstado = 'descEstado'
}

export interface CarpetaBatchConDetallesResponse {
    batch: CarpetaBatchSincronizacionResponse;
    carpetas: CarpetaBatchSincronizacionDetalleResponse[];
}

export interface BatchProcessingState {
    activeBatches: Map<string, CarpetaBatchConDetallesResponse>;
    pollingIntervals: Map<string, NodeJS.Timeout>;
}


export enum OffererClientPortfolioTypes {
    External = 1,
    LUC = 2
}