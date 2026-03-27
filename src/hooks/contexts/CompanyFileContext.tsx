import {createContext, ReactNode, useEffect, useMemo, useState} from "react";
import {CompanyFileSourceType, CompanyFileType} from "types/company/companyEnums";
import {
    CompanyDetailFormFields,
    CompanyFields,
    CompanyFileCompletenessFields,
    CompanyFileCompletenessView,
    CompanyFormData,
    CompanyViewDTO,
    CompanyViewDTOFields
} from "../../types/company/companyData";
import {
    HttpCompany,
    HttpCompanyAddress,
    HttpCompanyDeclarationOfAssets,
    HttpCompanyFile,
    HttpCompanyFlow,
    HttpCompanyIncomeStatement,
    HttpCompanyMail,
    HttpCompanyPatrimonialStatement,
    HttpCompanyPhoneNumber,
    HttpExportCompanyFile
} from "../../http";
import {
    CompanyActivityInsert,
    CompanyActivityView,
    CompanyAfipActivityFields,
    CompanyAfipActivityView
} from "../../types/company/companyActivityData";
import {
    CompanyFlowInsert,
    CompanyFlowInsertRequest,
    CompanyFlowInsertRequestFields
} from "../../types/company/companyFlowData";
import {FormProvider, useForm, useFormState} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {CompanyFileEditProfileFormFields} from "../../pages/companyFile/homesEdit/CompanyFileHomeEditProfile";
import * as yup from "yup";
import {MailSchema} from "../../util/validation/validationSchemas";
import {PersonTypes} from "../../types/person/personEnums";
import {
    CompanyDeclarationOfAssets,
    CompanyIncomeLastYearStatement,
    CompanyLastYearDeclarationOfAssets,
    CompanyPatrimonialStatement
} from "../../types/company/companyFinanceInformationData";
import {HttpCompanyActivity, HttpCompanyAfipActivity} from "../../http/company/httpCompanyActivity";
import useAxios from "../useAxios";
import {
    CompanyAddressInsertDTO,
    CompanyAddressViewDTO,
    CompanyMailFields,
    CompanyMailInsert,
    CompanyMailViewDTO,
    CompanyMailViewDTOFields,
    CompanyPhoneInsertDTO,
    CompanyPhoneNumberFields,
    CompanyPhoneViewDTO
} from "../../types/company/companyReferentialData";
import {
    BaseRequestFields,
    BaseResponse,
    BaseResponseFields,
    BaseResponseWithData,
    EntityWithIdFields
} from "../../types/baseEntities";
import {stringFormatter} from "../../util/formatters/stringFormatter";
import {EntityPhoneNumber, EntityPhoneNumberFields} from "../../types/general/generalReferentialData";
import {CompanyFlowFormatter} from "../../util/formatters/companyFlowFormatter";
import {
    FinancialYearEditFormFields,
    FinancialYearEditFormType
} from "../../pages/company/finance/components/FinancialYearDetail";
import {useApplicationCommon} from "./ApplicationCommonContext";
import {useLoaderActions} from "../useLoaderActions";
import {useSnackbarActions} from "../useSnackbarActions";
import CompanyFileExportDialog from "../../pages/companyFile/components/CompanyFileExportDialog";

function emptyCallback<T>(resolve: T): (dataId: number) => Promise<T> {
    return (_: number) => Promise.resolve(resolve); 
}

type CallbackReturnType<T> = (_: number) => Promise<T>;

export enum Sections {
    Main,
    Activity,
    Financial
}

const showSectionByFile : Record<CompanyFileType, Record<Sections, boolean>> = {
    [CompanyFileType.None]: {
        [Sections.Main]: false,
        [Sections.Activity]: false,
        [Sections.Financial]: false,
    },
    [CompanyFileType.Short]: {
        [Sections.Main]: true,
        [Sections.Activity]: true,
        [Sections.Financial]: false,
    },
    [CompanyFileType.Long]: {
        [Sections.Main]: true,
        [Sections.Activity]: true,
        [Sections.Financial]: true,
    },
    [CompanyFileType.MatcherCasfog]: {
        [Sections.Main]: true,
        [Sections.Activity]: true,
        [Sections.Financial]: false,
    },
}

