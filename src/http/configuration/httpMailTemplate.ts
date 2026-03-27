import {MailSendTest, MailView} from "../../types/general/generalMailData";
import {HttpAxiosRequest} from "../httpAxiosBase";
import {BaseResponse} from "../../types/baseEntities";


export const HttpMailTemplate = {
    getEndpoint: (url: string): string => `configuracion/mail-plantilla${url}`,
    
    getSummaryList: () : Promise<MailView[]> => {
        return HttpAxiosRequest.get(
            HttpMailTemplate.getEndpoint('')
        )
    },

    getById: (mailTemplateId: number) : Promise<MailView> => {
        return HttpAxiosRequest.get(
            HttpMailTemplate.getEndpoint(`/${mailTemplateId}`)
        )
    },
    
    update: (mail: MailView) : Promise<BaseResponse> => {
        return HttpAxiosRequest.put(
            HttpMailTemplate.getEndpoint(''),
            mail
        )
    },
    
    sendTest: (mail: MailSendTest) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpMailTemplate.getEndpoint(''),
            mail
        )
    }
}