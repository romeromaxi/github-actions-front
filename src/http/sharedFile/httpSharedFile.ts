import {HttpAxiosRequest} from "../httpAxiosBase";
import {BaseResponse} from "../../types/baseEntities";


export const HttpSharedFile = {
    getEndpoint: (url: string = '', guid: string): string => `legajos${url}/${guid}`,

    getFileIdByGuid: (guid: string) : Promise<BaseResponse> => {
        return HttpAxiosRequest.get(
            HttpSharedFile.getEndpoint('', guid)
        )
    }
}