import {
    EntityListWithPagination,
    EntityWithIdFields,
} from '../../types/baseEntities';
import {
    NosisMainDataResponse,
    NosisResponse,
    Person,
    PersonFields,
    PersonQuaFilterSearch,
    PersonSummaryView,
    PersonView,
    PersonViewWithReferentialData,
    PersonViewWithReferentialDataFields,
} from '../../types/person/personData';
import {HttpAxiosRequest} from '../httpAxiosBase';
import {
    HttpPersonAddress,
    HttpPersonMail,
    HttpPersonPhoneNumber,
} from './httpPersonReferentialData';
import {ModuleCodes} from "../../types/general/generalEnums";
import {PersonConsultantDTO} from "../../types/person/personNosisData";

export const HttpPerson = {
    getEndpoint: (url: string): string => `/persona${url}`,

    getById: (personId: number): Promise<PersonView> => {
        return HttpAxiosRequest.get(HttpPerson.getEndpoint(`/${personId}`));
    },

    getByCUIT: (CUIT: string): Promise<PersonView> => {
        return HttpAxiosRequest.get(HttpPerson.getEndpoint(`/PorCUIT/${CUIT}`));
    },

    getByIdWithReferentialData: async (
        personId: number,
    ): Promise<PersonViewWithReferentialData> => {
        return Promise.all([
            HttpPerson.getById(personId),
            HttpPersonPhoneNumber.getByPersonId(personId),
            HttpPersonMail.getByPersonId(personId),
            HttpPersonAddress.getByPersonId(personId),
        ]).then((values) => {
            return {
                [PersonViewWithReferentialDataFields.Person]: values[0],
                [PersonViewWithReferentialDataFields.PhoneNumber]: values[1],
                [PersonViewWithReferentialDataFields.Mail]: values[2],
                [PersonViewWithReferentialDataFields.ListAddressess]: values[3],
            };
        });
    },

    synchronizeWithNosisAndGetPersonId: (
        CUIT: string,
        module: ModuleCodes
    ): Promise<NosisResponse> => {
        return HttpAxiosRequest.post(
            HttpPerson.getEndpoint(`/${CUIT}/sincronizar`),
            {
                [PersonConsultantDTO.BusinessName]: '',
                [PersonConsultantDTO.ModuleCode]: module,
            },
        );
    },

    getNosisData: (cuit: string, module: ModuleCodes): Promise<NosisMainDataResponse> => {
        return HttpAxiosRequest.post(
            HttpPerson.getEndpoint(`/${cuit}/sincronizar/datos-principales`),
            {
                [PersonConsultantDTO.BusinessName]: '',
                [PersonConsultantDTO.ModuleCode]: module,
            },
        );
    },

    searchByFilter: (
        filter: PersonQuaFilterSearch,
    ): Promise<EntityListWithPagination<PersonSummaryView>> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpPerson.getEndpoint('/busqueda'),
            filter,
        );
    },
};