export enum CompanyFileEditFormFields {
    Company = 'company',
    Activity = 'activity',
    AfipActivity = 'afipActivity',
    LastPatrimonialStatement = 'lastPatrimonialStatement',
    LastIncomeStatement = 'lastIncomeStatement',
    PreviousPatrimonialStatement = 'prevPatrimonialStatement',
    PreviousIncomeStatement = 'prevIncomeStatement',
    Flow = 'flow',
    DeclarationOfAssets = 'declarationOfAssets',
    CompanyPersonType = 'companyPersonType',
    IsPhyisicalPerson = 'isPhyisicalPerson',
}

export interface CompanyFileEditForm {
    [CompanyFileEditFormFields.Company]?: CompanyFormData;
    [CompanyFileEditFormFields.Activity]?: CompanyActivityInsert;
    [CompanyFileEditFormFields.AfipActivity]?: CompanyAfipActivityView;
    [CompanyFileEditFormFields.LastPatrimonialStatement]?: CompanyPatrimonialStatement;
    [CompanyFileEditFormFields.LastIncomeStatement]?: CompanyIncomeLastYearStatement;
    [CompanyFileEditFormFields.PreviousPatrimonialStatement]?: CompanyPatrimonialStatement;
    [CompanyFileEditFormFields.PreviousIncomeStatement]?: CompanyIncomeLastYearStatement;
    [CompanyFileEditFormFields.Flow]?: CompanyFlowInsert[];
    [CompanyFileEditFormFields.DeclarationOfAssets]?: CompanyLastYearDeclarationOfAssets;
    [CompanyFileEditFormFields.CompanyPersonType]?: PersonTypes;
    [CompanyFileEditFormFields.IsPhyisicalPerson]?: boolean;
}

