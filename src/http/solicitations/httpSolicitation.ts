import {HttpAxiosRequest} from 'http/httpAxiosBase';
import {
    CompanySolicitationFilter,
    GeneralSolicitationFilter,
    SolicitationAccessView, SolicitationAlertViewDTO,
    SolicitationAllowAccess, SolicitationCancelMultiple,
    SolicitationCompanyDataHeaderContainer,
    SolicitationCompanyRequirement,
    SolicitationFilter,
    SolicitationFlags, SolicitationHistoryView,
    SolicitationInitialMessageDTO, SolicitationOffererResultView, SolicitationReadyToSendFilter,
    SolicitationRequirement,
    SolicitationRequirementDTO,
    SolicitationRequirementInsert,
    SolicitationStep,
    SolicitationSummaryViewDTO,
    SolicitationTotalsView, SolicitationTotalsViewCompany,
    SolicitationTotalsViewOfferer,
    SolicitationViewDTO,
} from 'types/solicitations/solicitationData';
import {
    BaseRequestFields,
    BaseResponse,
    EntityListWithPagination,
    EntityWithIdAndDescription,
} from '../../types/baseEntities';
import {OffererSummaryView} from '../../types/offerer/offererData';
import {DocumentCopyBody} from '../../types/files/filesFoldersData';
import {CompanySolicitationFileHistory} from '../../types/company/companyData';
import {ProductLineView} from "../../types/lines/productLineData";

