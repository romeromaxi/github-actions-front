import { HttpAxiosRequest } from '../httpAxiosBase';

import {
  CompanyPersonRelationship,
  RelatedPersonWithReferentialData,
  RelatedPersonWithReferentialDataFields,
  SocietyPerson,
} from 'types/company/companySocietyData';
import {
  HttpCompanyPersonAddress,
  HttpCompanyPersonMail,
  HttpCompanyPersonPhoneNumber,
} from 'http/index';
import { PersonRelationshipTypeClassification } from '../../types/company/companyEnums';
import { BaseRequestFields, BaseResponse } from '../../types/baseEntities';
import {
  CompanyPersonPersonalDataView,
} from '../../types/company/companyPersonReferentialData';
import {
  PersonPersonalDataInsert,
  PersonRelationshipFilter,
  PersonRelationshipInsert,
  PersonRelationshipUpdate
} from "../../types/person/personData";

export const HttpCompanyRelationship = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/personas${url}`,

  insertRelationship: (
    companyId: number,
    relationship: PersonRelationshipInsert,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyRelationship.getEndpoint(companyId),
      {
        ...relationship,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  updateRelationship: (
    companyId: number,
    relationshipId: number,
    relationship: PersonRelationshipUpdate,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.put(
      HttpCompanyRelationship.getEndpoint(companyId, `/${relationshipId}`),
      {
        ...relationship,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  delete: (
    companyId: number,
    companySocietyId: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.delete(
      HttpCompanyRelationship.getEndpoint(companyId, `/${companySocietyId}`),
    );
  },

  getRelationships: (
    companyId: number,
    filter: PersonRelationshipFilter,
  ): Promise<CompanyPersonRelationship[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpCompanyRelationship.getEndpoint(companyId),
      { ...filter },
    );
  },

  getRelationshipSocieties: (companyId: number): Promise<SocietyPerson[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyRelationship.getEndpoint(companyId, '/societarias'),
    );
  },

  getRelationshipAdministrators: (
    companyId: number,
  ): Promise<SocietyPerson[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyRelationship.getEndpoint(companyId, '/administradores'),
    );
  },

  getRelationshipRepresentatives: (
    companyId: number,
  ): Promise<SocietyPerson[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyRelationship.getEndpoint(companyId, '/representantes'),
    );
  },

  getRelationshipResponsibles: (
    companyId: number,
  ): Promise<SocietyPerson[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyRelationship.getEndpoint(companyId, '/responsables'),
    );
  },

  getRelationshipByClassification: (
    companyId: number,
    classification: PersonRelationshipTypeClassification,
  ): Promise<SocietyPerson[]> => {
    switch (classification) {
      case PersonRelationshipTypeClassification.Society:
        return HttpCompanyRelationship.getRelationshipSocieties(companyId);

      case PersonRelationshipTypeClassification.Administrators:
        return HttpCompanyRelationship.getRelationshipAdministrators(companyId);

      case PersonRelationshipTypeClassification.Representatives:
        return HttpCompanyRelationship.getRelationshipRepresentatives(
          companyId,
        );

      case PersonRelationshipTypeClassification.Responsibles:
        return HttpCompanyRelationship.getRelationshipResponsibles(companyId);
    }
  },

  getPersonalDataByIdPerson: (
    companyId: number,
    personId: number,
  ): Promise<CompanyPersonPersonalDataView> => {
    return HttpAxiosRequest.get(
      HttpCompanyRelationship.getEndpoint(
        companyId,
        `/${personId}/datos-personales`,
      ),
    );
  },

  updatePersonalDataByIdPerson: (
    companyId: number,
    personId: number,
    personData: PersonPersonalDataInsert,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.put(
      HttpCompanyRelationship.getEndpoint(
        companyId,
        `/${personId}/datos-personales`,
      ),
      {
        ...personData,
        [BaseRequestFields.OriginCode]: 1,
        [BaseRequestFields.ModuleCode]: 1,
      },
    );
  },

  getPersonWithReferentialData: (
    companyId: number,
    personId: number,
  ): Promise<RelatedPersonWithReferentialData> => {
    return Promise.all([
      HttpCompanyRelationship.getPersonalDataByIdPerson(companyId, personId),
      HttpCompanyPersonPhoneNumber.get(companyId, personId),
      HttpCompanyPersonMail.get(companyId, personId),
      HttpCompanyPersonAddress.get(companyId, personId),
    ]).then((values) => {
      return {
        [RelatedPersonWithReferentialDataFields.Person]: values[0],
        [RelatedPersonWithReferentialDataFields.Phone]: values[1],
        [RelatedPersonWithReferentialDataFields.Mail]: values[2],
        [RelatedPersonWithReferentialDataFields.ListAddressess]: values[3],
      };
    });
  },
};
