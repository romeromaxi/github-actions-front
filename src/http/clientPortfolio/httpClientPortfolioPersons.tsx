import {
    PersonPersonalDataInsert, PersonPersonalDataView,
    PersonRelationship,
    PersonRelationshipFilter,
    PersonRelationshipInsert,
    PersonRelationshipUpdate
} from "../../types/person/personData";
import {HttpAxiosRequest} from "../httpAxiosBase";
import {BaseRequestFields, BaseResponse} from "../../types/baseEntities";
import {
    RelatedPersonWithReferentialData,
    RelatedPersonWithReferentialDataFields
} from "../../types/company/companySocietyData";
import {
    HttpClientPortfolioPersonAddressses,
    HttpClientPortfolioPersonMails,
    HttpClientPortfolioPersonPhones
} from "./httpClientPortfolioPersonReferentialData";


export const HttpClientPortfolioPersons = {
    getEndpoint: (clientPortfolioGuid: string, url: string = '') => `/carpetas/${clientPortfolioGuid}/personas${url}`,
    
    getRelationshipList: (clientPortfolioGuid: string, filter: PersonRelationshipFilter) : Promise<PersonRelationship[]> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpClientPortfolioPersons.getEndpoint(clientPortfolioGuid),
            { ...filter },
        );
    },

    getInverseRelationshipList: (clientPortfolioGuid: string, filter: PersonRelationshipFilter) : Promise<PersonRelationship[]> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpClientPortfolioPersons.getEndpoint(clientPortfolioGuid, '/inversas'),
            { ...filter },
        );
    },
    
    getRelationshipMapList: (clientPortfolioGuid: string) : Promise<PersonRelationship[]> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolioPersons.getEndpoint(clientPortfolioGuid, '/mapa-relaciones'),
        )
    },
    
    insertRelationship: (clientPortfolioGuid: string, relationship: PersonRelationshipInsert) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpClientPortfolioPersons.getEndpoint(clientPortfolioGuid),
            {
                ...relationship,
                codModulo: 1,
                codOrigen: 1,
            }
        )
    },
    
    updateRelationship: (
        clientPortfolioGuid: string,
        relationshipId: number,
        relationship: PersonRelationshipUpdate
    ) : Promise<BaseResponse> => {
        return HttpAxiosRequest.put(
            HttpClientPortfolioPersons.getEndpoint(clientPortfolioGuid, `/${relationshipId}`),
            {
                ...relationship,
                codModulo: 1,
                codOrigen: 1,
            }
        )
    },
    
    delete: (clientPortfolioGuid: string, personId: number) : Promise<BaseResponse> => {
        return HttpAxiosRequest.delete(
            HttpClientPortfolioPersons.getEndpoint(clientPortfolioGuid, `/${personId}`)
        )
    },

    getPersonalDataByIdPerson: (clientPortfolioGuid: string, personId: number): Promise<PersonPersonalDataView> =>
        HttpAxiosRequest.get(
            HttpClientPortfolioPersons.getEndpoint(
                clientPortfolioGuid,
                `/${personId}/datos-personales`,
            )
        ),

    updatePersonalDataByIdPerson: (
        clientPortfolioGuid: string,
        personId: number,
        personData: PersonPersonalDataInsert,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.put(
            HttpClientPortfolioPersons.getEndpoint(
                clientPortfolioGuid,
                `/${personId}/datos-personales`,
            ),
            {
                ...personData,
                [BaseRequestFields.OriginCode]: 1,
                [BaseRequestFields.ModuleCode]: 1,
            },
        );
    },

    getPersonWithReferentialData: (
        clientPortfolioGuid: string,
        personId: number
    ): Promise<RelatedPersonWithReferentialData> => {
        return Promise.all([
            HttpClientPortfolioPersons.getPersonalDataByIdPerson(clientPortfolioGuid, personId),
            HttpClientPortfolioPersonPhones.get(clientPortfolioGuid, personId),
            HttpClientPortfolioPersonMails.get(clientPortfolioGuid, personId),
            HttpClientPortfolioPersonAddressses.get(clientPortfolioGuid, personId)
        ]).then((values) => {
            return {
                [RelatedPersonWithReferentialDataFields.Person]: values[0],
                [RelatedPersonWithReferentialDataFields.Phone]: values[1],
                [RelatedPersonWithReferentialDataFields.Mail]: values[2],
                [RelatedPersonWithReferentialDataFields.ListAddressess]: values[3]
            };
        });
    },
}