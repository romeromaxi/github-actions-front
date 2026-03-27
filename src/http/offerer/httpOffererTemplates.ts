import { FileSolicitationTemplate } from '../../types/files/filesDataCache';
import { HttpAxiosRequest } from '../httpAxiosBase';
import { OffererTemplateListFilter } from '../../pages/offerer/templates/HomeOffererTemplates';
import { OffererTemplateInsert } from '../../types/offerer/offererData';
import { BaseResponse } from '../../types/baseEntities';

export const HttpOffererTemplates = {
  getEndpoint: (offererId: number, url: string): string =>
    `oferentes/${offererId}/plantillas${url}`,

  getByOffererId: (
    offererId: number,
    lstPersonTypeCods: OffererTemplateListFilter,
  ): Promise<FileSolicitationTemplate[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpOffererTemplates.getEndpoint(offererId, ''),
      lstPersonTypeCods,
    );
  },

  insert: (
    offererId: number,
    templateInsert: OffererTemplateInsert,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpOffererTemplates.getEndpoint(offererId, ''),
      {
        ...templateInsert,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  update: (
    offererId: number,
    templateId: number,
    templateInsert: OffererTemplateInsert,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.put(
      HttpOffererTemplates.getEndpoint(offererId, `/${templateId}`),
      {
        ...templateInsert,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  delete: (offererId: number, templateId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.delete(
      HttpOffererTemplates.getEndpoint(offererId, `/${templateId}`),
    );
  },
};
