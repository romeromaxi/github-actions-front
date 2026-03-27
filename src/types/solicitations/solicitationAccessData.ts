import {EntityWithIdAndDescription} from "types/baseEntities";

export enum SolicitationAccessInterestedFields {
    CUIT = 'cuitInteresado'
}

export interface SolicitationAccessInterested extends EntityWithIdAndDescription {
    [SolicitationAccessInterestedFields.CUIT]: string
}