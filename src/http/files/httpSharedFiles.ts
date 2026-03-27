import {BaseResponse} from "../../types/baseEntities";
import {HttpAxiosRequest} from "../httpAxiosBase";
import { Document } from 'types/files/filesData';
import {
    SharedDocumentationData,
    SharedDocumentationPost,
    SharedDocumentationValidation
} from "../../types/files/sharedDocumentation";


export const HttpSharedFiles = {
    getEndpoint: (url: string = '') => `documentos-compartidos${url}`,
    
    shareDocuments: (docs: SharedDocumentationPost) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSharedFiles.getEndpoint(),
            docs
        )
    },
    
    getDataByGuid: (guid: string) : Promise<SharedDocumentationData> => {
        return HttpAxiosRequest.get(
            HttpSharedFiles.getEndpoint(`/${guid}`)
        )
    },
    
    getDocsByGuid: (guid: string) : Promise<Document[]> => {
        return HttpAxiosRequest.get(
            HttpSharedFiles.getEndpoint(`/${guid}/documentos`)
        )
    },
    
    generateByGuid: (guid: string, captcha: string) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSharedFiles.getEndpoint(`/${guid}/generar`),
            { captcha: captcha }
        )
    },

    validateByGuid: (guid: string, validationDocs: SharedDocumentationValidation) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSharedFiles.getEndpoint(`/${guid}/validar`),
            validationDocs
        )
    },
}