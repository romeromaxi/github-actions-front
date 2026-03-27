import {BaseResponse, BaseResponseWithData, EntityListWithPagination} from "../../types/baseEntities";
import {
    CarpetaBatchConDetallesResponse,
    CarpetaBatchSincronizacionResponse,
    OffererClientPortfolioDetail,
    OffererClientPortfolioFilter, OffererClientPortfolioNewForm,
    OffererClientPortfolioView
} from "../../types/offerer/clientPortfolioData";
import {HttpAxiosRequest} from "../httpAxiosBase";
import {ClientPortfolioFinancialYear} from "../../types/offerer/clientPortfolioFinancialData";
import {FinancialIndicators, FinancialYearInsert} from "../../types/general/generalFinanceData";
import {FileBlobResponse} from "../../types/files/filesData";
import {SolicitationSummaryViewDTO} from "../../types/solicitations/solicitationData";


export const HttpClientPortfolio = {
    getEndpoint: (url: string = '')=> `/carpetas${url}`,
    
    searchFolders : (offererId: number, filter: OffererClientPortfolioFilter) : Promise<EntityListWithPagination<OffererClientPortfolioView>> => {
        return HttpAxiosRequest.getWithQueryParams(
            HttpClientPortfolio.getEndpoint(`/${offererId}/busqueda`),
            filter
        )
    },
    
    getById: (clientPortfolioGuid: string) : Promise<OffererClientPortfolioDetail> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolio.getEndpoint(`/${clientPortfolioGuid}`)
        )
    },
    
    insertNew: (data: OffererClientPortfolioNewForm) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpClientPortfolio.getEndpoint('/sincronizar'),
            data
        )
    },

    syncBatch: (formData: FormData) : Promise<BaseResponseWithData<CarpetaBatchSincronizacionResponse>> => {
        return HttpAxiosRequest.postFormData(
            HttpClientPortfolio.getEndpoint('/sincronizar-batch'),
            formData
        )
    },

    getBatchStatus: (batchId: string) : Promise<CarpetaBatchConDetallesResponse> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolio.getEndpoint(`/batch-status/${batchId}`)
        )
    },

    getActiveBatches: (offererId: number) : Promise<CarpetaBatchSincronizacionResponse[]> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolio.getEndpoint(`/${offererId}/batches-activos`)
        )
    },
    
    getLinkedSolicitations: (clientPortfolioGuid: string) : Promise<SolicitationSummaryViewDTO[]> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolio.getEndpoint(`/${clientPortfolioGuid}/solicitudes-vinculadas`)
        )
    }
}


export const HttpClientPortfolioBalances = {
    getEndpoint: (guid: string, url: string = '')=> `/carpetas/${guid}/ejercicios${url}`,
    
    getListByGuid: (guid: string): Promise<ClientPortfolioFinancialYear[]> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolioBalances.getEndpoint(guid)
        )
    },
    
    getListByFolderId: (guid: string, folderId: number) : Promise<ClientPortfolioFinancialYear> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolioBalances.getEndpoint(guid, `/${folderId}`)
        )
    },
    
    getIndicators: (guid: string) : Promise<FinancialIndicators[]> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolioBalances.getEndpoint(guid, '/indicadores')
        )
    },
    
    insert: (guid: string, data: FinancialYearInsert) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpClientPortfolioBalances.getEndpoint(guid),
            {
                ...data,
                codModulo: 1,
                codOrigen: 1,
            }
        )
    },
    
    delete: (guid: string, balanceId: number) : Promise<BaseResponse> => {
        return HttpAxiosRequest.delete(
            HttpClientPortfolioBalances.getEndpoint(guid, `/${balanceId}`)
        )
    },

    exportToExcel: (
        guid: string,
        statementId: number,
    ): Promise<FileBlobResponse> =>
        HttpAxiosRequest.getBlob(
            HttpClientPortfolioBalances.getEndpoint(
                guid,
                `/exportar/${statementId}/excel`,
            ),
        ),
}