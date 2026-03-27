import {createContext, ReactNode, useEffect, useState} from "react";
import {
    NosisDetailQuery,
    NosisQuery,
    NosisQueryFields,
    SituationType,
    SituationTypeFields
} from "types/nosis/nosisData";
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import {HttpCachePublicBases, HttpPublicBases} from "http/publicBases";

export enum BureauInformationSourceType {
    Company = 'company',
    CompanyFile = 'companyFile',
    ClientPortfolio = 'clientPortfolio'
}

type QueryContextType = {
    loading: boolean;
    error: boolean;
    dataSource: BureauInformationSourceType | undefined;
    nosisQuery: NosisDetailQuery | undefined;
    situationTypes: SituationType[];
    unknownSituationType: SituationType;
    options: NosisQuery[];
    selectedQueryId: number,
    setSelectedQueryId: (queryId: number) => void,
    optionSelected?: NosisQuery,
    showSelectorHeader: boolean,
    onReload: () => void
};

const unknownSituationType: SituationType = {
    [EntityWithIdAndDescriptionFields.Id]: -1,
    [EntityWithIdAndDescriptionFields.Description]: 'Desconocido',
    [SituationTypeFields.LongDesc]: 'Sin información disponible',
};

export const BureauInformationContext = createContext<QueryContextType>({
    loading: true,
    error: false,
    dataSource: undefined,
    nosisQuery: undefined,
    situationTypes: [],
    unknownSituationType: unknownSituationType,
    options: [],
    selectedQueryId: 0,
    setSelectedQueryId: (_: number) => { },
    optionSelected: undefined,
    showSelectorHeader: false,
    onReload: () => { }
});

interface BureauInformationContextProviderProps {
    dataId?: number,
    dataSource: BureauInformationSourceType,
    defaultQueryId?: number,
    children: ReactNode
}

export const BureauInformationContextProvider = ({
    dataId, dataSource, defaultQueryId = 0, children
}: BureauInformationContextProviderProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [nosisQuery, setNosisQuery] = useState<NosisDetailQuery>();
    const [situationTypes, setSituationTypes] = useState<SituationType[]>([]);
    const [selectedQueryId, setSelectedQueryId] = useState<number>(defaultQueryId); 
    const [options, setOptions] = useState<NosisQuery[]>([]);

    useEffect(() => {
        setSelectedQueryId(defaultQueryId)
    }, [defaultQueryId]);
    
    useEffect(() => {
        setNosisQuery(undefined);
        if (selectedQueryId) {
            setLoading(true);
            setSelectedQueryId(selectedQueryId);
            HttpPublicBases.getDetail(selectedQueryId)
                .then((query) => {
                    setNosisQuery(query);
                })
                .catch(() => setError(true))
                .finally(() => setLoading(false));
        }
    }, [selectedQueryId]);
    
    useEffect(() => {
        if (dataId) {
            setLoading(true);
            const promiseGetList = dataSource === BureauInformationSourceType.Company ?
                HttpPublicBases.getListByCompanyId : 
                HttpPublicBases.getListByCompanyFileId;
            
            Promise.all([
                HttpCachePublicBases.getSituationTypes(),
                promiseGetList(dataId)
            ])
                .then(([responseSituationTypes, responseQueryList]) => {
                    setSituationTypes(responseSituationTypes);
                    const optionList = responseQueryList.map(query => ({
                        ...query,
                        [EntityWithIdAndDescriptionFields.Id]: query[EntityWithIdFields.Id],
                        [EntityWithIdAndDescriptionFields.Description]: query[NosisQueryFields.BusinessName],
                    }));
                    
                    setOptions(optionList);
                    if (!selectedQueryId && !!optionList.length) {
                        setSelectedQueryId(optionList[0][EntityWithIdAndDescriptionFields.Id])
                    }
                })
        }
    }, [dataId]);
    //}, [dataId, dataSource]);

    useEffect(() => {
        if (!situationTypes.length)
            HttpCachePublicBases.getSituationTypes().then(setSituationTypes)
    }, [situationTypes]);

    const reloadData = () => {
        if (selectedQueryId) {
            setLoading(true);
            HttpPublicBases.getDetail(selectedQueryId)
                .then((query) => {
                    setNosisQuery(query);
                })
                .catch(() => setError(true))
                .finally(() => setLoading(false));
        }
    };
    
    return (
        <BureauInformationContext.Provider value={{
            loading: loading,
            error: error,
            dataSource: dataSource,
            nosisQuery: nosisQuery,
            situationTypes: situationTypes,
            unknownSituationType: unknownSituationType,
            options: options,
            selectedQueryId: selectedQueryId,
            setSelectedQueryId: setSelectedQueryId,
            optionSelected: options?.find(x => x[EntityWithIdFields.Id] === selectedQueryId),
            showSelectorHeader: options.length > 1 && dataSource !== BureauInformationSourceType.Company,
            onReload: reloadData
        }}>
            {children}
        </BureauInformationContext.Provider>
    );
};