export function useCompanyFile(
    dataId: number, 
    dataSource: CompanyFileSourceType,
    companyFileType: CompanyFileType
) {
    const {fetchAndDownloadFile} = useAxios();
    
    const isLiveInformation : boolean = dataSource === CompanyFileSourceType.Company;
        
    // Los datos de la empresa los vamos a necesitar siempre
    const _getCallbackLoadCompany : CallbackReturnType<CompanyViewDTO> =
        isLiveInformation ?
            HttpCompany.getCompanyById : 
            HttpCompanyFile.getCompanyByFileId;

    const _getCallbackLoadActivity = (fileType: CompanyFileType) : CallbackReturnType<CompanyActivityView | undefined> =>
        (showSectionByFile[fileType][Sections.Main]) ?
            isLiveInformation ?
                HttpCompanyActivity.getByCompanyId : HttpCompanyFile.getCompanyActivityByFileId
            :
            emptyCallback(undefined)

    const _getCallbackLoadAfipActivity = (fileType: CompanyFileType) : CallbackReturnType<CompanyAfipActivityView[] | undefined> =>
        (showSectionByFile[fileType][Sections.Main]) ?
            isLiveInformation ?
                HttpCompanyAfipActivity.getByCompanyId : HttpCompanyFile.getCompanyAfipActivitiesByFileId
            :
            emptyCallback(undefined)
    
    const _getPhoneNumberFromFileToList = (fileId: number) => {
        return HttpCompanyFile.getCompanyPhoneNumberByFileId(fileId)
            .then((response) => {
                return response ? [response] : [];
            })
    }
    
    const _getCallbackLoadPhoneNumber = (fileType: CompanyFileType) : CallbackReturnType<CompanyPhoneViewDTO[]> =>
        (showSectionByFile[fileType][Sections.Main]) ?
            isLiveInformation ?
                HttpCompanyPhoneNumber.get :
                _getPhoneNumberFromFileToList
            :
            emptyCallback([])

    const _getCallbackLoadMail = (fileType: CompanyFileType) : CallbackReturnType<CompanyMailViewDTO | undefined> =>
        (showSectionByFile[fileType][Sections.Main]) ? 
            isLiveInformation ?
                HttpCompanyMail.get : HttpCompanyFile.getCompanyMailByFileId
            :
            emptyCallback(undefined)

    const _getCallbackLoadAddress = (fileType: CompanyFileType) : CallbackReturnType<CompanyAddressViewDTO[]> =>
        (showSectionByFile[fileType][Sections.Main]) ?
            isLiveInformation ?
                HttpCompanyAddress.get : HttpCompanyFile.getCompanyAddressesByFileId
            :
            emptyCallback([])
    
    const _getCallbackLoadPatrimonialStatementLastYear = (fileType: CompanyFileType) : CallbackReturnType<CompanyPatrimonialStatement | undefined> =>
        (showSectionByFile[fileType][Sections.Financial]) ?
            isLiveInformation ?
                HttpCompanyPatrimonialStatement.getLast : HttpCompanyFile.getCompanyLastPatrimonialStateByFileId
            :
            emptyCallback(undefined)

    const _getCallbackLoadIncomeStatementLastYear = (fileType: CompanyFileType) : CallbackReturnType<CompanyIncomeLastYearStatement | undefined> =>
        (showSectionByFile[fileType][Sections.Financial]) ?
            isLiveInformation ?
                HttpCompanyIncomeStatement.getLast : HttpCompanyFile.getCompanyLastIncomeStateByFileId
            :
            emptyCallback(undefined)

    const _getCallbackLoadPatrimonialStatementPreviousYear = (fileType: CompanyFileType) : CallbackReturnType<CompanyPatrimonialStatement | undefined> =>
        (showSectionByFile[fileType][Sections.Financial]) ?
            isLiveInformation ?
                HttpCompanyPatrimonialStatement.getPrevious : HttpCompanyFile.getCompanyPreviousPatrimonialStateByFileId
            :
            emptyCallback(undefined)

    const _getCallbackLoadIncomeStatementPreviousYear = (fileType: CompanyFileType) : CallbackReturnType<CompanyIncomeLastYearStatement | undefined> =>
        (showSectionByFile[fileType][Sections.Financial]) ?
            isLiveInformation ?
                HttpCompanyIncomeStatement.getPrevious : HttpCompanyFile.getCompanyPreviousIncomeStateByFileId
            :
            emptyCallback(undefined)
    
    const _getCallbackLoadDeclarationOfAssetsLastYear = (fileType: CompanyFileType, personTypeCode: PersonTypes) 
        : CallbackReturnType<CompanyLastYearDeclarationOfAssets | undefined> =>
        ((!showSectionByFile[fileType][Sections.Financial]) || personTypeCode !== PersonTypes.Physical) ?
            emptyCallback(undefined)
            :
            isLiveInformation ?
                HttpCompanyDeclarationOfAssets.getLastByCompany :
                HttpCompanyFile.getCompanyDeclarationOfAssetsByFileId
    
    const _getCompanyFlowsBySemesterList = (companyId: number) =>
        HttpCompanyFlow.getSemesterList(companyId)
            .then((semesters) => {
                return CompanyFlowFormatter.parseSemestersToFlow(semesters, true);
            })
    
    const _getCallbackLoadCompanyFlows = (fileType: CompanyFileType) : CallbackReturnType<CompanyFlowInsert[]> =>
        (showSectionByFile[fileType][Sections.Financial]) ?
            isLiveInformation ?
                _getCompanyFlowsBySemesterList : HttpCompanyFile.getCompanyFlowsViewByFileId
            :
            emptyCallback([])

    const getCompanyFileData = async (fileType: CompanyFileType) => {
        const responseCompany = await _getCallbackLoadCompany(dataId);
        const personTypeCode = responseCompany[CompanyViewDTOFields.PersonTypeCode] as PersonTypes;
 
        const values = await Promise.all([
            _getCallbackLoadActivity(fileType)(dataId),
            _getCallbackLoadAfipActivity(fileType)(dataId),

            _getCallbackLoadPhoneNumber(fileType)(dataId),
            _getCallbackLoadMail(fileType)(dataId),
            _getCallbackLoadAddress(fileType)(dataId),

            _getCallbackLoadPatrimonialStatementLastYear(fileType)(dataId),
            _getCallbackLoadIncomeStatementLastYear(fileType)(dataId),
            _getCallbackLoadPatrimonialStatementPreviousYear(fileType)(dataId),
            _getCallbackLoadIncomeStatementPreviousYear(fileType)(dataId),

            _getCallbackLoadDeclarationOfAssetsLastYear(fileType, personTypeCode)(dataId),

            _getCallbackLoadCompanyFlows(fileType)(dataId)
        ]);

        const [
            activity, listActivities, phoneNumbers, mail, addresses,
            lastPatrimonial, lastIncome, prevPatrimonial, prevIncome, 
            declarationAssests, flows
        ] = values;

        const mainPhoneEntity: EntityPhoneNumber | undefined = phoneNumbers ? 
            phoneNumbers.find((ph) => ph[EntityPhoneNumberFields.MainPhone]) : undefined;
        
        let mainPhoneNumber : string = '';
        
        if (!!mainPhoneEntity)
            mainPhoneNumber = 
                stringFormatter.phoneNumberWithAreaCode(
                    mainPhoneEntity[CompanyPhoneNumberFields.AreaCode] || '',
                    mainPhoneEntity[CompanyPhoneNumberFields.PhoneNumber] || '',
                );
        
        // @ts-ignore
        const companyData = {
            ...responseCompany,
            [CompanyDetailFormFields.Phone]: mainPhoneNumber,
            [CompanyDetailFormFields.PhonesList]: phoneNumbers,
            [CompanyDetailFormFields.Mail]: mail ? mail[CompanyMailViewDTOFields.Mail] : undefined,
            [CompanyDetailFormFields.Address]: addresses,
            [CompanyDetailFormFields.Web]: responseCompany[CompanyViewDTOFields.Web]
        } as CompanyFormData;

        const mainAfipActivity = listActivities?.filter(
            (x) => x[CompanyAfipActivityFields.IsMainActivity],
        )[0] ?? undefined

        return {
            [CompanyFileEditFormFields.Company]: companyData,
            [CompanyFileEditFormFields.Activity]: activity,
            [CompanyFileEditFormFields.AfipActivity]: mainAfipActivity,

            [CompanyFileEditFormFields.LastPatrimonialStatement]: lastPatrimonial,
            [CompanyFileEditFormFields.LastIncomeStatement]: lastIncome,
            [CompanyFileEditFormFields.PreviousPatrimonialStatement]: prevPatrimonial,
            [CompanyFileEditFormFields.PreviousIncomeStatement]: prevIncome,
            
            [CompanyFileEditFormFields.Flow]: flows,
            [CompanyFileEditFormFields.DeclarationOfAssets]: declarationAssests,
            [CompanyFileEditFormFields.CompanyPersonType]: personTypeCode,
            [CompanyFileEditFormFields.IsPhyisicalPerson]: personTypeCode === PersonTypes.Physical
        } as CompanyFileEditForm;
    }
    
    const exportFileToExcel = () => {
        const exportFunction =
            dataSource === CompanyFileSourceType.Company
                ? HttpExportCompanyFile.exportLongFileToExcelByCompany
                : HttpExportCompanyFile.exportToExcelByFile;

        fetchAndDownloadFile(() => exportFunction(dataId));
    }

    const exportFileBySectionsToExcel = (codsSections: number[]) => {
        const exportFunction =
            dataSource === CompanyFileSourceType.Company
                ? (cods: number[]) => HttpExportCompanyFile.exportCompanyFileLiveBySections(dataId, companyFileType, cods)
                : (cods: number[]) => HttpExportCompanyFile.exportCompanyFileSnapshotBySections(dataId, cods)

        fetchAndDownloadFile(() => exportFunction(codsSections));
    }

    const onHandleSubmit = (data: CompanyFileEditForm, fileType: CompanyFileType) => {
        const mappedPhonesList: CompanyPhoneInsertDTO[] = 
            data[CompanyFileEditFormFields.Company]?.[CompanyDetailFormFields.PhonesList]
                .map((phone) => {
                    return {
                        ...phone,
                        codModulo: 1,
                        codOrigen: 1,
                    };
                }) || [];

        const companyData: CompanyFormData = data[CompanyFileEditProfileFormFields.Company] ?? {} as CompanyFormData;

        const flows: CompanyFlowInsertRequest = {
            [CompanyFlowInsertRequestFields.FlowList]: data[CompanyFileEditFormFields.Flow] ?? [],
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1,
        };

        if (data[CompanyFileEditFormFields.IsPhyisicalPerson]) 
            return updatePhysicalPerson(data, companyData, mappedPhonesList, flows, fileType);

        return updateLegalPerson(data, companyData, mappedPhonesList, flows, fileType);
    };

    const updateLegalPerson = (
        data: CompanyFileEditForm,
        companyData: CompanyFormData,
        mappedPhonesList: CompanyPhoneInsertDTO[],
        flows: CompanyFlowInsertRequest, 
        fileType: CompanyFileType,
    ) => {
        const promises : Promise<void | [any, any]>[] = [
            insertCompanyPhoneNumber(mappedPhonesList),
            insertCompanyMail(companyData[CompanyFields.Mail]),
            updateCompany(companyData),
            updateClosingDate(companyData[CompanyDetailFormFields.DateClosing]),
            insertCompanyAddressList(
                companyData[CompanyViewDTOFields.Address] as CompanyAddressInsertDTO[],
            ),
            updateActivity(data[CompanyFileEditProfileFormFields.Activity]),
        ];

        if (showSectionByFile[fileType][Sections.Financial]) {
            if (data[CompanyFileEditFormFields.LastPatrimonialStatement] && data[CompanyFileEditFormFields.LastIncomeStatement]) {
                const lastFinancial: FinancialYearEditFormType = {
                    [FinancialYearEditFormFields.PatrimonialStatement]: data[CompanyFileEditFormFields.LastPatrimonialStatement] || {} as CompanyPatrimonialStatement,
                    [FinancialYearEditFormFields.IncomeStatement]: data[CompanyFileEditFormFields.LastIncomeStatement] || {} as CompanyIncomeLastYearStatement
                }

                promises.push(updateFinancials(lastFinancial));
            }

            if (data[CompanyFileEditFormFields.PreviousPatrimonialStatement] && data[CompanyFileEditFormFields.PreviousIncomeStatement]) {
                const prevFinancial: FinancialYearEditFormType = {
                    [FinancialYearEditFormFields.PatrimonialStatement]: data[CompanyFileEditFormFields.PreviousPatrimonialStatement] || {} as CompanyPatrimonialStatement,
                    [FinancialYearEditFormFields.IncomeStatement]: data[CompanyFileEditFormFields.PreviousIncomeStatement] || {} as CompanyIncomeLastYearStatement
                }

                promises.push(updateFinancials(prevFinancial));
            }

            promises.push(insertFlowList(flows));
        }

        return Promise.all(promises);
    };

    const updatePhysicalPerson = (
        data: CompanyFileEditForm,
        companyData: CompanyFormData,
        mappedPhonesList: CompanyPhoneInsertDTO[],
        flows: CompanyFlowInsertRequest,
        fileType: CompanyFileType,
    ) => {
        const promises : Promise<void | BaseResponse>[] = [
            insertCompanyPhoneNumber(mappedPhonesList),
            insertCompanyMail(companyData[CompanyFields.Mail]),
            updateCompany(companyData),
            insertCompanyAddressList(
                companyData[CompanyViewDTOFields.Address] as CompanyAddressInsertDTO[],
            ),
            updateActivity(data[CompanyFileEditProfileFormFields.Activity]),
        ];
        
        if (showSectionByFile[fileType][Sections.Financial]) {
            promises.push(
                updateDeclarationOfAssets(
                    data[CompanyFileEditProfileFormFields.DeclarationOfAssets]
                ),
            );

            promises.push(insertFlowList(flows));
        }

        return Promise.all(promises);
    };

    const updateClosingDate = (date?: string): Promise<void> => {
        if (!date) return new Promise((resolve) => resolve());

        let [day, month] = date.split('/').map((x) => parseInt(x)) || [0, 0];

        return HttpCompany.updateClosingDate(dataId, day, month);
    };

    const updateFinancials = (financials: FinancialYearEditFormType) => {
        return Promise.all([
            HttpCompanyPatrimonialStatement.update(
                dataId,
                financials[FinancialYearEditFormFields.PatrimonialStatement][
                    EntityWithIdFields.Id
                    ],
                financials[FinancialYearEditFormFields.PatrimonialStatement],
            ),
            HttpCompanyIncomeStatement.update(
                dataId,
                financials[FinancialYearEditFormFields.IncomeStatement][
                    EntityWithIdFields.Id
                    ],
                financials[FinancialYearEditFormFields.IncomeStatement],
            ),
        ]);
    };

    const updateDeclarationOfAssets = (
        declarationOfAssets: CompanyDeclarationOfAssets | undefined,
    ) => {
        if (!declarationOfAssets) return Promise.resolve();
        
        return HttpCompanyDeclarationOfAssets.update(
            dataId,
            declarationOfAssets[EntityWithIdFields.Id],
            declarationOfAssets,
        );
    };

    const insertFlowList = (flows: CompanyFlowInsertRequest) => {
        return HttpCompanyFlow.insertList(dataId, { ...flows });
    };

    const insertCompanyMail = (mail: string): Promise<void> => {
        let companyMail: CompanyMailInsert = {
            [CompanyMailFields.MailTypeCode]: 0,
            [CompanyMailFields.Mail]: mail,
        };
        return HttpCompanyMail.insert(dataId, companyMail);
    };

    const insertCompanyPhoneNumber = (
        phoneList: CompanyPhoneInsertDTO[],
    ): Promise<void> => {
        return HttpCompanyPhoneNumber.insertList(dataId, phoneList);
    };

    const updateCompany = (
        company: CompanyViewDTO | CompanyFormData,
    ): Promise<void> => {
        return HttpCompany.updateCompany(dataId, company);
    };

    const insertCompanyAddressList = (
        addressList: CompanyAddressInsertDTO[],
    ): Promise<void> => {
        return HttpCompanyAddress.insertList(dataId, addressList);
    };

    const updateActivity = (activity: CompanyActivityInsert | undefined): Promise<void> => {
        if (!activity) return Promise.resolve();
        
        return HttpCompanyActivity.updateActivity(dataId, activity[EntityWithIdFields.Id], activity);
    };
    
    return {
        getCompanyFileData,
        exportFileToExcel,
        exportFileBySectionsToExcel,
        onHandleSubmit
    }
}

