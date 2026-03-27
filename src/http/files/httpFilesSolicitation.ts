import {HttpAxiosRequest} from '../httpAxiosBase';
import {
    Document,
    FileBase,
    FileSolicitation,
    DocumentToFileLinkRequest,
    FileSolicitationRequestInsertFields,
    FileSolicitationRequest,
    FileBlobResponse,
    SolicitationFileRequested,
} from 'types/files/filesData';
import {getFormDataFileInsert} from 'util/formatters/fileFormatter';
import {BaseRequestFields, BaseResponse} from 'types/baseEntities';
import {
    FileRequestedSolicitationInsert,
    FileRequestedSolicitationInsertFields, SolicitationInterchangedDocsContainer,
} from 'types/solicitations/solicitationData';
import {FileSolicitationTemplate} from '../../types/files/filesDataCache';
import {SolicitationNoteFields} from "../../types/solicitations/solicitationsNotesData";

export const HttpFilesSolicitation = {
    getEndpoint: (solicitationId: number, url: string = ''): string =>
        `solicitudes/${solicitationId}/archivos${url}`,

    getFilesList: (solicitationId: number): Promise<FileSolicitation[]> => {
        return HttpAxiosRequest.get(
            HttpFilesSolicitation.getEndpoint(solicitationId),
        );
    },

    getInterchangedFiles: (solicitationId: number): Promise<SolicitationInterchangedDocsContainer[]> => {
        return HttpAxiosRequest.get(
            HttpFilesSolicitation.getEndpoint(solicitationId, `/intercambios`)
        )
    },

    getRequiredFilesList: (
        solicitationId: number,
    ): Promise<FileSolicitation[]> => {
        return HttpAxiosRequest.get(
            HttpFilesSolicitation.getEndpoint(solicitationId, `/solicitadas`),
        );
    },

    insert: (
        solicitationId: number,
        fileSolicitation: FileBase,
        file: File,
    ): Promise<number> => {
        const formData: FormData = getFormDataFileInsert(fileSolicitation, file);

        return HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(solicitationId),
            formData,
        );
    },

    sendSharedFiles: (
        solicitationId: number,
        fileListIds: number[],
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(solicitationId, '/enviar-lista'),
            fileListIds,
        );
    },

    insertRequiredFile: (
        solicitationId: number,
        fileSolicitation: FileBase,
        file: File,
        solicitationRequestId: number,
    ): Promise<number> => {
        const formData: FormData = getFormDataFileInsert(fileSolicitation, file);
        formData.append(
            FileSolicitationRequestInsertFields.SolicitationRequestId,
            solicitationRequestId.toString(),
        );
        return HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(solicitationId, '/solicitadas'),
            formData,
        );
    },

    linkFileExistent: (solicitationId: number,
                       request: DocumentToFileLinkRequest)
        : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                '/existentes',
            ),
            request
        )
    },

    linkWithExistent: (
        solicitationId: number,
        request: DocumentToFileLinkRequest,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                '/solicitadas/existentes',
            ),
            request,
        );
    },

    requestNewFile: (
        solicitationId: number,
        data: FileRequestedSolicitationInsert,
    ): Promise<BaseResponse> => {
        const formData: FormData = new FormData();

        formData.append(
            FileRequestedSolicitationInsertFields.Title,
            data[FileRequestedSolicitationInsertFields.Title],
        );
        formData.append(
            FileRequestedSolicitationInsertFields.Observations,
            data[FileRequestedSolicitationInsertFields.Observations] ?? '',
        );
        formData.append(BaseRequestFields.ModuleCode, '1');
        formData.append(BaseRequestFields.OriginCode, '1');

        data[FileRequestedSolicitationInsertFields.DocumentIds]?.length !== 0 &&
        data[FileRequestedSolicitationInsertFields.DocumentIds]?.map((id) =>
            formData.append('idsDocumento', `${id}`),
        );
        data[FileRequestedSolicitationInsertFields.Files]?.length !== 0 &&
        data[FileRequestedSolicitationInsertFields.Files]?.map((file) =>
            formData.append('files', file),
        );

        return HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                '/solicitadas/solicitar',
            ),
            formData,
        );
    },

    getOffererRequestedFiles: (
        solicitationId: number,
    ): Promise<SolicitationFileRequested[]> => {
        return HttpAxiosRequest.get(
            HttpFilesSolicitation.getEndpoint(solicitationId, '/solicitadas/pedidos'),
        );
    },

    inactivateRequestedFiles: (
        solicitationId: number,
        solicitationRequestId: number,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.delete(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/solicitadas/pedidos/${solicitationRequestId}`,
            ),
        );
    },

    getRequestedTemplates: (
        solicitationId: number,
    ): Promise<FileSolicitationTemplate[]> => {
        return HttpAxiosRequest.get(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                '/solicitadas/pedidos/plantillas',
            ),
        );
    },

    downloadReport: (solicitationId: number): Promise<FileBlobResponse> => {
        return HttpAxiosRequest.getBlob(
            HttpFilesSolicitation.getEndpoint(solicitationId, `/informes/descargar/`),
        );
    },

    insertNewRequiredFile: (
        solicitationId: number,
        fileRequested: FileRequestedSolicitationInsert,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                '/solicitadas/solicitar',
            ),
            {
                ...fileRequested,
                [BaseRequestFields.ModuleCode]: 1,
                [BaseRequestFields.OriginCode]: 1,
            },
        );
    },

    sendRequestListToOfferer: (
        solicitationId: number,
        fileListId: number[],
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                '/solicitadas/pedidos/enviar-lista',
            ),
            fileListId,
        );
    },

    downloadRequiredFiles: (
        solicitationId: number,
        solicitationRequestId: number,
    ): Promise<FileBlobResponse> => {
        return HttpAxiosRequest.getBlob(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/solicitadas/pedidos/${solicitationRequestId}/descargar`,
            ),
        );
    },

    removeRequiredFile: (
        solicitationId: number,
        solicitationRequestId: number,
        documentId: number,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.delete(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/solicitadas/pedidos/${solicitationRequestId}/${documentId}`,
            ),
        );
    },

    getRelatedDocs: (
        solicitationId: number,
        solicitationRequestId: number,
    ): Promise<Document[]> => {
        return HttpAxiosRequest.get(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/solicitadas/pedidos/${solicitationRequestId}/documentos`,
            ),
        );
    },

    readResponseRequired: (
        solicitationId: number,
        solicitationRequestId: number,
    ): Promise<BaseResponse> =>
        HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/solicitadas/pedidos/${solicitationRequestId}/leer`,
            ),
            {},
        ),

    getCancelledFiles: (
        solicitationId: number,
    ): Promise<SolicitationFileRequested[]> => {
        return HttpAxiosRequest.get(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/solicitadas/pedidos/cancelados`,
            ),
        );
    },

    insertByTemplates: (
        solicitationId: number,
        formData: FormData,
    ): Promise<BaseResponse> =>
        HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/solicitadas/solicitar/plantillas`,
            ),
            formData,
        ),

    validateFileSolicitation: (
        solicitationId: number,
        requestedSolicitationFileId: number,
        documentId: number,
    ): Promise<BaseResponse> =>
        HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/solicitadas/pedidos/${requestedSolicitationFileId}/${documentId}/validacion`,
            ),
            {},
        ),

    removeValidationFromFileSolicitation: (
        solicitationId: number,
        requestedSolicitationFileId: number,
        documentId: number,
    ): Promise<BaseResponse> =>
        HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/solicitadas/pedidos/${requestedSolicitationFileId}/${documentId}/quitar-validacion`,
            ),
            {},
        ),

    getFilesListByDocumentId: (solicitationId: number, documentId: number): Promise<Document[]> =>
        HttpAxiosRequest.get(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/${documentId}/archivos`,
            ),
        ),

    validateFile: (
        solicitationId: number,
        documentId: number
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/${documentId}/validacion`
            ),
            {}
        )
    },

    removeValidateFile: (
        solicitationId: number,
        documentId: number
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/${documentId}/quitar-validacion`
            ),
            {}
        )
    },

    getApprovedFileList: (
        solicitationId: number
    ): Promise<FileSolicitation[]> => {
        return HttpAxiosRequest.get(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/aprobados`
            )
        )
    },

    downloadApprovedFiles: (
        solicitationId: number
    ): Promise<FileBlobResponse> => {
        return HttpAxiosRequest.getBlob(
            HttpFilesSolicitation.getEndpoint(
                solicitationId,
                `/aprobados/descargar`
            )
        )
    }
};

export const HttpFilesSolicitationAnalysis = {
    getEndpoint: (
        solicitationId: number,
        analysisId: number,
        url: string = '',
    ): string =>
        `/solicitudes/${solicitationId}/analisis/${analysisId}/archivos${url}`,

    getList: (
        solicitationId: number,
        analysisId: number,
    ): Promise<Document[]> => {
        return HttpAxiosRequest.get(
            HttpFilesSolicitationAnalysis.getEndpoint(solicitationId, analysisId),
        );
    },

    insert: (
        solicitationId: number,
        analysisId: number,
        fileToAnalyze: FileBase,
        file: File,
    ): Promise<number> => {
        let formData: FormData = getFormDataFileInsert(fileToAnalyze, file);

        return HttpAxiosRequest.post(
            HttpFilesSolicitationAnalysis.getEndpoint(solicitationId, analysisId),
            formData,
        );
    },
};

export const HttpFilesSolicitationDocumentationAnalysis = {
    getEndpoint: (
        solicitationId: number,
        solicitationDocumentationAnalysisId: number,
        url: string = '',
    ): string =>
        `/solicitudes/${solicitationId}/documentacion/analisis/${solicitationDocumentationAnalysisId}/archivos${url}`,

    getList: (
        solicitationId: number,
        solicitationDocumentationAnalysisId: number,
    ): Promise<Document[]> => {
        return HttpAxiosRequest.get(
            HttpFilesSolicitationDocumentationAnalysis.getEndpoint(
                solicitationId,
                solicitationDocumentationAnalysisId,
            ),
        );
    },

    insert: (
        solicitationId: number,
        solicitationDocumentationAnalysisId: number,
        fileToAnalyze: FileBase,
        file: File,
    ): Promise<number> => {
        let formData: FormData = getFormDataFileInsert(fileToAnalyze, file);

        return HttpAxiosRequest.post(
            HttpFilesSolicitationDocumentationAnalysis.getEndpoint(
                solicitationId,
                solicitationDocumentationAnalysisId,
            ),
            formData,
        );
    },
};

export const HttpFilesSolicitationManagement = {
    getEndpoint: (solicitationId: number,  url: string = '') => `/solicitudes/${solicitationId}/gestiones/archivos${url}`,

    getList: (solicitationId: number, relatedDataCode?: number, relatedId?: number): Promise<Document[]> =>
        HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpFilesSolicitationManagement.getEndpoint(solicitationId),
            {
                [SolicitationNoteFields.RelatedDataCode]: relatedDataCode,
                [SolicitationNoteFields.RelatedDataId]: relatedId
            }
        ),
    
    insert: (solicitationId: number, relatedDataCode: number, relatedId: number, fileToAnalyze: FileBase, file: File): Promise<number> => {
        let formData: FormData = getFormDataFileInsert(fileToAnalyze, file);
        formData.append(SolicitationNoteFields.RelatedDataCode, relatedDataCode.toString());
        formData.append(SolicitationNoteFields.RelatedDataId, relatedId.toString());
        
        return HttpAxiosRequest.post(
            HttpFilesSolicitationManagement.getEndpoint(solicitationId),
            formData,
        );
    },
}

export const HttpFilesSolicitationBalances = {
    getEndpoint: (solicitationId: number, solicitationFinancialId: number, url: string = ''): string =>
        `solicitudes/${solicitationId}/ejercicios/${solicitationFinancialId}/archivos${url}`,

    insert: (
        solicitationId: number,
        solicitationFinancialId: number,
        fileSolicitation: FileBase,
        file: File,
    ): Promise<number> => {
        const formData: FormData = getFormDataFileInsert(fileSolicitation, file);

        return HttpAxiosRequest.post(
            HttpFilesSolicitationBalances.getEndpoint(solicitationId, solicitationFinancialId),
            formData,
        );
    },
}