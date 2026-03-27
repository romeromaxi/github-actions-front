import {CompanyFileSourceType, CompanyFileType} from "../company/companyEnums";

export interface SolicitationCompanyFileContextInterface {
    id: number,
    src: CompanyFileSourceType,
    type: CompanyFileType,
    title: string,
    edit: boolean
}

