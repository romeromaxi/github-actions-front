import {EntityWithId} from "../baseEntities";
import {CompanyViewDTO} from "../company/companyData";
import {CompanyActivity, CompanyAfipActivityView} from "../company/companyActivityData";
import {CompanyMailViewDTO, CompanyPhoneViewDTO} from "../company/companyReferentialData";
import {CompanyPersonRelationship} from "../company/companySocietyData";
import {
    CompanyDeclarationOfAssetsTotals,
    CompanyFinancialTotals,
    CompanyFinancialYear, CompanyIncomeLastYearStatement, CompanyLastYearDeclarationOfAssets,
    CompanyPatrimonialStatement
} from "../company/companyFinanceInformationData";
import {CompanyFlowView} from "../company/companyFlowData";
import {EntityAddress} from "../general/generalReferentialData";


export enum CompanyFilePublicFields {
    Company = 'empresa',
    CompanySummary = 'empresaResenia',
    CompanyMail = 'empresaMail',
    CompanyPhone = 'empresaTelefono',
    CompanyAddressess = 'empresaDomicilios',
    CompanyAfipActivities = 'empresaActividadesAfip',
    CompanyRelatedPeople = 'empresaPersonasRelacionadas',
    CompanyExercises = 'empresaEjercicios',
    CompanyTotalExercises = 'empresaEjercicioTotales',
    CompanyTotalPreviousExercises = 'empresaEjercicioTotalesAnterior',
    CompanyLastPatrimonialStatement = 'empresaUltimoEstadoPatrimonial',
    CompanyPreviousPatrimonialStatement = 'empresaAnteriorEstadoPatrimonial',
    CompanyLastResultState = 'empresaUltimoEstadoResultado',
    CompanyPreviousResultState = 'empresaAnteriorEstadoResultado',
    DeclarationOfAssets = 'manifestacionesBienes',
    TotalDeclarationOfAssets = 'manifestacionesBienesTotales',
    Flows = 'movimientos'
}

export interface CompanyFilePublic extends EntityWithId<number> {
    [CompanyFilePublicFields.Company]: CompanyViewDTO,
    [CompanyFilePublicFields.CompanySummary]: CompanyActivity,
    [CompanyFilePublicFields.CompanyMail]: CompanyMailViewDTO,
    [CompanyFilePublicFields.CompanyPhone]: CompanyPhoneViewDTO,
    [CompanyFilePublicFields.CompanyAddressess]: EntityAddress[],
    [CompanyFilePublicFields.CompanyAfipActivities]: CompanyAfipActivityView[],
    [CompanyFilePublicFields.CompanyRelatedPeople]: CompanyPersonRelationship[],
    [CompanyFilePublicFields.CompanyExercises]: CompanyFinancialYear[],
    [CompanyFilePublicFields.CompanyTotalExercises]: CompanyFinancialTotals[],
    [CompanyFilePublicFields.CompanyTotalPreviousExercises]: CompanyFinancialTotals[],
    [CompanyFilePublicFields.CompanyLastPatrimonialStatement]: CompanyPatrimonialStatement,
    [CompanyFilePublicFields.CompanyPreviousPatrimonialStatement]: CompanyPatrimonialStatement,
    [CompanyFilePublicFields.CompanyLastResultState]: CompanyIncomeLastYearStatement,
    [CompanyFilePublicFields.CompanyPreviousResultState]: CompanyIncomeLastYearStatement,
    [CompanyFilePublicFields.DeclarationOfAssets]: CompanyLastYearDeclarationOfAssets,
    [CompanyFilePublicFields.TotalDeclarationOfAssets]: CompanyDeclarationOfAssetsTotals[],
    [CompanyFilePublicFields.Flows]: CompanyFlowView[]
}