interface CompanyFileContextProviderProps {
    dataId: number,
    dataSource: CompanyFileSourceType,
    companyFileType?: CompanyFileType,
    children: ReactNode;
}

interface CompanyFileContextType {
    reloadData: () => void,
    exportFileToExcel: () => void,
    updateCompanyFile: () => Promise<BaseResponseWithData<boolean>>,
    changeFileType: (_: CompanyFileType) => void,
    cancelEditing: () => void,
    completenessPercentage: CompanyFileCompletenessView | undefined,
    fileTypeCompleteness: number,
    isCompletedFile: () => boolean,
    loading: boolean,
    loadingForm: boolean,
    showSection: Record<Sections, boolean>,
    company: CompanyViewDTO | undefined,
    dataSource: CompanyFileSourceType,
    openExportDialog: () => void
}

export const CompanyFileContext = createContext<CompanyFileContextType>({
    reloadData: () => {},
    exportFileToExcel: () => {},
    updateCompanyFile: async () : Promise<BaseResponseWithData<boolean>> => Promise.resolve({} as BaseResponseWithData<boolean>),
    changeFileType: (_: CompanyFileType) => { },
    cancelEditing: () => { },
    completenessPercentage: undefined as CompanyFileCompletenessView | undefined,
    fileTypeCompleteness: 0 as number,
    isCompletedFile: () => { return false; },
    loading: false as boolean,
    loadingForm: true as boolean,
    showSection: showSectionByFile[CompanyFileType.None] as Record<Sections, boolean>,
    company: undefined as CompanyViewDTO | undefined,
    dataSource: CompanyFileSourceType.Company,
    openExportDialog: () => {}
});


