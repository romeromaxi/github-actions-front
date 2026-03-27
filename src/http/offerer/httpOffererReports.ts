import { HttpAxiosRequest } from '../httpAxiosBase';
import { FileBlobResponse } from '../../types/files/filesData';
import {
  OffererReportEvolutionViewsVsReceivedSolicitations,
  OffererReportLinesByProduct,
  OffererReportReceivedSolicitations,
  OffererReportSolicitationByTimeInStage,
  OffererReportSolicitationsByProduct,
  OffererReportSolicitationsByStageAndTeam,
  OffererReportSolicitationsTimeByStage, OffererReportSummary,
} from '../../types/offerer/offererReports';
import { SolicitationEvolutionChartForm } from '../../pages/offerer/reports/components/charts/control-panel-charts/SolicitationEvolutionChartWithFilter';

import {BaseResponse, EntityWithIdAndDescriptionQuantity} from '../../types/baseEntities';
import { SolicitationStateChartForm } from '../../pages/offerer/reports/hooks/useSolicitationFilter';

export const HttpOffererReports = {
  getEndpoint: (offererId: number, url: string = ''): string =>
    `oferentes/${offererId}/reportes${url}`,
  
  getSummaryReports: (
      offererId: number
  ): Promise<OffererReportSummary[]> => {
     return HttpAxiosRequest.get(
         HttpOffererReports.getEndpoint(offererId)
     )
  },

  getLinesByProduct: (
    offererId: number,
  ): Promise<OffererReportLinesByProduct[]> => {
    return HttpAxiosRequest.get(
      HttpOffererReports.getEndpoint(offererId, '/lineas-por-productos'),
    );
  },

  exportLinesByProduct: (offererId: number): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlob(
      HttpOffererReports.getEndpoint(
        offererId,
        '/lineas-por-productos/exportar',
      ),
    );
  },

  getSolicitationsByProduct: (
    offererId: number,
  ): Promise<OffererReportSolicitationsByProduct[]> => {
    return HttpAxiosRequest.get(
      HttpOffererReports.getEndpoint(offererId, '/solicitudes-por-productos'),
    );
  },

  exportSolicitationsByProduct: (
    offererId: number,
  ): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlob(
      HttpOffererReports.getEndpoint(
        offererId,
        '/solicitudes-por-productos/exportar',
      ),
    );
  },

  getReceivedSolicitations: (
    offererId: number,
    filter: SolicitationStateChartForm,
  ): Promise<OffererReportReceivedSolicitations> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpOffererReports.getEndpoint(offererId, '/solicitudes-recibidas'),
      filter,
    );
  },

  exportReceivedSolicitations: (
    offererId: number,
    filter: SolicitationStateChartForm,
  ): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlobWithQueryParamsSerializer(
      HttpOffererReports.getEndpoint(
        offererId,
        '/solicitudes-recibidas/exportar',
      ),
      filter,
    );
  },

  getSolicitationsInAnalysis: (
    offererId: number,
    filter: SolicitationStateChartForm,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpOffererReports.getEndpoint(offererId, '/solicitudes-en-analisis'),
      filter,
    );
  },

  exportSolicitationsInAnalysis: (
    offererId: number,
    filter: SolicitationStateChartForm,
  ): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlobWithQueryParamsSerializer(
      HttpOffererReports.getEndpoint(
        offererId,
        '/solicitudes-en-analisis/exportar',
      ),
      filter,
    );
  },

  getEvolutionViewsVsReceivedSolicitations: (
    offererId: number,
    filter: SolicitationEvolutionChartForm,
  ): Promise<OffererReportEvolutionViewsVsReceivedSolicitations[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpOffererReports.getEndpoint(
        offererId,
        '/evolucion-visitas-vs-solicitudes',
      ),
      filter,
    );
  },

  exportEvolutionViewsVsReceivedSolicitations: (
    offererId: number,
    filter: SolicitationEvolutionChartForm,
  ): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlobWithQueryParamsSerializer(
      HttpOffererReports.getEndpoint(
        offererId,
        '/evolucion-visitas-vs-solicitudes/exportar',
      ),
      filter,
    );
  },

  getSolicitationsByStageAndTeam: (
    offererId: number,
  ): Promise<OffererReportSolicitationsByStageAndTeam[]> => {
    return HttpAxiosRequest.get(
      HttpOffererReports.getEndpoint(offererId, '/solicitudes-por-etapa-equipo'),
    );
  },

  exportSolicitationsByStageAndTeam: (
    offererId: number,
  ): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlob(
      HttpOffererReports.getEndpoint(
        offererId,
        '/solicitudes-por-etapa-equipo/exportar',
      ),
    );
  },

  getSolicitationsAverageTimeByStage: (
    offererId: number,
    filter: SolicitationStateChartForm = {},
  ): Promise<OffererReportSolicitationsTimeByStage> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpOffererReports.getEndpoint(offererId, '/tiempo-promedio-por-etapa'),
      filter,
    );
  },

  exportSolicitationsAverageTimeByStage: (
    offererId: number,
    filter: SolicitationStateChartForm = {},
  ): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlobWithQueryParamsSerializer(
      HttpOffererReports.getEndpoint(
        offererId,
        '/tiempo-promedio-por-etapa/exportar',
      ),
      filter,
    );
  },

  getSolicitationsByTimeInStage: (
    offererId: number,
    filter: SolicitationStateChartForm = {},
  ): Promise<OffererReportSolicitationByTimeInStage[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpOffererReports.getEndpoint(offererId, '/tiempo-solicitudes-por-etapa'),
      filter,
    );
  },

  exportSolicitationsByTimeInStage: (
    offererId: number,
    filter: SolicitationStateChartForm = {},
  ): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlobWithQueryParamsSerializer(
      HttpOffererReports.getEndpoint(
        offererId,
        '/tiempo-solicitudes-por-etapa/exportar',
      ),
      filter,
    );
  },

  createReportInstance: (offererId: number, reportId: number, params: { [key: string]: any }) : Promise<BaseResponse> =>
      HttpAxiosRequest.post(
          HttpOffererReports.getEndpoint(offererId, `/${reportId}`),
          params
      ),
};
