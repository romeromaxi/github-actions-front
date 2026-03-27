import {FileBlobResponse} from "../../types/files/filesData";
import {HttpAxiosRequest} from "../httpAxiosBase";
import {PersonRelationshipFilter} from "../../types/person/personData";


export const HttpClientPortfolioExport = {
    getEndpoint: (clientPortfolioGuid: string, url: string = '') => `/carpetas/${clientPortfolioGuid}/exportar${url}`,
    
    exportToExcel: (clientPortfolioGuid: string): Promise<FileBlobResponse> => {
        return HttpAxiosRequest.getBlob(
            HttpClientPortfolioExport.getEndpoint(clientPortfolioGuid, '/excel')
        );
    },
}


export const HttpClientPortfolioPersonsExport = {
    getEndpoint: (clientPortfolioGuid: string, url: string = '') => `/carpetas/${clientPortfolioGuid}/personas/exportar${url}`,

    exportListToExcel: (clientPortfolioGuid: string, filter: PersonRelationshipFilter): Promise<FileBlobResponse> => {
        return HttpAxiosRequest.getBlobWithQueryParamsSerializer(
            HttpClientPortfolioPersonsExport.getEndpoint(clientPortfolioGuid, '/lista/excel'),
            filter
        );
    },
}