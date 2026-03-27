import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  CompanyAffidavit,
  CompanyCertifications,
  CompanyDeclarationOfAssets, CompanyDeclarationOfAssetsInsert,
  CompanyDeclarationOfAssetsTotals,
  CompanyFinanceHeader,
  CompanyFinancialTotals,
  CompanyFinancialYear,
  CompanyIncomeLastYearStatement,
  CompanyLastYearDeclarationOfAssets,
  CompanyPatrimonialStatement,
} from 'types/company/companyFinanceInformationData';
import {
  BaseResponse,
  EntityWithIdAndDescription
} from '../../types/baseEntities';
import { FileBlobResponse } from '../../types/files/filesData';
import {
  FinancialIndicators,
  FinancialYearInsert, IncomeStatementWithPrevious,
  PatrimonialStatementWithPrevious
} from "../../types/general/generalFinanceData";

export const HttpCompanyFinance = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/ejercicios${url}`,

  getById: (
    companyId: number,
    financialYearId: number,
  ): Promise<CompanyFinancialYear> => {
    return HttpAxiosRequest.get(
      HttpCompanyFinance.getEndpoint(companyId, `/${financialYearId}`),
    );
  },

  getListByCompanyId: (companyId: number): Promise<CompanyFinancialYear[]> => {
    return HttpAxiosRequest.get(HttpCompanyFinance.getEndpoint(companyId));
  },

  insert: (
    companyId: number,
    newFinance: FinancialYearInsert,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(HttpCompanyFinance.getEndpoint(companyId), {
      ...newFinance,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  getTotalsByCompanyId: (
    companyId: number,
  ): Promise<CompanyFinancialTotals[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFinance.getEndpoint(companyId, '/totales'),
    );
  },

  getPreviousTotalsByCompanyId: (
    companyId: number,
  ): Promise<CompanyFinancialTotals[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFinance.getEndpoint(companyId, '/totales/anterior'),
    );
  },

  getIndicatorsByCompanyId: (
    companyId: number,
  ): Promise<FinancialIndicators[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFinance.getEndpoint(companyId, '/indicadores'),
    );
  },

  validate: (companyId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyFinance.getEndpoint(companyId, `/validar`),
      {},
    );
  },

  deleteFinancialYear: (
    companyId: number,
    financialYearId: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.delete(
      HttpCompanyFinance.getEndpoint(companyId, `/${financialYearId}`),
    );
  },

  getYears: (companyId: number): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFinance.getEndpoint(companyId, '/anios'),
    );
  },

  exportToExcel: (
    companyId: number,
    statementId: number,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompanyFinance.getEndpoint(
        companyId,
        `/exportar/${statementId}/excel`,
      ),
    ),

  exportLastToExcel: (companyId: number): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompanyFinance.getEndpoint(companyId, `/exportar/ultimos/excel`),
    ),
};

export const HttpCompanyPatrimonialStatement = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/estado-patrimonial${url}`,

  getById: (
    companyId: number,
    patrimonialStatementId: number,
  ): Promise<CompanyPatrimonialStatement> => {
    return HttpAxiosRequest.get(
      HttpCompanyPatrimonialStatement.getEndpoint(
        companyId,
        `/${patrimonialStatementId}`,
      ),
    );
  },

  getLast: (companyId: number): Promise<CompanyPatrimonialStatement> => {
    return HttpAxiosRequest.get(
      HttpCompanyPatrimonialStatement.getEndpoint(companyId, '/ultimo'),
    );
  },

  getPrevious: (companyId: number): Promise<CompanyPatrimonialStatement> => {
    return HttpAxiosRequest.get(
      HttpCompanyPatrimonialStatement.getEndpoint(companyId, '/anterior'),
    );
  },

  update: (
    companyId: number,
    patrimonialStatementId: number,
    patrimonialStatement: PatrimonialStatementWithPrevious,
  ): Promise<any> => {
    return HttpAxiosRequest.put(
      HttpCompanyPatrimonialStatement.getEndpoint(
        companyId,
        `/${patrimonialStatementId}`,
      ),
      {
        ...patrimonialStatement,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },
};

export const HttpCompanyIncomeStatement = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/estado-resultado${url}`,

  getById: (
    companyId: number,
    incomeStatementId: number,
  ): Promise<CompanyIncomeLastYearStatement> => {
    return HttpAxiosRequest.get(
      HttpCompanyIncomeStatement.getEndpoint(
        companyId,
        `/${incomeStatementId}`,
      ),
    );
  },

  getLast: (companyId: number): Promise<CompanyIncomeLastYearStatement> => {
    return HttpAxiosRequest.get(
      HttpCompanyIncomeStatement.getEndpoint(companyId, '/ultimo'),
    );
  },

  getPrevious: (companyId: number): Promise<CompanyIncomeLastYearStatement> => {
    return HttpAxiosRequest.get(
      HttpCompanyIncomeStatement.getEndpoint(companyId, '/anterior'),
    );
  },

  update: (
    companyId: number,
    incomeStatementId: number,
    incomeStatement: IncomeStatementWithPrevious,
  ): Promise<any> => {
    return HttpAxiosRequest.put(
      HttpCompanyIncomeStatement.getEndpoint(
        companyId,
        `/${incomeStatementId}`,
      ),
      {
        ...incomeStatement,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },
};

export const HttpCompanyAffidavit = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/declaraciones-juradas${url}`,

  getHeaderByCompany: (companyId: number): Promise<CompanyFinanceHeader[]> => {
    return HttpAxiosRequest.get(HttpCompanyAffidavit.getEndpoint(companyId));
  },

  getById: (
    companyId: number,
    affidavitId: number,
  ): Promise<CompanyAffidavit> => {
    return HttpAxiosRequest.get(
      HttpCompanyAffidavit.getEndpoint(companyId, `/${affidavitId}`),
    );
  },

  insert: (
    companyId: number,
    financeHeader: CompanyFinanceHeader,
  ): Promise<number> => {
    return HttpAxiosRequest.post(HttpCompanyAffidavit.getEndpoint(companyId), {
      ...financeHeader,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  update: (
    companyId: number,
    affidavitId: number,
    affidavit: CompanyAffidavit,
  ): Promise<any> => {
    return HttpAxiosRequest.put(
      HttpCompanyAffidavit.getEndpoint(companyId, `/${affidavitId}`),
      {
        ...affidavit,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  delete: (companyId: number, affidavitId: number): Promise<void> => {
    return HttpAxiosRequest.delete(
      HttpCompanyAffidavit.getEndpoint(companyId, `/${affidavitId}`),
    );
  },

  exportToExcel: (
    companyId: number,
    affidavitId: number,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompanyAffidavit.getEndpoint(
        companyId,
        `/exportar/${affidavitId}/excel`,
      ),
    ),
};

export const HttpCompanyCertifications = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/certificaciones${url}`,

  getHeaderByCompany: (companyId: number): Promise<CompanyFinanceHeader[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyCertifications.getEndpoint(companyId),
    );
  },

  getById: (
    companyId: number,
    certificationsId: number,
  ): Promise<CompanyCertifications> => {
    return HttpAxiosRequest.get(
      HttpCompanyCertifications.getEndpoint(companyId, `/${certificationsId}`),
    );
  },

  insert: (
    companyId: number,
    financeHeader: CompanyFinanceHeader,
  ): Promise<number> => {
    return HttpAxiosRequest.post(
      HttpCompanyCertifications.getEndpoint(companyId),
      {
        ...financeHeader,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  update: (
    companyId: number,
    certificationsId: number,
    certifications: CompanyCertifications,
  ): Promise<any> => {
    return HttpAxiosRequest.put(
      HttpCompanyCertifications.getEndpoint(companyId, `/${certificationsId}`),
      {
        ...certifications,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  delete: (companyId: number, certificationsId: number): Promise<void> => {
    return HttpAxiosRequest.delete(
      HttpCompanyCertifications.getEndpoint(companyId, `/${certificationsId}`),
    );
  },

  exportToExcel: (
    companyId: number,
    affidavitId: number,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompanyCertifications.getEndpoint(
        companyId,
        `/exportar/${affidavitId}/excel`,
      ),
    ),
};

export const HttpCompanyDeclarationOfAssets = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/manifestaciones-bienes${url}`,

  getHeaderByCompany: (companyId: number): Promise<CompanyFinanceHeader[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyDeclarationOfAssets.getEndpoint(companyId),
    );
  },

  getLastByCompany: (
    companyId: number,
  ): Promise<CompanyLastYearDeclarationOfAssets> => {
    return HttpAxiosRequest.get(
      HttpCompanyDeclarationOfAssets.getEndpoint(companyId, `/ultima`),
    );
  },

  getById: (
    companyId: number,
    declarationOfAssetsId: number,
  ): Promise<CompanyLastYearDeclarationOfAssets> => {
    return HttpAxiosRequest.get(
      HttpCompanyDeclarationOfAssets.getEndpoint(
        companyId,
        `/${declarationOfAssetsId}`,
      ),
    );
  },

  getLastTotalsByCompany: (
    companyId: number,
  ): Promise<CompanyDeclarationOfAssetsTotals[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyDeclarationOfAssets.getEndpoint(companyId, '/totales'),
    );
  },

  insert: (
    companyId: number,
    financeHeader: CompanyDeclarationOfAssetsInsert,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyDeclarationOfAssets.getEndpoint(companyId),
      {
        ...financeHeader,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  update: (
    companyId: number,
    declarationOfAssetsId: number,
    declarationOfAssets: CompanyDeclarationOfAssets,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.put(
      HttpCompanyDeclarationOfAssets.getEndpoint(
        companyId,
        `/${declarationOfAssetsId}`,
      ),
      {
        ...declarationOfAssets,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  delete: (companyId: number, declarationOfAssetsId: number): Promise<void> => {
    return HttpAxiosRequest.delete(
      HttpCompanyDeclarationOfAssets.getEndpoint(
        companyId,
        `/${declarationOfAssetsId}`,
      ),
    );
  },

  exportToExcel: (
    companyId: number,
    declarationOfAssetsId: number,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompanyDeclarationOfAssets.getEndpoint(
        companyId,
        `/exportar/${declarationOfAssetsId}/excel`,
      ),
    ),

  exportLastToExcel: (companyId: number): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompanyDeclarationOfAssets.getEndpoint(
        companyId,
        `/exportar/ultimos/excel`,
      ),
    ),
};
