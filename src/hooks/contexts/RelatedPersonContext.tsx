import {createContext, ReactNode, useEffect, useMemo, useState} from "react";
import {RelationshipEditFormFields, RelationshipEditFormType} from "../../pages/company/relatedPeople/RelatedPersonMultipleRelationshipDetail";
import {PersonRelationshipTypeClassification} from "../../types/company/companyEnums";
import {
    PersonPersonalDataInsert, PersonPersonalDataInsertFields,
    PersonRelationship, PersonRelationshipFields,
    PersonRelationshipFilter,
    PersonRelationshipInsert,
    PersonRelationshipUpdate
} from "../../types/person/personData";
import {
    HttpCompanyPersonAddress,
    HttpCompanyPersonMail,
    HttpCompanyPersonPhoneNumber,
    HttpCompanyRelationship
} from "../../http";
import {HttpClientPortfolioPersons} from "../../http/clientPortfolio/httpClientPortfolioPersons";
import useAxios from "../useAxios";
import {
    EntityAddressFields,
    EntityAddressInsert,
    EntityMail,
    EntityMailFields,
    EntityMailInsert,
    EntityPhoneNumber
} from "../../types/general/generalReferentialData";
import {PersonMailFields} from "../../types/person/personReferentialData";
import {MailTypes} from "../../types/general/generalEnums";
import {
    HttpClientPortfolioPersonAddressses,
    HttpClientPortfolioPersonMails,
    HttpClientPortfolioPersonPhones
} from "../../http/clientPortfolio/httpClientPortfolioPersonReferentialData";
import {HttpCompanyRelationshipExport} from "../../http/company/HttpCompanyRelationshipExport";
import {BaseResponse} from "../../types/baseEntities";
import {useSnackbarActions} from "../useSnackbarActions";
import {useAction} from "../useAction";
import {RelatedPersonWithReferentialData} from "../../types/company/companySocietyData";
import {HttpClientPortfolioPersonsExport} from "../../http/clientPortfolio/httpClientPortfolioExport";


export enum RelatedPersonSourceType {
    Company = 'company',
    ClientPortfolio = 'clientPortfolio',
}


