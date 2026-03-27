import {BaseRequest, EntityWithIdAndDescription} from "../baseEntities";


export enum AdViewFields {
    Detail = 'detalle',
    Id = 'id',
    Description = 'descripcion',
    AdDestinationTypeCode = 'codPublicidadDestinoTipo',
    ImageUrl = 'urlImagen',
    DestinationUrl = 'urlDestino',
    Header = 'encabezado',
    ButtonName = 'nombreBoton'
}


export enum AdDestinationTypes {
    Platform = 1,
    External = 2,
    Video = 3,
    MarketAdvancedSearch = 4,
    CompanyBureau = 5
}

export enum AdDestinationTypeFields {
    MarketSectionSearchCode = 'codBusquedaSeccion'
}

export interface AdDestinationType extends EntityWithIdAndDescription {
    [AdDestinationTypeFields.MarketSectionSearchCode]?: number
}

export interface AdView {
    [AdViewFields.Detail]: string;
    [AdViewFields.Id]: string;
    [AdViewFields.Description]: string;
    [AdViewFields.AdDestinationTypeCode]: AdDestinationTypes,
    [AdViewFields.ImageUrl]: string;
    [AdViewFields.DestinationUrl]: string;
    [AdViewFields.Header]: string;
    [AdViewFields.ButtonName]: string;
}


export enum AdViewDetailFields {
    AdLocationTypeCode = 'codPublicidadUbicacionTipo',
    AdLocationTypeDesc = 'descPublicidadUbicacionTipo',
    Active = 'activo',
    Order = 'orden',
    ProposalHeader = 'encabezadoPropuesta',
    ProposalButtonName = 'nombreBotonPropuesta',
    ProposalDetail = 'detallePropuesta',
    ProposalDescription = 'descripcionPropuesta',
    ProposalOrder = 'ordenPropuesta',
    ProposalActive = 'activoPropuesta',
}


export interface AdViewDetail extends AdView {
    [AdViewDetailFields.AdLocationTypeCode]: number;
    [AdViewDetailFields.AdLocationTypeDesc]: string;
    [AdViewDetailFields.Order]: number;
    [AdViewDetailFields.Active]: boolean;
    [AdViewDetailFields.ProposalHeader]: string;
    [AdViewDetailFields.ProposalButtonName]: string;
    [AdViewDetailFields.ProposalDetail]: string;
    [AdViewDetailFields.ProposalDescription]: string;
    [AdViewDetailFields.ProposalOrder]: number;
    [AdViewDetailFields.ProposalActive]: boolean;
}


export enum AdInsertFields {
    ProposalDescription = 'descripcionPropuesta',
    ProposalDetail = 'detallePropuesta',
    AdDestinationTypeCode = 'codPublicidadDestinoTipo',
    AdLocationTypeCode = 'codPublicidadUbicacionTipo',
    ImageUrl = 'urlImagen',
    DestinationUrl = 'urlDestino',
    ProposalOrder = 'ordenPropuesta',
    ProposalActive = 'activoPropuesta',
    ProposalHeader = 'encabezadoPropuesta',
    ProposalButtonName = 'nombreBotonPropuesta'
}


export interface AdInsert extends BaseRequest {
    [AdInsertFields.ProposalDescription]: string;
    [AdInsertFields.ProposalDetail]: string;
    [AdInsertFields.AdDestinationTypeCode]: number | null;
    [AdInsertFields.AdLocationTypeCode]: number | null;
    [AdInsertFields.ImageUrl]: string;
    [AdInsertFields.DestinationUrl]: string;
    [AdInsertFields.ProposalActive]?: boolean;
    [AdInsertFields.ProposalOrder]?: number | null;
    [AdInsertFields.ProposalHeader]: string;
    [AdInsertFields.ProposalButtonName]: string;
}


export enum AdLocationFormFields {
    AdLocationTypeCode = 'codPublicidadUbicacionTipo'
}


export interface AdLocationForm {
    [AdLocationFormFields.AdLocationTypeCode]?: number | null;
}


export enum AdHistoryViewFields {
    Observations = 'observaciones',
    Date = 'fecha',
    UserBusinessName = 'razonSocialUsuario'
}


export interface AdHistoryView {
    [AdHistoryViewFields.Observations]: string;
    [AdHistoryViewFields.Date]: Date;
    [AdHistoryViewFields.UserBusinessName]: string;
}