const isCompletedCompanyFile = (
    fileType: CompanyFileType, completeness: CompanyFileCompletenessView | undefined) => 
{
    if (!completeness) return false;

    if (fileType !== CompanyFileType.Long)
        return completeness[CompanyFileCompletenessFields.FileTypeShortCompletenessPercentage] >= 100;

    return completeness[CompanyFileCompletenessFields.FileTypeLongCompletenessPercentage] >= 100;
}


export const CompanyFileContextProvider = ({
    dataId, dataSource, companyFileType = CompanyFileType.None, children
                                    }: CompanyFileContextProviderProps) => {
    
    const { showLoader, hideLoader } = useLoaderActions();
    const { addSnackbarSuccess, addSnackbarError } = useSnackbarActions();
    const { getCompanyFileData, exportFileToExcel, exportFileBySectionsToExcel, onHandleSubmit } = useCompanyFile(dataId, dataSource, companyFileType);
    const { setShouldWarnBeforeSwitch } = useApplicationCommon();

    const [prevCompanyFileValue, setPrevCompanyFileValue] = useState<CompanyFileEditForm>();
    const [completenessPercentage, setCompletenessPercentage] = useState<CompanyFileCompletenessView>();
    const [fileType, setFileType] = useState<CompanyFileType>(companyFileType);
    const [showSection, setShowSection] = useState<Record<Sections, boolean>>(showSectionByFile[CompanyFileType.None]);
    const [openExportDialog, setOpenExportDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [company, setCompany] = useState<CompanyViewDTO>();
    const fileTypeCompleteness = useMemo(() => {
        if (!completenessPercentage || !fileType) return 0;

        switch (fileType) {
            case CompanyFileType.Long:
                return completenessPercentage[CompanyFileCompletenessFields.FileTypeLongCompletenessPercentage];

            case CompanyFileType.Short:
            case CompanyFileType.MatcherCasfog:
            default:
                return completenessPercentage[CompanyFileCompletenessFields.FileTypeShortCompletenessPercentage];
        }

    }, [completenessPercentage, fileType])

    const companyFileEditSchema = yup.object().shape({
        [CompanyFileEditProfileFormFields.Company]: yup.object().shape({
            [CompanyDetailFormFields.Mail]: MailSchema,
        }),
    });
    const methods = useForm<CompanyFileEditForm>({
        resolver: yupResolver(companyFileEditSchema)
    });
    const { isDirty } = useFormState({ control: methods.control });
    
    const reloadData = () => {
        setLoading(true)
        methods.reset();
        setCompletenessPercentage(undefined);
        const promises = [];
        promises.push(getCompanyFileData(fileType));
        
        if (dataSource === CompanyFileSourceType.Company)
            promises.push(HttpCompany.getCompletenessPercentage(dataId))
        
        Promise.all(promises)
          .then(responses => {
              const dataResponse = responses[0];
              if (responses.length > 1) {
                  setCompletenessPercentage(responses[1])
              }
              setShowSection(showSectionByFile[fileType])
              methods.reset(dataResponse)
              setPrevCompanyFileValue(dataResponse)
              setLoading(false)
          })
    }

    useEffect(() => {
        reloadData();
        
        if (dataSource === CompanyFileSourceType.Company && dataId)
            HttpCompany.getCompanyById(dataId).then(setCompany);
    }, [dataId, fileType]);

    const updateCompanyFile = async (data: CompanyFileEditForm) : Promise<BaseResponseWithData<boolean>> => {
        showLoader();
        let hasComplete = false;
        
        try {
            await onHandleSubmit(data, fileType);
            const responseCompleteness = await HttpCompany.getCompletenessPercentage(dataId);
            hasComplete = isCompletedCompanyFile(fileType, responseCompleteness);
            setShouldWarnBeforeSwitch(false);
        } catch (e) {
            addSnackbarError('No se pudieron guardar los datos del legajo');
            hideLoader();
            return {
                [BaseResponseFields.Data]: false,
                [BaseResponseFields.HasError]: true,
                [BaseResponseFields.ErrorDescription]: ''
            } as BaseResponseWithData<boolean>
        }
        
        reloadData();
        hideLoader();
        addSnackbarSuccess('Los datos del legajo se guardaron correctamente');
        
        return {
            [BaseResponseFields.Data]: hasComplete,
            [BaseResponseFields.HasError]: false
        } as BaseResponseWithData<boolean>
    };

    const updateCompanyFileWrapped = async () => {
        const isValid = await methods.trigger();

        if (!isValid) {
            return {
                [BaseResponseFields.Data]: false,
                [BaseResponseFields.HasError]: true,
                [BaseResponseFields.ErrorDescription]: 'Formulario inválido'
            }
        }

        return updateCompanyFile(methods.getValues());
    }
    
    const cancelEditing = () => {
        methods.reset(prevCompanyFileValue);
        setShouldWarnBeforeSwitch(false);
    }

    const isCompletedFile = () => {
        if (!completenessPercentage) return false;
        
        if (fileType !== CompanyFileType.Long)
            return completenessPercentage[CompanyFileCompletenessFields.FileTypeShortCompletenessPercentage] >= 100;

        return completenessPercentage[CompanyFileCompletenessFields.FileTypeLongCompletenessPercentage] >= 100;
    }

    useEffect(() => {
        setShouldWarnBeforeSwitch(isDirty);
    }, [isDirty]);
    
    return (
        <FormProvider {...methods}>
            <CompanyFileContext.Provider value={{
                reloadData,
                exportFileToExcel,
                updateCompanyFile: updateCompanyFileWrapped,
                fileTypeCompleteness: fileTypeCompleteness,
                changeFileType: setFileType,
                cancelEditing,
                completenessPercentage: completenessPercentage,
                isCompletedFile: isCompletedFile,
                loading: loading,
                loadingForm: methods.watch(`${CompanyFileEditFormFields.Company}.${CompanyViewDTOFields.CUIT}`) == undefined,
                showSection: showSection,
                company: company, 
                dataSource: dataSource,
                openExportDialog: () => setOpenExportDialog(true)
             }}>
                 {children}
             </CompanyFileContext.Provider>
            
            <CompanyFileExportDialog open={openExportDialog} 
                                     companyFileType={fileType} 
                                     onClose={() => setOpenExportDialog(false)}
                                     onSubmit={(data) => { exportFileBySectionsToExcel(data); setOpenExportDialog(false) }}
            />
        </FormProvider>
    )
}