export function useRelatedPerson(dataId: number | string, dataSource: RelatedPersonSourceType) {
    const numericDataId = useMemo(() => {
        return typeof dataId === 'number' ? dataId : 0;
    }, [dataId]);

    const stringDataId = useMemo(() => {
        return typeof dataId === 'string' ? dataId : '';
    }, [dataId]);


    const getRelationships = (filter?: PersonRelationshipFilter) => {
        if (!stringDataId && !numericDataId) return Promise.resolve<PersonRelationship[]>([]);

        switch (dataSource) {
            case RelatedPersonSourceType.Company:
                return HttpCompanyRelationship.getRelationships(numericDataId, filter ?? {})
            case RelatedPersonSourceType.ClientPortfolio:
                return HttpClientPortfolioPersons.getRelationshipList(stringDataId, filter ?? {})
        }
    }
    

    const handleCreateRelationship = (data: PersonRelationshipInsert, address?: EntityAddressInsert) => {
        switch (dataSource) {
            case RelatedPersonSourceType.Company:
                if (address) {
                    return HttpCompanyRelationship.insertRelationship(numericDataId, data)
                        .then(() => {
                            return HttpCompanyPersonAddress.insert(
                                numericDataId,
                                data[PersonRelationshipFields.PersonId],
                                address,
                            )
                        })
                }
                else return HttpCompanyRelationship.insertRelationship(numericDataId, data)
            case RelatedPersonSourceType.ClientPortfolio:
                if (address) {
                    return HttpClientPortfolioPersons.insertRelationship(stringDataId, data)
                        .then(() => {
                            return HttpClientPortfolioPersonAddressses.insert(
                                stringDataId,
                                data[PersonRelationshipFields.PersonId],
                                address,
                            )
                        })
                }
                else return HttpClientPortfolioPersons.insertRelationship(stringDataId, data)
        }
    }

    const handleDeleteRelationship = (personId: number) => {
        switch (dataSource) {
            case RelatedPersonSourceType.Company:
                return HttpCompanyRelationship.delete(numericDataId, personId)
            case RelatedPersonSourceType.ClientPortfolio:
                return HttpClientPortfolioPersons.delete(stringDataId, personId)
        }
    }

    const handleUpdateRelationship = (data: RelationshipEditFormType, relationshipId: number, fianceId?: number) => {
        const relationshipUpdate: PersonRelationshipUpdate = {
            ...data[RelationshipEditFormFields.SocietyPerson],
            [PersonRelationshipFields.ParticipationPercent]: data[RelationshipEditFormFields.SocietyPerson][
                PersonRelationshipFields.ParticipationPercent
                ]
                ? data[RelationshipEditFormFields.SocietyPerson][PersonRelationshipFields.ParticipationPercent]
                : undefined,
        };

        const personId = data[RelationshipEditFormFields.SocietyPerson][PersonRelationshipFields.PersonId];

        switch (dataSource) {
            case RelatedPersonSourceType.Company:
                return HttpCompanyRelationship.updateRelationship(
                    numericDataId,
                    relationshipId,
                    relationshipUpdate,
                ).then(() => {
                    return Promise.all([
                        updatePersonalInformation(
                            data[RelationshipEditFormFields.PersonInformation],
                            personId,
                            fianceId
                        ),
                        insertPhoneNumbers(data[RelationshipEditFormFields.Phone], personId),
                        insertMail(data[RelationshipEditFormFields.Mail], personId),
                        insertListAddresses(data[RelationshipEditFormFields.AddressList], personId),
                    ]);
                });

            case RelatedPersonSourceType.ClientPortfolio:
                return HttpClientPortfolioPersons.updateRelationship(
                    stringDataId,
                    relationshipId,
                    relationshipUpdate,
                ).then(() => {
                    return Promise.all([
                        updatePersonalInformationPortfolio(
                            data[RelationshipEditFormFields.PersonInformation],
                            personId,
                            fianceId
                        ),
                        insertPhoneNumbersPortfolio(data[RelationshipEditFormFields.Phone], personId),
                        insertMailPortfolio(data[RelationshipEditFormFields.Mail], personId),
                        insertListAddressesPortfolio(data[RelationshipEditFormFields.AddressList], personId),
                    ]);
                });
        }
    }
    
    const getInverseRelationships = (filter?: PersonRelationshipFilter) => {
        if (!stringDataId && !numericDataId) return Promise.resolve<PersonRelationship[]>([]);

        switch (dataSource) {
            case RelatedPersonSourceType.Company:
                return Promise.resolve<PersonRelationship[]>([])
            case RelatedPersonSourceType.ClientPortfolio:
                return HttpClientPortfolioPersons.getInverseRelationshipList(stringDataId, filter ?? {})
        }
    }
    
    
    const onExportLstExcel = (filter: PersonRelationshipFilter) => {
        switch (dataSource) {
            case RelatedPersonSourceType.Company:
                return HttpCompanyRelationshipExport.exportListToExcel(
                    numericDataId,
                    filter,
                )
            case RelatedPersonSourceType.ClientPortfolio:
                return HttpClientPortfolioPersonsExport.exportListToExcel(
                    stringDataId,
                    filter,
                )
        }
    }
    
    const onExportExcel = (personId: number, relationshipClassificationCode: PersonRelationshipTypeClassification) => {
        switch (dataSource) {
            case RelatedPersonSourceType.Company:
                return HttpCompanyRelationshipExport.exportPersonToExcel(numericDataId, personId, relationshipClassificationCode)
            case RelatedPersonSourceType.ClientPortfolio:
                //no lo tenemos
                return HttpCompanyRelationshipExport.exportPersonToExcel(numericDataId, personId, relationshipClassificationCode)
        }
    }
    
    const getPersonReferentialData = (personId: number) => {
        switch (dataSource) {
            case RelatedPersonSourceType.Company:
                return HttpCompanyRelationship.getPersonWithReferentialData(numericDataId, personId)
            case RelatedPersonSourceType.ClientPortfolio:
                return HttpClientPortfolioPersons.getPersonWithReferentialData(
                    stringDataId,
                    personId
                )
        }
    }
    
    //aux
    const updatePersonalInformation = (
        person: PersonPersonalDataInsert,
        personId: number,
        fianceId?: number
    ) => {
        const personData: PersonPersonalDataInsert = {
            ...person,
            [PersonPersonalDataInsertFields.FiancePersonId]: fianceId
        }
        return HttpCompanyRelationship.updatePersonalDataByIdPerson(
            numericDataId,
            personId,
            personData,
        );
    };

    const insertPhoneNumbers = async (phoneList: EntityPhoneNumber[], personId: number) => {
        return HttpCompanyPersonPhoneNumber.insertList(
            numericDataId,
            personId,
            phoneList,
        );
    };

    const insertMail = async (mail: EntityMail, personId: number) => {
        if (mail[PersonMailFields.Mail]) {
            let mailInsert: EntityMailInsert = {
                ...mail,
                [EntityMailFields.MailTypeCode]: MailTypes.Main,
            };

            return HttpCompanyPersonMail.insert(
                numericDataId,
                personId,
                mailInsert,
            );
        }
    };

    const insertListAddresses = async (otherAddresses: EntityAddressInsert[], personId: number) => {
        let listAddressesToInsert: EntityAddressInsert[] = [];

        otherAddresses.forEach((oneAddress) => {
            if (!!oneAddress[EntityAddressFields.AddressTypeCode])
                listAddressesToInsert.push(oneAddress);
        });

        return HttpCompanyPersonAddress.insertList(
            numericDataId,
            personId,
            listAddressesToInsert,
        );
    };

    const updatePersonalInformationPortfolio = (
        person: PersonPersonalDataInsert,
        personId: number,
        fianceId?: number
    ) => {
        const personData: PersonPersonalDataInsert = {
            ...person,
            [PersonPersonalDataInsertFields.FiancePersonId]: fianceId
        }
        return HttpClientPortfolioPersons.updatePersonalDataByIdPerson(
            stringDataId,
            personId,
            personData,
        );
    };

    const insertPhoneNumbersPortfolio = async (phoneList: EntityPhoneNumber[], personId: number) => {
        return HttpClientPortfolioPersonPhones.insertList(
            stringDataId,
            personId,
            phoneList,
        );
    };

    const insertMailPortfolio = async (mail: EntityMail, personId: number) => {
        if (mail[PersonMailFields.Mail]) {
            let mailInsert: EntityMailInsert = {
                ...mail,
                [EntityMailFields.MailTypeCode]: MailTypes.Main,
            };

            return HttpClientPortfolioPersonMails.insert(
                stringDataId,
                personId,
                mailInsert,
            );
        }
    };

    const insertListAddressesPortfolio = async (otherAddresses: EntityAddressInsert[], personId: number) => {
        let listAddressesToInsert: EntityAddressInsert[] = [];

        otherAddresses.forEach((oneAddress) => {
            if (!!oneAddress[EntityAddressFields.AddressTypeCode])
                listAddressesToInsert.push(oneAddress);
        });

        return HttpClientPortfolioPersonAddressses.insertList(
            stringDataId,
            personId,
            listAddressesToInsert,
        );
    };

    return {
        getRelationships,
        getInverseRelationships,
        handleCreateRelationship,
        handleUpdateRelationship,
        handleDeleteRelationship,
        getPersonReferentialData,
        onExportLstExcel,
        onExportExcel
    }
}

