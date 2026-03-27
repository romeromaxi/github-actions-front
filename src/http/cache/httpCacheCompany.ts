import { HttpAxiosRequest } from '../httpAxiosBase';

import { PersonRelationshipTypeClassification } from 'types/company/companyEnums';
import {
  CompanyCompetitiveAdvantage,
  CompanyRange,
} from 'types/company/companyActivityData';
import { EntityWithIdAndDescription } from 'types/baseEntities';
import { EntityWithIdAndDescriptionAndDetail } from '../../types/baseEntities';

export const HttpCacheCompany = {
  getEndpoint: (url: string): string => `cache/empresa${url}`,

  getRolesTypes: (): Promise<EntityWithIdAndDescriptionAndDetail[]> => {
    return HttpAxiosRequest.get(
      HttpCacheCompany.getEndpoint('/usuario/relaciones'),
    );
  },

  getRolesTypesDetails: (): Promise<EntityWithIdAndDescriptionAndDetail[]> => 
    HttpAxiosRequest.get(
        HttpCacheCompany.getEndpoint('/usuario/relaciones/detalles'),
    ),

  getStates: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpCacheCompany.getEndpoint('/estados'));
  },

  getRelationshipTypesSocieties: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheCompany.getEndpoint('/persona/societarias'),
    );
  },

  getRelationshipTypesAdministrators: (): Promise<
    EntityWithIdAndDescription[]
  > => {
    return HttpAxiosRequest.get(
      HttpCacheCompany.getEndpoint('/persona/administradores'),
    );
  },

  getRelationshipTypesRepresentatives: (): Promise<
    EntityWithIdAndDescription[]
  > => {
    return HttpAxiosRequest.get(
      HttpCacheCompany.getEndpoint('/persona/representantes'),
    );
  },

  getRelationshipTypesResponsibles: (): Promise<
    EntityWithIdAndDescription[]
  > => {
    return HttpAxiosRequest.get(
      HttpCacheCompany.getEndpoint('/persona/responsables'),
    );
  },

  getRelationshipTypesLegal: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheCompany.getEndpoint('/persona/juridicas'),
    );
  },

  getRelationshipTypesPhysical: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheCompany.getEndpoint('/persona/humanas'),
    );
  },

  getRelationshipTypesByClassification: (
    classification: PersonRelationshipTypeClassification,
  ): Promise<EntityWithIdAndDescription[]> => {
    switch (classification) {
      case PersonRelationshipTypeClassification.Society:
        return HttpCacheCompany.getRelationshipTypesSocieties();

      case PersonRelationshipTypeClassification.Administrators:
        return HttpCacheCompany.getRelationshipTypesAdministrators();

      case PersonRelationshipTypeClassification.Representatives:
        return HttpCacheCompany.getRelationshipTypesRepresentatives();

      case PersonRelationshipTypeClassification.Responsibles:
        return HttpCacheCompany.getRelationshipTypesResponsibles();
    }

    return Promise.resolve([]);
  },

  getRanges: (): Promise<CompanyRange[]> => {
    return HttpAxiosRequest.get(HttpCacheCompany.getEndpoint('/rangos'));
  },

  getCompanyCompetitiveAdvantages: (): Promise<
    CompanyCompetitiveAdvantage[]
  > => {
    return HttpAxiosRequest.get(HttpCacheCompany.getEndpoint('/ventajas'));
  },

  getMonotaxTypes: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheCompany.getEndpoint('/monotributo-tipos'),
    );
  },

  getSelfEmployedTypes: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheCompany.getEndpoint('/autonomo-tipos'),
    );
  },

  getBondsForPhysicalPerson: (
    onlyValidatedCompany: boolean = true,
  ): Promise<EntityWithIdAndDescription[]> =>
    HttpCacheCompany._getBonds(
      '/usuario/vinculos/humanas',
      onlyValidatedCompany,
    ),

  getBondsForLegalPerson: (
    onlyValidatedCompany: boolean = true,
  ): Promise<EntityWithIdAndDescription[]> =>
    HttpCacheCompany._getBonds(
      '/usuario/vinculos/juridicas',
      onlyValidatedCompany,
    ),

  _getBonds: (
    route: string,
    onlyValidatedCompany: boolean,
  ): Promise<EntityWithIdAndDescription[]> => {
    const queryParams = onlyValidatedCompany ? {} : { todos: true };

    return HttpAxiosRequest.getWithQueryParams(
      HttpCacheCompany.getEndpoint(route),
      queryParams,
    );
  },
};
