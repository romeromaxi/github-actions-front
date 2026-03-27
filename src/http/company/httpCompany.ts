import { HttpAxiosRequest } from 'http/httpAxiosBase';

import {
  CompanyFields,
  CompanyFileCompletenessView,
  CompanyFormData, CompanyHomeGeneralDataExportForm,
  CompanyQuaFilterSearch,
  CompanySectionsWithFileType,
  CompanyUnconfirmedRegisterData, CompanyUnconfirmedRegisterDataFields,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import {
  BaseRequestFields,
  BaseResponse,
  EntityListWithPagination,
  EntityWithIdAndDescription,
} from 'types/baseEntities';
import {FileBaseFields, FileBlobResponse} from 'types/files/filesData';
import { NewCompanyFormData } from '../../pages/company/newCompany/NewCompanyForm';
import { PersonUpdateValidateState } from '../../types/person/personData';

export const HttpCompany = {
  getEndpoint: (url: string): string => `empresa${url}`,

  getCompanyById: (id: number): Promise<CompanyViewDTO> => {
    return HttpAxiosRequest.get(HttpCompany.getEndpoint(`/${id}`));
  },

  getCompaniesByUser: (): Promise<CompanyViewDTO[]> => {
    return HttpAxiosRequest.get(HttpCompany.getEndpoint(''));
  },

  searchByFilter: (
    filter: CompanyQuaFilterSearch,
  ): Promise<EntityListWithPagination<CompanyViewDTO>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpCompany.getEndpoint('/busqueda'),
      filter,
    );
  },

  updateState: (
    companyId: number,
    data: PersonUpdateValidateState,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompany.getEndpoint(`/${companyId}/estado`),
      {
        ...data,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  updateCompany: (
    companyId: number,
    company: CompanyViewDTO | CompanyFormData,
  ) => {
    return HttpAxiosRequest.put(HttpCompany.getEndpoint(`/${companyId}`), {
      ...company,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  insertUnconfirmedCompany: (
    companyId: number,
    registerData: CompanyUnconfirmedRegisterData,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompany.getEndpoint(`/${companyId}/registracion-parcial`),
      {
        ...registerData,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },
  
  partialInsertNewCompany: (
      companyId: number,
      registerData: CompanyUnconfirmedRegisterData,
  ): Promise<BaseResponse> => {
    let formData = new FormData()
    
    formData.append(CompanyViewDTOFields.AreaCode, registerData[CompanyViewDTOFields.AreaCode] ?? '')
    formData.append(CompanyViewDTOFields.Phone, registerData[CompanyViewDTOFields.Phone] ?? '')
    formData.append(CompanyViewDTOFields.SocialNetwork, registerData[CompanyViewDTOFields.SocialNetwork] ?? '')
    formData.append(CompanyViewDTOFields.DayClosing, registerData[CompanyViewDTOFields.DayClosing] ?? '')
    formData.append(CompanyViewDTOFields.MonthClosing, registerData[CompanyViewDTOFields.MonthClosing] ?? '')
    formData.append(CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode, `${registerData[CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]}` ?? '')

    if (registerData[CompanyUnconfirmedRegisterDataFields.FileAble])
      formData.append(
          CompanyUnconfirmedRegisterDataFields.FileAble,
          registerData[CompanyUnconfirmedRegisterDataFields.FileAble].file,
          registerData[CompanyUnconfirmedRegisterDataFields.FileAble][FileBaseFields.FileDesc],
      );
    
    formData.append(CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail, registerData[CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail] ?? '')
    formData.append(CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId, !!registerData[CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId] ? `${registerData[CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId]}` : '')
    formData.append(BaseRequestFields.ModuleCode, '1')
    formData.append(BaseRequestFields.OriginCode, '1')
    
    return HttpAxiosRequest.post(
        HttpCompany.getEndpoint(`/${companyId}/registracion-parcial-nuevo`),
        formData
    );
  },

  getFileSections: (
    companyId: number,
  ): Promise<CompanySectionsWithFileType[]> => {
    return HttpAxiosRequest.get(
      HttpCompany.getEndpoint(`/${companyId}/secciones`),
    );
  },

  getRelatedData: (
    companyId: number,
    sectionCod: number,
  ): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCompany.getEndpoint(
        `/${companyId}/secciones/${sectionCod}/datos-relacionados`,
      ),
    );
  },

  updateSocialMedia: (
    companyId: number,
    website: string | null,
    socialNetwork: string | null,
  ) => {
    return HttpAxiosRequest.put(
      HttpCompany.getEndpoint(`/${companyId}/redes-sociales`),
      {
        [CompanyFields.Website]: website,
        [CompanyFields.SocialNetwork]: socialNetwork,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  updateClosingDate: (
    companyId: number,
    dayClosing: number,
    monthClosing: number,
  ) => {
    return HttpAxiosRequest.put(
      HttpCompany.getEndpoint(`/${companyId}/cierre`),
      {
        [CompanyViewDTOFields.DayClosing]: dayClosing,
        [CompanyViewDTOFields.MonthClosing]: monthClosing,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  updateLastFinancialYear: (companyId: number, lastFinancialYear: number) => {
    return HttpAxiosRequest.put(
      HttpCompany.getEndpoint(`/${companyId}/ultimo-cierre`),
      {
        [CompanyViewDTOFields.YearLastClosing]: lastFinancialYear,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  getCompanyLogo: (companyId: number): Promise<any> => {
    return HttpAxiosRequest.getBlob(
      HttpCompany.getEndpoint(`/${companyId}/logos`),
    );
  },

  updateCompanyLogo: (companyId: number, logo: File): Promise<void> => {
    let formData: FormData = new FormData();
    formData.append('file', logo);

    return HttpAxiosRequest.post(
      HttpCompany.getEndpoint(`/${companyId}/logos`),
      formData,
    );
  },

  validate: (companyId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompany.getEndpoint(`/${companyId}/validar`),
      {},
    );
  },

  finishRegister: (
    companyId: number,
    formData: NewCompanyFormData,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompany.getEndpoint(`/${companyId}/completar-registracion`),
      {
        ...formData,
        codOrigen: 1,
        codModulo: 1,
      },
    );
  },

  getCompletenessPercentage: (
    companyId: number,
  ): Promise<CompanyFileCompletenessView> => {
    return HttpAxiosRequest.get(
      HttpCompany.getEndpoint(`/${companyId}/completitud`),
    );
  },

  exportToExcel: (companyId: number): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompany.getEndpoint(`/${companyId}/exportar/excel`),
    ),

  exportToCsv: (companyId: number): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompany.getEndpoint(`/${companyId}/exportar/csv`),
    ),

  delete: (companyId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.delete(HttpCompany.getEndpoint(`/${companyId}`));
  },

  requestApproval: (
    companyId: number,
    data: FormData,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompany.getEndpoint(`/${companyId}/solicitar-aprobacion`),
      data,
    );
  },

  changeResponsible: (companyId: number): Promise<BaseResponse> =>
    HttpAxiosRequest.post(
      HttpCompany.getEndpoint(`/${companyId}/cambiar-responsable`), 
      {},
    ),

  exportSectionsToExcel: (
      companyId: number,
      data: CompanyHomeGeneralDataExportForm
  ): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlobWithQueryParamsSerializer(
        HttpCompany.getEndpoint(
            `/${companyId}/exportar/secciones/excel`
        ),
        data
    );
  },
};