export const RelatedPersonContext = createContext({
    relationshipLst: undefined as PersonRelationship[] | undefined,
    inverseRelationshipLst: undefined as PersonRelationship[] | undefined,
    getRelationships: (filter?: PersonRelationshipFilter)=>  {},
    promiseReferentialData: (personId: number) => Promise.resolve<RelatedPersonWithReferentialData>({} as RelatedPersonWithReferentialData),
    handleNew: (data: PersonRelationshipInsert, address?: EntityAddressInsert, callbackFn?: () => void) => {},
    handleUpdate: (data: RelationshipEditFormType, relationshipId: number, fianceId?: number, callbackFn?: () => void) => {},
    handleDelete: (personId: number) => {},
    handleExportLst: (filter?: PersonRelationshipFilter) => Promise.resolve(),
    handleExport: (personId: number, relationshipClassificationCode: PersonRelationshipTypeClassification) => {},
    dataSrc: RelatedPersonSourceType.Company as RelatedPersonSourceType,
    allowsDocumentation: false as boolean,
    allowsExport: false as boolean,
    hasInverseRelationships: false as boolean,
    loading: false as boolean
})


interface RelatedPersonContextProviderProps {
    dataId: number | string;
    dataSource: RelatedPersonSourceType;
    children: ReactNode
}

