import {HttpAxiosRequest} from 'http/httpAxiosBase';

import {
    PersonCompanyConsultantDTO,
    PersonCompanyConsultantResponseDTO,
    PersonOffererConsultantDTO,
    PersonOffererConsultantResponseDTO,
    PersonConsultantResponseDTO, PersonConsultantDTO,
} from 'types/person/personNosisData';
import {NosisMainDataResponse} from 'types/person/personData';
import {ModuleCodes} from "../../types/general/generalEnums";

export const HttpPersonNosis = {
    getEndpoint: (cuit: string, url: string): string =>
        `persona/${cuit}/sincronizar${url}`,

    synchronizeCompany: (
        cuit: string,
        businessName: string,
        module: ModuleCodes,
    ): Promise<PersonCompanyConsultantResponseDTO> => {
        return HttpAxiosRequest.post(
            HttpPersonNosis.getEndpoint(cuit, '/empresa'),
            {
                [PersonCompanyConsultantDTO.BusinessName]: businessName,
                [PersonCompanyConsultantDTO.ModuleCode]: module,
            },
        );
    },

    synchronizeOfferer: (
        cuit: string,
        cuitresponsible: string,
        type: number,
        mail: string,
        telephone: string,
        loginOffererName: string,
        businessTradeOffererName: string
    ): Promise<PersonOffererConsultantResponseDTO> => {
        return HttpAxiosRequest.post(
            HttpPersonNosis.getEndpoint(cuit, '/oferente'),
            {
                [PersonOffererConsultantDTO.PersonResposibleId]: cuitresponsible,
                [PersonOffererConsultantDTO.PersonClassificationCode]: type,
                [PersonOffererConsultantDTO.Mail]: mail,
                [PersonOffererConsultantDTO.Telephone]: telephone,
                [PersonOffererConsultantDTO.ModuleCode]: ModuleCodes.OffererRegistration,
                [PersonOffererConsultantDTO.LogInName]: loginOffererName,
                [PersonOffererConsultantDTO.BusinessTradeName]: businessTradeOffererName
            },
        );
    },

    synchronizeWithNosisAndGetPersonId: (
        cuit: string,
        module: ModuleCodes
    ): Promise<PersonConsultantResponseDTO> => {
        return HttpAxiosRequest.post(HttpPersonNosis.getEndpoint(cuit, ''), {
            [PersonConsultantDTO.BusinessName]: '',
            [PersonConsultantDTO.ModuleCode]: module,
        });
    },

    synchronizeWithNosisMainData: (
        cuit: string,
        module: ModuleCodes
    ): Promise<NosisMainDataResponse> => {
        return HttpAxiosRequest.post(
            HttpPersonNosis.getEndpoint(cuit, `/datos-principales`),
            {
                [PersonConsultantDTO.BusinessName]: '',
                [PersonConsultantDTO.ModuleCode]: module,
            },
        );
    },
};
