import {
  Document,
  FileFilterSearch,
  FinancialYearDocument,
  FinancialYearFileFilter,
  LibraryFilterAll,
  PeopleDocument,
  RelatedPeopleFileFilter,
  StatementsFile,
} from '../../types/files/filesData';
import { EntityListWithPagination } from '../../types/baseEntities';
import { HttpAxiosRequest } from '../httpAxiosBase';
import { DocumentFolderDetail } from '../../types/files/filesFoldersData';

export const HttpFilesCompanySearch = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}${url}`,

  search: (
    companyId: number,
    filter: FileFilterSearch,
  ): Promise<EntityListWithPagination<Document>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesCompanySearch.getEndpoint(companyId, `/archivos/busqueda`),
      { ...filter },
    );
  },

  searchAllWithFolders: (
    companyId: number,
    filter: LibraryFilterAll,
  ): Promise<DocumentFolderDetail> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesCompanySearch.getEndpoint(companyId, `/archivos/todos/busqueda`),
      filter,
    );
  },

  searchActivities: (
    companyId: number,
    filter: FileFilterSearch,
  ): Promise<EntityListWithPagination<Document>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesCompanySearch.getEndpoint(companyId, '/actividades/archivos'),
      { ...filter },
    );
  },

  searchAssociates: (
    companyId: number,
    filter: RelatedPeopleFileFilter,
  ): Promise<EntityListWithPagination<PeopleDocument>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesCompanySearch.getEndpoint(
        companyId,
        '/personas/societarias/archivos',
      ),
      { ...filter },
    );
  },

  searchResponsibles: (
    companyId: number,
    filter: RelatedPeopleFileFilter,
  ): Promise<EntityListWithPagination<PeopleDocument>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesCompanySearch.getEndpoint(
        companyId,
        '/personas/responsables/archivos',
      ),
      { ...filter },
    );
  },

  searchRepresentatives: (
    companyId: number,
    filter: RelatedPeopleFileFilter,
  ): Promise<EntityListWithPagination<PeopleDocument>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesCompanySearch.getEndpoint(
        companyId,
        '/personas/representantes/archivos',
      ),
      { ...filter },
    );
  },

  searchExercises: (
    companyId: number,
    filter: FinancialYearFileFilter,
  ): Promise<EntityListWithPagination<FinancialYearDocument>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesCompanySearch.getEndpoint(companyId, '/ejercicios/archivos'),
      { ...filter },
    );
  },

  searchStatements: (
    companyId: number,
    filter: FinancialYearFileFilter,
  ): Promise<EntityListWithPagination<StatementsFile>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesCompanySearch.getEndpoint(
        companyId,
        '/estados-contables/archivos',
      ),
      { ...filter },
    );
  },

  searchFlows: (
    companyId: number,
    filter: FileFilterSearch,
  ): Promise<EntityListWithPagination<Document>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesCompanySearch.getEndpoint(companyId, '/movimientos/archivos'),
      { ...filter },
    );
  },
};