export const RelatedPersonContextProvider = ({dataId, dataSource, children} : RelatedPersonContextProviderProps) => {
    const { 
        getRelationships,
        getInverseRelationships,
        handleCreateRelationship,
        handleUpdateRelationship,
        handleDeleteRelationship,
        getPersonReferentialData,
        onExportLstExcel,
        onExportExcel
    } = useRelatedPerson(dataId, dataSource);
    const { addSnackbarSuccess, addSnackbarError } = useSnackbarActions();
    const { showLoader, hideLoader } = useAction();
    const { fetchData, fetchAndDownloadFile } = useAxios();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<PersonRelationshipFilter>();
    const [relationshipLst, setRelationshipLst] = useState<PersonRelationship[]>();
    const [inverseRelationshipLst, setInverseRelationshipLst] = useState<PersonRelationship[]>();

    const loadData = (filter?: PersonRelationshipFilter) => {
        setLoading(true)
        setFilter(filter)
        getRelationships(filter).then((data) => {
            setRelationshipLst(data);
        }).finally(() => setLoading(false))
    }

    const baseResponseOperation = (promiseFn: Promise<BaseResponse>, successMsg: string) => {
        setLoading(true)
        fetchData(
            () => promiseFn,
            true
        ).then(() => {
            loadData(filter)
            addSnackbarSuccess(successMsg)
        })
    }
    
    const handleGetReferentialData = (personId: number) => getPersonReferentialData(personId)

    const handleNew = (data: PersonRelationshipInsert, address?: EntityAddressInsert, callbackFn?: () => void) => {
        showLoader()
        handleCreateRelationship(data, address)
            .then(() => callbackFn && callbackFn())
            .catch(() => addSnackbarError('Ocurrió un error al guardar el registro'))
            .finally(() => hideLoader())
    }
    const handleDelete = (id: number) =>
        baseResponseOperation(handleDeleteRelationship(id), 'La persona relacionada se eliminó correctamente')

    const handleExportExcel = (personId: number, relationshipClassificationCode: PersonRelationshipTypeClassification) =>
        fetchAndDownloadFile(
            () => onExportExcel(personId, relationshipClassificationCode)
        )
    
    const handleExportLstExcel = (exportFilter?: PersonRelationshipFilter) =>
        fetchAndDownloadFile(
            () => onExportLstExcel(exportFilter ?? filter ?? {})
        )

    const handleUpdate = (data: RelationshipEditFormType, relationshipId: number, fianceId?: number, callbackFn?: () => void) => {
        showLoader()
        handleUpdateRelationship(data, relationshipId, fianceId).then(() => {
            hideLoader()
            addSnackbarSuccess('El registro se ha guardado correctamente')
            loadData(filter)
            callbackFn && callbackFn()
        }).catch(() => addSnackbarError('Ocurrió un error al guardar el registro'))
    }
    
    const loadInverseData = (filter?: PersonRelationshipFilter) => {
        setLoading(true)
        setFilter(filter)
        getInverseRelationships(filter).then((data) => {
            setInverseRelationshipLst(data);
        }).finally(() => setLoading(false))
    }
    
    useEffect(() => {
        loadData(filter)
        if (dataSource === RelatedPersonSourceType.ClientPortfolio) loadInverseData(filter)
    }, [dataId, dataSource]);
    
    return (
        <RelatedPersonContext.Provider value={{
            relationshipLst: relationshipLst,
            inverseRelationshipLst: inverseRelationshipLst,
            getRelationships: loadData,
            promiseReferentialData: handleGetReferentialData,
            handleNew: handleNew,
            handleUpdate: handleUpdate,
            handleDelete: handleDelete,
            handleExport: handleExportExcel,
            handleExportLst: handleExportLstExcel,
            dataSrc: dataSource,
            allowsDocumentation: dataSource === RelatedPersonSourceType.Company,
            allowsExport: dataSource === RelatedPersonSourceType.Company,
            hasInverseRelationships: dataSource === RelatedPersonSourceType.ClientPortfolio,
            loading: loading
        }}>
            {children}
        </RelatedPersonContext.Provider>
    )
}