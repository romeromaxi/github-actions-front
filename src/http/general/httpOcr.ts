import {HttpAxiosRequest} from "../httpAxiosBase";
import {FinancialStatement, FinancialStatementOCRProcess} from "../../types/general/generalFinanceData";
import {BaseResponseWithData} from "../../types/baseEntities";


export const HttpOcr = {
    getEndpoint: (url: string = '') => `ocr${url}`,
    
    processDocumentById: (documentId: number, data: FinancialStatementOCRProcess) : Promise<BaseResponseWithData<string>> => {
        return HttpAxiosRequest.post(
            HttpOcr.getEndpoint(`/balances/${documentId}`),
            data
        )
    },
    
    getBalancesByGuid: (guid: string): Promise<BaseResponseWithData<FinancialStatement>> => {
        return HttpAxiosRequest.get(
            HttpOcr.getEndpoint(`/balances/${guid}`)
        )
    },
    
    processDocumentByIdDynamic: (documentId: number, data: FinancialStatementOCRProcess) : Promise<BaseResponseWithData<string>> => {
        return HttpAxiosRequest.post(
            HttpOcr.getEndpoint(`/balances/${documentId}/extendido`),
            data
        )
    },
    
    getBalancesByGuidDynamic: (guid: string): Promise<BaseResponseWithData<any>> => {
        return HttpAxiosRequest.get(
            HttpOcr.getEndpoint(`/balances/${guid}/extendido`)
        )
    }
}