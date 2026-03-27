import {FileBlobResponse} from "../../types/files/filesData";
import {HttpAxiosRequest} from "../httpAxiosBase";


export const HttpFinancialIndicatorsExports = {
    getEndpoint: (url: string = '') => `/informacion-financiera/exportar${url}`,
    
    
    exportCompanyIndicatorsToExcel: (companyId: any) : Promise<FileBlobResponse> =>
        HttpAxiosRequest.getBlob(
            HttpFinancialIndicatorsExports.getEndpoint(`/empresa/${companyId}/excel`)
        ),

    exportSolicitationIndicatorsToExcel: (solicitationId: any) : Promise<FileBlobResponse> =>
        HttpAxiosRequest.getBlob(
            HttpFinancialIndicatorsExports.getEndpoint(`/solicitud/${solicitationId}/excel`)
        ),

    exportClientPortfolioIndicatorsToExcel: (clientPortfolioGuid: any) : Promise<FileBlobResponse> =>
        HttpAxiosRequest.getBlob(
            HttpFinancialIndicatorsExports.getEndpoint(`/carpeta/${clientPortfolioGuid}/excel`)
        ),
}