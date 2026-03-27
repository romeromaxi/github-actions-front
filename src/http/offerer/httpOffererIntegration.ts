import {
    OffererIntegrationDelete,
    OffererIntegrationUpdate, OffererIntegrationUpdateFields,
    OffererIntegrationView
} from "../../types/offerer/offererIntegrationData";
import {HttpAxiosRequest} from "../httpAxiosBase";
import {BaseResponse} from "../../types/baseEntities";
import {ConfigurationEconde, configurationEncoder} from "../../util/configurations";
import CryptoJS from "crypto-js";


export const HttpOffererIntegration = {
    getEndpoint: (offererId: number, url: string = ''): string => `oferentes/${offererId}/integraciones${url}`,
    
    getIntegration: (offererId: number) : Promise<OffererIntegrationView> => {
        return HttpAxiosRequest.get(
            HttpOffererIntegration.getEndpoint(offererId)
        )
    },
    
    cleanIntegration: (offererId: number, curIntegration: OffererIntegrationDelete) : Promise<BaseResponse> => {
        return HttpAxiosRequest.deleteWithBody(
            HttpOffererIntegration.getEndpoint(offererId),
            curIntegration
        )
    },
    
    updateIntegration: async (offererId: number, integration: OffererIntegrationUpdate) : Promise<BaseResponse> => {
        let encoder: ConfigurationEconde =
            await configurationEncoder.getConfiguration();

        let encryptApiKey: string = CryptoJS.AES.encrypt(
            integration[OffererIntegrationUpdateFields.LufeApiKey] ?? '',
            CryptoJS.enc.Utf8.parse(encoder.key.substring(0, encoder.keyLength)),
            {
                iv: CryptoJS.enc.Utf8.parse(encoder.iv.substring(0, encoder.ivLength)),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            },
        ).toString();
        
        const submitIntegration: OffererIntegrationUpdate = {
            ...integration,
            [OffererIntegrationUpdateFields.LufeApiKey]: encryptApiKey
        }
        
        return HttpAxiosRequest.patch(
            HttpOffererIntegration.getEndpoint(offererId),
            submitIntegration
        )
    }
}