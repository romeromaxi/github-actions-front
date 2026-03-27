import { HttpAxiosRequest } from '../httpAxiosBase';
import { PersonRelationshipTypeClassification } from 'types/company/companyEnums';
import { FileBlobResponse } from 'types/files/filesData';
import {
  RelatedPersonType,
} from '../../types/company/companySocietyData';
import {PersonRelationshipFilter} from "../../types/person/personData";

export const HttpCompanyRelationshipExport = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/personas${url}`,

  exportSocietiesToExcel: (companyId: number): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompanyRelationshipExport.getEndpoint(
        companyId,
        `/societarias/exportar/excel`,
      ),
    ),

  exportListToExcel: (
    companyId: number,
    filter: PersonRelationshipFilter,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlobWithQueryParamsSerializer(
      HttpCompanyRelationshipExport.getEndpoint(companyId, `/exportar/excel`),
      filter,
    ),

  exportPersonToExcel: (
    companyId: number,
    personId: number,
    classification: PersonRelationshipTypeClassification,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompanyRelationshipExport.getEndpoint(
        companyId,
        `/${personId}/datos-personales/exportar/excel`,
      ),
    ),

  exportPayrollToExcel: (
    companyId: number,
    relationshipType: RelatedPersonType,
  ): Promise<FileBlobResponse> => {
    let route = '';

    switch (relationshipType) {
      case RelatedPersonType.Associate:
        route = 'socios';
        break;
      case RelatedPersonType.Authorities:
        route = 'Autoridades';
        break;
      case RelatedPersonType.Employees:
        route = 'Empleados';
        break;
    }

    return HttpAxiosRequest.getBlob(
      HttpCompanyRelationshipExport.getEndpoint(
        companyId,
        `/exportar/nominas/${route}/excel`,
      ),
    );
  },
};
