import {LufeDetail} from "../../types/lufe/lufeData";
import {HttpAxiosRequest} from "../httpAxiosBase";
import { Document } from '../../types/files/filesData'


export const HttpLufe = {
    getEndpoint: (lufeRequestId: number, url: string = ''): string => `lufe/${lufeRequestId}${url}`,
    
    getRequestById: (lufeRequestId: number) : Promise<LufeDetail> => {
        return HttpAxiosRequest.get(
            HttpLufe.getEndpoint(lufeRequestId)
        )
    },
    
    getFileLstById: (lufeRequestId: number) : Promise<Document[]> => {
        return HttpAxiosRequest.get(
            HttpLufe.getEndpoint(lufeRequestId, '/archivos')
        )
    }
}