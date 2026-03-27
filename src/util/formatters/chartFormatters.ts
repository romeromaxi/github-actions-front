import {SolicitationTotalsView, SolicitationTotalsViewFields} from "../../types/solicitations/solicitationData";
import {DebtQuantityTableRow} from "../../pages/bureau/BCRA/BCRAAmountsTable";
import { SolicitationStatusType } from "types/solicitations/solicitationEnums";
import {SolicitationStatusColorMap} from "../typification/solicitationStatesColor";
import {ProductServiceColorMap} from "../typification/productServiceColor";
import {ProductServiceTypes} from "../../types/product/productdestinyData";


export const formatSolicitationTotalsToChartType = (data: SolicitationTotalsView[]) => {
    return data.map((i) => {
        return {
            label: i.descripcion,
            value: i[SolicitationTotalsViewFields.SolicitationsQuantity]
        }
    })
}


export const formatDebtListDataToChartType = (data: DebtQuantityTableRow[]) => {
    return data.map((i) => {
        return {
            label: `${i.codSituacion} - ${i.situacion}`,
            value: i.monto ?? 0
        }
    })
}


export const formatSolicitationStatesToChartType = (data: SolicitationTotalsView[]) => {
    return data.map((i) => {
        const statusCode = i.id as SolicitationStatusType;

        const color = SolicitationStatusColorMap?.[statusCode] || SolicitationStatusColorMap[SolicitationStatusType.GeneralCompanyRequestSent];

        return {
            label: i.descripcion,
            value: i[SolicitationTotalsViewFields.SolicitationsQuantity],
            color: color.dark,
        };
    });
};

export const formatSolicitationServiceToChartType = (data: SolicitationTotalsView[]) => {
    return data.map((i) => {
        const statusCode = i.id as ProductServiceTypes;

        const color = ProductServiceColorMap?.[statusCode] || ProductServiceColorMap[ProductServiceTypes.Endorsements];

        return {
            label: i.descripcion,
            value: i[SolicitationTotalsViewFields.SolicitationsQuantity],
            color: color.dark,
        };
    });
};


export const defaultPieColors: string[] = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
]