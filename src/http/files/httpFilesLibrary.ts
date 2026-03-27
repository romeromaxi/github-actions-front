import {
    DocumentFolderViewDTO,
    DocumentLibraryDocumentFilter,
    DocumentLibraryFilter
} from "types/files/filesFoldersData";
import {HttpAxiosRequest} from "http/httpAxiosBase";
import {Document} from "types/files/filesData";

export const HttpFilesLibrary = {
    getEndpoint: (url: string = ''): string => `bibliotecas${url}`,

    getLibraryStructure : (filters: DocumentLibraryFilter) : Promise<DocumentFolderViewDTO[]> =>
        HttpAxiosRequest.getWithQueryParams(
            HttpFilesLibrary.getEndpoint(''),
            filters
        ),

    getDocumentsFromLibraryStructure : (filters: DocumentLibraryDocumentFilter) : Promise<Document[]> =>
        HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpFilesLibrary.getEndpoint('/documentos'),
            filters
        )
}

