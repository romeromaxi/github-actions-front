import {
  EntityAddress,
  EntityMail,
  EntityPhoneNumber,
} from '../general/generalReferentialData';
import {PersonPersonalDataView} from "../person/personData";

export enum CompanyPersonReferentialDataFields {
  CompanyId = 'idEmpresa',
}

export interface CompanyPersonMailViewDTO extends EntityMail {
  [CompanyPersonReferentialDataFields.CompanyId]: number;
}

export interface CompanyPersonPhoneViewDTO extends EntityPhoneNumber {
  [CompanyPersonReferentialDataFields.CompanyId]: number;
}

export interface CompanyPersonAddressViewDTO extends EntityAddress {
  [CompanyPersonReferentialDataFields.CompanyId]: number;
}

export enum PersonPersonalDataFields {
  CompanyId = 'idEmpresa'
}

export interface CompanyPersonPersonalDataView extends PersonPersonalDataView {
  [PersonPersonalDataFields.CompanyId]: number;
}

export enum CompanyPersonBondTypes {
  Responsible = 1,
  Counter = 2,
  Employee = 3,
  Other = 4,
}
