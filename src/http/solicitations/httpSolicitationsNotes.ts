import {HttpAxiosRequest} from "../httpAxiosBase";
import {BaseRequestFields, BaseResponse} from "types/baseEntities";
import {SolicitationNote, SolicitationNoteFields, SolicitationNoteInsert } from "types/solicitations/solicitationsNotesData";

export const HttpSolicitationsNotes = {
    getEndpoint: (solicitationId: number,  url: string = '') => `/solicitudes/${solicitationId}/notas${url}`,
    
    search: (solicitationId: number, relatedDataCode?: number, relatedId?: number): Promise<SolicitationNote[]> =>
       HttpAxiosRequest.getWithQueryParamsSerializer(
           HttpSolicitationsNotes.getEndpoint(solicitationId),
           {
               [SolicitationNoteFields.RelatedDataCode]: relatedDataCode,
               [SolicitationNoteFields.RelatedDataId]: relatedId
           }
       ),
    
    insert: (solicitationId: number, data: SolicitationNoteInsert): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitationsNotes.getEndpoint(solicitationId),
            {
                ...data,
                [BaseRequestFields.OriginCode]: 1,
                [BaseRequestFields.ModuleCode]: 1
            }
        );
    },
    
    
    delete: (solicitationId: number, noteId: number): Promise<BaseResponse> => {
        return HttpAxiosRequest.deleteWithBody(
            HttpSolicitationsNotes.getEndpoint(solicitationId, `/${noteId}`),
            {
                [BaseRequestFields.OriginCode]: 1,
                [BaseRequestFields.ModuleCode]: 1
            }
        );
    }
}