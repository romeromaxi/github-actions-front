import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  FileBase,
  Document,
  GeneralFilesCompanyFilter,
} from 'types/files/filesData';
import { getFormDataFileInsert } from 'util/formatters/fileFormatter';

export const HttpFilesCompany = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/archivos${url}`,

  getFilesByIdCompany: (companyId: number): Promise<Document[]> => {
    return HttpAxiosRequest.get(HttpFilesCompany.getEndpoint(companyId));
  },

  getBySectionAndFileType: (
    companyId: number,
    filter: GeneralFilesCompanyFilter,
  ): Promise<Document[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesCompany.getEndpoint(companyId, '/general'),
      { ...filter },
    );
  },

  insert: (
    companyId: number,
    fileCompany: FileBase,
    file: File,
  ): Promise<number> => {
    let formData: FormData = getFormDataFileInsert(fileCompany, file);

    return HttpAxiosRequest.post(
      HttpFilesCompany.getEndpoint(companyId, ''),
      formData,
    );
  },

  getIdentityValidationDocuments: (companyId: number): Promise<Document[]> =>
    HttpAxiosRequest.get(HttpFilesCompany.getEndpoint(companyId, '/identidad')),
};

export const HttpFilesCompanyRelationship = {
  getEndpoint: (
    companyId: number,
    companyPersonId: number,
    url: string = '',
  ): string => `empresa/${companyId}/personas/${companyPersonId}/archivos${url}`,

  getFilesByCompanyAndPerson: (
    companyId: number,
    companyPersonId: number,
  ): Promise<Document[]> => {
    return HttpAxiosRequest.get(
      HttpFilesCompanyRelationship.getEndpoint(companyId, companyPersonId),
    );
  },

  insert: (
    companyId: number,
    companyPersonId: number,
    fileCompany: FileBase,
    file: File,
  ): Promise<number> => {
    let formData: FormData = getFormDataFileInsert(fileCompany, file);

    return HttpAxiosRequest.post(
      HttpFilesCompanyRelationship.getEndpoint(companyId, companyPersonId),
      formData,
    );
  },
};

export const HttpFilesCompanyFinancialYear = {
  getEndpoint: (
    companyId: number,
    financialYearId: number,
    url: string = '',
  ): string =>
    `empresa/${companyId}/ejercicios/${financialYearId}/archivos${url}`,

  getFilesByCompanyAndFinancialYear: (
    companyId: number,
    financialYearId: number,
  ): Promise<Document[]> => {
    return HttpAxiosRequest.get(
      HttpFilesCompanyFinancialYear.getEndpoint(companyId, financialYearId),
    );
  },

  insert: (
    companyId: number,
    financialYearId: number,
    fileCompany: FileBase,
    file: File,
  ): Promise<number> => {
    let formData: FormData = getFormDataFileInsert(fileCompany, file);

    return HttpAxiosRequest.post(
      HttpFilesCompanyFinancialYear.getEndpoint(companyId, financialYearId),
      formData,
    );
  },
};

export const HttpFilesCompanyCertifications = {
  getEndpoint: (
    companyId: number,
    certificationsId: number,
    url: string = '',
  ): string =>
    `empresa/${companyId}/certificaciones/${certificationsId}/archivos${url}`,

  getFilesByCompanyAndCertification: (
    companyId: number,
    certificationsId: number,
  ): Promise<Document[]> => {
    return HttpAxiosRequest.get(
      HttpFilesCompanyCertifications.getEndpoint(companyId, certificationsId),
    );
  },

  insert: (
    companyId: number,
    certificationsId: number,
    fileCompany: FileBase,
    file: File,
  ): Promise<number> => {
    let formData: FormData = getFormDataFileInsert(fileCompany, file);

    return HttpAxiosRequest.post(
      HttpFilesCompanyCertifications.getEndpoint(companyId, certificationsId),
      formData,
    );
  },
};

export const HttpFilesCompanyAffidavit = {
  getEndpoint: (
    companyId: number,
    affidavitId: number,
    url: string = '',
  ): string =>
    `empresa/${companyId}/declaraciones-juradas/${affidavitId}/archivos${url}`,

  getFilesByCompanyAndAffidavit: (
    companyId: number,
    affidavitId: number,
  ): Promise<Document[]> => {
    return HttpAxiosRequest.get(
      HttpFilesCompanyAffidavit.getEndpoint(companyId, affidavitId),
    );
  },

  insert: (
    companyId: number,
    affidavitId: number,
    fileCompany: FileBase,
    file: File,
  ): Promise<number> => {
    let formData: FormData = getFormDataFileInsert(fileCompany, file);

    return HttpAxiosRequest.post(
      HttpFilesCompanyAffidavit.getEndpoint(companyId, affidavitId),
      formData,
    );
  },
};

export const HttpFilesCompanyDeclarationAssets = {
  getEndpoint: (
    companyId: number,
    declarationAssetsId: number,
    url: string = '',
  ): string =>
    `empresa/${companyId}/manifestaciones-bienes/${declarationAssetsId}/archivos${url}`,

  getFilesByCompanyAndDeclarationAssets: (
    companyId: number,
    declarationAssetsId: number,
  ): Promise<Document[]> => {
    return HttpAxiosRequest.get(
      HttpFilesCompanyDeclarationAssets.getEndpoint(
        companyId,
        declarationAssetsId,
      ),
    );
  },

  insert: (
    companyId: number,
    declarationAssetsId: number,
    fileCompany: FileBase,
    file: File,
  ): Promise<number> => {
    let formData: FormData = getFormDataFileInsert(fileCompany, file);

    return HttpAxiosRequest.post(
      HttpFilesCompanyDeclarationAssets.getEndpoint(
        companyId,
        declarationAssetsId,
      ),
      formData,
    );
  },
};

export const HttpFilesCompanyBureau = {
  getEndpoint: (
    companyId: number,
    publicBasesQueryId: number,
    url: string = '',
  ): string =>
    `empresa/${companyId}/bases-publicas/${publicBasesQueryId}/archivos${url}`,

  getFileList: (
    companyId: number,
    publicBasesQueryId: number,
  ): Promise<Document[]> => {
    return HttpAxiosRequest.get(
      HttpFilesCompanyBureau.getEndpoint(companyId, publicBasesQueryId),
    );
  },

  insert: (
    companyId: number,
    publicBasesQueryId: number,
    fileCompany: FileBase,
    file: File,
  ): Promise<number> => {
    let formData: FormData = getFormDataFileInsert(fileCompany, file);

    return HttpAxiosRequest.post(
      HttpFilesCompanyBureau.getEndpoint(companyId, publicBasesQueryId),
      formData,
    );
  },
};
