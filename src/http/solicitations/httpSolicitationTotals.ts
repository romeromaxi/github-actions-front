import {SolicitationTotalsView} from "../../types/solicitations/solicitationData";
import {HttpAxiosRequest} from "../httpAxiosBase";


export const HttpSolicitationTotals = {
    getEndpoint: (url: string = ''): string => `/solicitudes/totales/empresas/oferentes${url}`,

    getTotals: (): Promise<SolicitationTotalsView[]> =>
        HttpAxiosRequest.get(HttpSolicitationTotals.getEndpoint('')),

    getServiceTotals: (): Promise<SolicitationTotalsView[]> =>
        HttpAxiosRequest.get(HttpSolicitationTotals.getEndpoint('/servicios')),

    getStateTotals: (): Promise<SolicitationTotalsView[]> =>
        HttpAxiosRequest.get(HttpSolicitationTotals.getEndpoint('/estados'))
}