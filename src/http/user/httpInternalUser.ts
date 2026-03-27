import {HttpAxiosRequest} from "../httpAxiosBase";
import {InternalUserCreate, InternalUserGroupUpdate, UserCompany, UserCompanyFilter, UserSummary} from "types/user";
import {BaseResponse, EntityListWithPagination} from "types/baseEntities";


export const HttpInternalUser = {
    getEndpoint: (url: string = ''): string => `/usuarios/internos${url}`,

    getCompanyUsersBySearch: (filter: UserCompanyFilter) : Promise<EntityListWithPagination<UserCompany>> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpInternalUser.getEndpoint('/busqueda'),
            filter
        )
    },
    
    getAllUsersBySearch: (filter: UserCompanyFilter) : Promise<EntityListWithPagination<UserSummary>> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpInternalUser.getEndpoint('/busqueda/general'),
            filter
        )
    },
    
    create: (user: InternalUserCreate) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpInternalUser.getEndpoint(),
            user
        )
    },
    
    updateGroups: (userId: number, update: InternalUserGroupUpdate) : Promise<BaseResponse> => {
        return HttpAxiosRequest.put(
            HttpInternalUser.getEndpoint(`/${userId}/grupos`),
            update
        )
    }
}