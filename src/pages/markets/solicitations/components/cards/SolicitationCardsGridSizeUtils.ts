import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {SolicitationTypes} from "types/solicitations/solicitationEnums";

export enum SolicitationCardsGridFields {
    CheckboxSelection,
    CompanyBusinessName,
    ProductLineDescription,
    ProductDesc,
    LastModified,
    Status,
    Actions
}

const ColumnSizesFullVersion : Record<SolicitationCardsGridFields, number> = {
    [SolicitationCardsGridFields.CheckboxSelection]: 0.4,
    [SolicitationCardsGridFields.CompanyBusinessName]: 2.2,
    [SolicitationCardsGridFields.ProductLineDescription]: 1.9,
    [SolicitationCardsGridFields.ProductDesc]: 1.7,
    [SolicitationCardsGridFields.LastModified]: 1.3,
    [SolicitationCardsGridFields.Status]: 2.1,
    [SolicitationCardsGridFields.Actions]: 2.3,
}

const ColumnSizesFullWithoutSelectionVersion : Record<SolicitationCardsGridFields, number> = {
    [SolicitationCardsGridFields.CheckboxSelection]: 0,
    [SolicitationCardsGridFields.CompanyBusinessName]: 2.6,
    [SolicitationCardsGridFields.ProductLineDescription]: 1.9,
    [SolicitationCardsGridFields.ProductDesc]: 1.7,
    [SolicitationCardsGridFields.LastModified]: 1.3,
    [SolicitationCardsGridFields.Status]: 2.1,
    [SolicitationCardsGridFields.Actions]: 2.3,
}

const ColumnSizesFullWithoutCompanyVersion : Record<SolicitationCardsGridFields, number> = {
    [SolicitationCardsGridFields.CheckboxSelection]: 0.5,
    [SolicitationCardsGridFields.CompanyBusinessName]: 0,
    [SolicitationCardsGridFields.ProductLineDescription]: 2.5,
    [SolicitationCardsGridFields.ProductDesc]: 2.2,
    [SolicitationCardsGridFields.LastModified]: 1.7,
    [SolicitationCardsGridFields.Status]: 2.2,
    [SolicitationCardsGridFields.Actions]: 2.9,
}
const ColumnSizesFullWithoutCompanyAndWithoutSelectionVersion : Record<SolicitationCardsGridFields, number> = {
    [SolicitationCardsGridFields.CheckboxSelection]: 0,
    [SolicitationCardsGridFields.CompanyBusinessName]: 0,
    [SolicitationCardsGridFields.ProductLineDescription]: 3,
    [SolicitationCardsGridFields.ProductDesc]: 2.2,
    [SolicitationCardsGridFields.LastModified]: 1.7,
    [SolicitationCardsGridFields.Status]: 2.2,
    [SolicitationCardsGridFields.Actions]: 2.9,
}

const ColumnSizesMinimalVersion : Record<SolicitationCardsGridFields, number> = {
    [SolicitationCardsGridFields.CheckboxSelection]: 0,
    [SolicitationCardsGridFields.CompanyBusinessName]: 2.2,
    [SolicitationCardsGridFields.ProductLineDescription]: 2.1,
    [SolicitationCardsGridFields.ProductDesc]: 1.8,
    [SolicitationCardsGridFields.LastModified]: 1.3,
    [SolicitationCardsGridFields.Status]: 2.1,
    [SolicitationCardsGridFields.Actions]: 2.2,
}

const ColumnSizesMatcherFullVersion : Record<SolicitationCardsGridFields, number> = {
    [SolicitationCardsGridFields.CheckboxSelection]: 0.4,
    [SolicitationCardsGridFields.CompanyBusinessName]: 2.2,
    [SolicitationCardsGridFields.ProductLineDescription]: 6.6,
    [SolicitationCardsGridFields.ProductDesc]: 0,
    [SolicitationCardsGridFields.LastModified]: 0,
    [SolicitationCardsGridFields.Status]: 0,
    [SolicitationCardsGridFields.Actions]: 2.7,
}

const ColumnSizesMatcherFullWithoutAssociatedVersion : Record<SolicitationCardsGridFields, number> = {
    [SolicitationCardsGridFields.CheckboxSelection]: 0,
    [SolicitationCardsGridFields.CompanyBusinessName]: 2.6,
    [SolicitationCardsGridFields.ProductLineDescription]: 4.9,
    [SolicitationCardsGridFields.ProductDesc]: 0,
    [SolicitationCardsGridFields.LastModified]: 0,
    [SolicitationCardsGridFields.Status]: 2.1,
    [SolicitationCardsGridFields.Actions]: 2.3,
}

const ColumnSizesMatcherWithoutCompanyVersion : Record<SolicitationCardsGridFields, number> = {
    [SolicitationCardsGridFields.CheckboxSelection]: 0.5,
    [SolicitationCardsGridFields.CompanyBusinessName]: 0,
    [SolicitationCardsGridFields.ProductLineDescription]: 7.3,
    [SolicitationCardsGridFields.ProductDesc]: 0,
    [SolicitationCardsGridFields.LastModified]: 0,
    [SolicitationCardsGridFields.Status]: 0,
    [SolicitationCardsGridFields.Actions]: 4.2,
}

const ColumnSizesMatcherWithoutCompanyWithoutAssociatedAndVersion : Record<SolicitationCardsGridFields, number> = {
    [SolicitationCardsGridFields.CheckboxSelection]: 0,
    [SolicitationCardsGridFields.CompanyBusinessName]: 0,
    [SolicitationCardsGridFields.ProductLineDescription]: 6.9,
    [SolicitationCardsGridFields.ProductDesc]: 0,
    [SolicitationCardsGridFields.LastModified]: 0,
    [SolicitationCardsGridFields.Status]: 2.2,
    [SolicitationCardsGridFields.Actions]: 2.9,
}

export const getColumnSizesBySolicitation = (
    solicitation: any,
    hideCompanyInfo: boolean | undefined,
    isMinimalActions: boolean | undefined,
    canSelected: boolean | undefined
) : Record<SolicitationCardsGridFields, number> => {
    if (solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.Matcher) {
        if (hideCompanyInfo)
            return solicitation[SolicitationViewDTOFields.HasAssociatedSolicitations] ?
                ColumnSizesMatcherWithoutCompanyVersion :
                ColumnSizesMatcherWithoutCompanyWithoutAssociatedAndVersion

        return solicitation[SolicitationViewDTOFields.HasAssociatedSolicitations] ?
            ColumnSizesMatcherFullVersion :
            ColumnSizesMatcherFullWithoutAssociatedVersion
    }

    if (hideCompanyInfo)
        return !canSelected ? ColumnSizesFullWithoutCompanyAndWithoutSelectionVersion : ColumnSizesFullWithoutCompanyVersion;

    if (!canSelected)
        return ColumnSizesFullWithoutSelectionVersion;

    return isMinimalActions ? ColumnSizesMinimalVersion : ColumnSizesFullVersion;
}