export const HttpSolicitation = {
    getEndpoint: (url: string = ''): string => `solicitudes${url}`,

    getSolicitationsByUser: (filter: GeneralSolicitationFilter): Promise<EntityListWithPagination<SolicitationViewDTO>> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpSolicitation.getEndpoint(`/empresas`),
            {...filter}
        );
    },

    getByFilter: (
        companyId: number,
        filter: CompanySolicitationFilter,
    ): Promise<EntityListWithPagination<SolicitationViewDTO>> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpSolicitation.getEndpoint(`/empresa/${companyId}/filtro`),
            {...filter},
        );
    },

    getAlertById: (solicitationId: number): Promise<SolicitationAlertViewDTO> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/alertas`)
        )
    },

    getSolicitationsByCompany: (
        companyId: number,
        stateCode?: number,
        stateClasificationCode?: number,
        offererStateCode?: number,
        offererStateClasificationCode?: number,
    ): Promise<SolicitationViewDTO[]> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpSolicitation.getEndpoint(`/empresa/${companyId}`),
            {
                codSolicitudEstadoEmpresa: stateCode,
                codSolicitudEstadoClasificacionEmpresa: stateClasificationCode,
                codSolicitudEstadoOferente: offererStateCode,
                codSolicitudEstadoClasificacionOferente: offererStateClasificationCode,
            },
        );
    },

    getSolicitationRequirements: (
        solicitationId: number,
    ): Promise<SolicitationRequirement[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/requerimientos`),
        );
    },

    updateSolicitationFile: (solicitationId: number): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(`/${solicitationId}/actualizar-legajo`),
            {},
        );
    },

    markSolicitationAsViewed: (solicitationId: number): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(`/${solicitationId}/leer`),
            {
                [BaseRequestFields.ModuleCode]: 1,
                [BaseRequestFields.OriginCode]: 1,
            },
        );
    },

    updateSolicitationRequirements: (
        solicitationId: number,
        requirements: SolicitationRequirementInsert[],
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(`/${solicitationId}/requerimientos`),
            requirements,
        );
    },

    getTotalSolicitationsByOfferer: (
        offererId: number,
    ): Promise<SolicitationTotalsViewOfferer> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/oferente/${offererId}/totales`),
        );
    },

    getTotalSolicitationsByUserOfferer: (
        offererId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/oferente/${offererId}/totales/usuarios`),
        );
    },

    getTotalSolicitationsByUserStates: (
        offererId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/oferente/${offererId}/totales/estados`),
        );
    },

    getTotalSolicitationsByUserProducts: (
        offererId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/oferente/${offererId}/totales/productos`),
        );
    },

    getTotalSolicitationsByWorkTeamAssignments: (
        offererId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/oferente/${offererId}/totales/equipos/asignaciones`),
        );
    },

    getTotalSolicitationsByWorkTeamStates: (
        offererId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/oferente/${offererId}/totales/equipos/estados`),
        );
    },

    getCompanyFileSolicitations: (
        solicitationId: number,
    ): Promise<CompanySolicitationFileHistory[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/legajos`),
        );
    },

    requestSolicitationCompanyFile: (
        solicitationId: number,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(`/${solicitationId}/solicitar-legajo`),
            {},
        );
    },

    createOffererDocToLinkWithLibrary: (
        offererId: number,
        solicitationId: number,
        submittedData: DocumentCopyBody,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(
                `/oferente/${offererId}/${solicitationId}/informes`,
            ),
            {
                ...submittedData,
                codModulo: 1,
                codOrigen: 1,
            },
        );
    },

    getByOffererId: (
        offererId: number,
        filter: SolicitationFilter,
    ): Promise<EntityListWithPagination<SolicitationViewDTO>> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpSolicitation.getEndpoint(`/oferente/${offererId}`),
            filter,
        );
    },

    getById: (solicitationId: number): Promise<SolicitationViewDTO> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}`),
        );
    },

    getRequirements: (
        solicitationId: number,
    ): Promise<SolicitationRequirementDTO[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/requerimientos`),
        );
    },

    getActionsById: (
        solicitationId: number,
    ): Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/acciones`),
        );
    },

    getTotalsActiveStatesByCompanyId: (
        companyId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(
                `/empresa/${companyId}/estados-clasificaciones/vigentes/totales`,
            ),
        );
    },

    getOffererSummaryByCompanyId: (
        companyId: number,
    ): Promise<OffererSummaryView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/empresa/${companyId}/oferentes`),
        );
    },

    getSolicitationsReadyToSend: (
        companyId: number,
        filter: SolicitationReadyToSendFilter
    ): Promise<SolicitationViewDTO[]> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpSolicitation.getEndpoint(
                `/empresa/${companyId}/listas-para-enviar`,
            ),
            filter
        );
    },

    getTotalsSolicitationsByCompany: (companyId: number): Promise<SolicitationTotalsViewCompany> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(
                `/empresa/${companyId}/totales`,
            )
        );
    },

    getByOffererAndCompanyId: (
        offererId: number,
        companyId: number,
    ): Promise<SolicitationSummaryViewDTO[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(
                `/oferente/${offererId}/empresas/${companyId}/vinculadas`,
            ),
        );
    },

    getPossibleResponsibleUsersByOffererId: (
        offererId: number,
    ): Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/oferente/${offererId}/responsables`),
        );
    },

    postResponsibleUserByOffererAndSolicitationId: (
        offererId: number,
        solicitationId: number,
        userId: number,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(
                `/oferente/${offererId}/${solicitationId}/responsables`,
            ),
            {
                idUsuarioResponsable: userId,
            },
        );
    },

    assignCommercialResponsible: (
        offererId: number,
        solicitationId: number,
    ): Promise<BaseResponse> =>
        HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(
                `/oferente/${offererId}/${solicitationId}/responsables/comerciales`,
            ),
            {},
        ),

    sendSolicitation: (solicitationId: number): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(`/${solicitationId}/enviar`),
            {},
        );
    },

    getCurrentSolicitationsByStatesClassifications: (
        companyId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(
                `/empresa/${companyId}/estados-clasificaciones/vigentes/totales`,
            ),
        );
    },

    getSolicitationsByStatesClassifications: (
        companyId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(
                `/empresa/${companyId}/estados-clasificaciones/totales`,
            ),
        );
    },

    getSolicitationsByProductService: (
        companyId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/empresa/${companyId}/servicios/totales`),
        );
    },

    getTotalLinesByOfferer: (
        companyId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/empresa/${companyId}/oferentes/totales`),
        );
    },

    getOffererCurrentSolicitationsByStatesClassifications: (
        offererId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(
                `/oferente/${offererId}/estados-clasificaciones/vigentes/totales`,
            ),
        );
    },

    getResponsibles: (
        offererId: number,
    ): Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/oferente/${offererId}/responsables`),
        );
    },

    getCommercialResponsibles: (
        offererId: number,
    ): Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(
                `/oferente/${offererId}/responsables/comerciales`,
            ),
        );
    },

    getOffererSolicitationsByStatesClassifications: (
        offererId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(
                `/oferente/${offererId}/estados-clasificaciones/totales`,
            ),
        );
    },

    getOffererSolicitationsByCompanies: (
        offererId: number,
    ): Promise<SolicitationTotalsView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(
                `/oferente/${offererId}/productos-lineas/totales`,
            ),
        );
    },

    setInitialMessage: (
        solicitationId: number,
        messageDTO: SolicitationInitialMessageDTO,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(`/${solicitationId}/mensaje-inicial`),
            messageDTO,
        );
    },

    cancelSolicitation: (solicitationId: number): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(`/${solicitationId}/cancelar`),
            {
                [BaseRequestFields.ModuleCode]: 1,
                [BaseRequestFields.OriginCode]: 1
            },
        );
    },

    cancelMultipleSolicitations: (solicitationsToCancel: SolicitationCancelMultiple): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(`/cancelar`),
            solicitationsToCancel,
        );
    },

    getSolicitationFlags: (solicitationId: number): Promise<SolicitationFlags> =>
        HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/flags`),
        ),

    shareSolicitation: (solicitationId: number, lstAccess: SolicitationAllowAccess[]): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(`/${solicitationId}/compartir`),
            lstAccess
        )
    },

    getSolicitationsShared: (solicitationId: number): Promise<SolicitationAccessView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/compartir`)
        )
    },

    getSolicitationCompanySteps: (solicitationId: number): Promise<SolicitationStep[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/empresas/pasos`)
        )
    },

    getSolicitationOffererSteps: (solicitationId: number): Promise<SolicitationStep[]> =>
        HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/oferentes/pasos`)
        ),

    verifyCompanyRequirements: (solicitationId: number): Promise<SolicitationCompanyRequirement> =>
        HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/verificar-requisitos`)
        ),

    getCompanyDataHeader: (solicitationId: number): Promise<SolicitationCompanyDataHeaderContainer> =>
        HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/datos-cabecera`)
        ),

    getCompanyDataHeaderCurrent: (solicitationId: number): Promise<SolicitationCompanyDataHeaderContainer> =>
        HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/datos-cabecera/actuales`)
        ),
    
    confirmCompanyAdmissionApproval: (solicitationId: number): Promise<BaseResponse> =>
        HttpAxiosRequest.post(
            HttpSolicitation.getEndpoint(`/${solicitationId}/confirmar-admision`),
            {}
        ),

    getAssociates: (solicitationId: number): Promise<SolicitationViewDTO[]> =>
        HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/asociadas`)
        ),

    getRelatedProductLines: (solicitationId: number): Promise<ProductLineView[]> =>
        HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/lineas-relacionadas`)
        ),
    
    getOffererResult: (solicitationId: number): Promise<SolicitationOffererResultView> =>
        HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/oferentes/resultados`)
        ),

    getOffererHistory: (solicitationId: number): Promise<SolicitationHistoryView[]> =>
        HttpAxiosRequest.get(
            HttpSolicitation.getEndpoint(`/${solicitationId}/oferentes/historiales`)
        ),
};
