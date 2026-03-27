export const OffererRoute = {
    OffererProfile: "offererProfile",
    OffererHome: "offererHome",
    OffererTemplates: "offererTemplates",
    OffererSummary: "offererSummary",
    OffererReports: "offererReports",
    OffererReportDetail: "offererReportDetail",
    OffererReportsControlPanel: "offererReportsControlPanel",
    OffererReportsSolicitations: "offererReportsSolicitations",
    OffererReportsSolicitationsAnalysis: "offererReportsSolicitationsAnalysis",
    OffererReportsSolicitationsByTeam: "offererReportsSolicitationsByTeam",
    OffererLines: "offererLines",
    OffererLinesDetail: "offererLinesDetail",
    OffererConfiguration: "offererConfiguration",
    OffererUsersAdmin: "OffererUsersAdmin",

    /* OffererSolicitations - Solicitudes */
    OffererSolicitations: "offererSolicitations",
    OffererSolicitationDetail: "offererSolicitationDetail",
    OffererSolicitationDetailBalancesList: "offererSolicitationDetailBalancesList",
    OffererSolicitationDetailFinancialFlowList: "offererSolicitationDetailFinancialFlowList",
    OffererSolicitationDetailProgress: "offererSolicitationDetailInternalProgress",
    OffererSolicitationDetailInternalTracking: "offererSolicitationDetailInternalTracking",
    
    /* OffererProspects - Base CUITs */
    OffererProspects: "offererProspects",
    OffererProspectDetail: "offererProspectDetail",
    OffererProspectDetailBalancesList: "offererProspectDetailBalancesList",
    OffererProspectDetailFinancialFlowList: "offererProspectDetailFinancialFlowList",
    
    OffererIntegration: "offererIntegration",
    OffererNotifications: "offererNotifications",
    OffererNotificationDetail: "offererNotificationDetail",
    OffererLibrary: "offererLibrary",
} as const;

type AppRouteKey = typeof OffererRoute[keyof typeof OffererRoute];

export type OffererRouteParams = {
    [OffererRoute.OffererProfile]: undefined;
    [OffererRoute.OffererHome]: undefined;
    [OffererRoute.OffererTemplates]: undefined;
    [OffererRoute.OffererSummary]: undefined;
    [OffererRoute.OffererReports]: undefined;
    [OffererRoute.OffererReportsControlPanel]: undefined;
    [OffererRoute.OffererReportsSolicitations]: undefined;
    [OffererRoute.OffererReportsSolicitationsAnalysis]: undefined;
    [OffererRoute.OffererReportsSolicitationsByTeam]: undefined;
    [OffererRoute.OffererReportDetail]: { reportId: string };
    [OffererRoute.OffererLines]: undefined;
    [OffererRoute.OffererLinesDetail]: { lineId: string };
    [OffererRoute.OffererConfiguration]: undefined;
    [OffererRoute.OffererUsersAdmin]: undefined;

    /* OffererSolicitations - Solicitudes */
    [OffererRoute.OffererSolicitations]: undefined;
    [OffererRoute.OffererSolicitationDetail]: { solicitationId: number };
    [OffererRoute.OffererSolicitationDetailBalancesList]: { solicitationId: number };
    [OffererRoute.OffererSolicitationDetailFinancialFlowList]: { solicitationId: number };
    [OffererRoute.OffererSolicitationDetailProgress]: { solicitationId: number };
    [OffererRoute.OffererSolicitationDetailInternalTracking]: { solicitationId: number };
    
    /* OffererProspects - Base CUITs */
    [OffererRoute.OffererProspects]: undefined;
    [OffererRoute.OffererProspectDetail]: { clientPortfolioGuid: string };
    [OffererRoute.OffererProspectDetailBalancesList]: { clientPortfolioGuid: string };
    [OffererRoute.OffererProspectDetailFinancialFlowList]: { clientPortfolioGuid: string };
    
    [OffererRoute.OffererIntegration]: undefined;
    [OffererRoute.OffererNotifications]: undefined;
    [OffererRoute.OffererNotificationDetail]: { notificationId: string };
    [OffererRoute.OffererLibrary]: undefined;
};

export const offererPathTemplates: Record<AppRouteKey, string | (() => string)> = {
    [OffererRoute.OffererProfile]: "/offerer/configuration?tab=perfil",
    [OffererRoute.OffererHome]: "/offerer/home",
    [OffererRoute.OffererSummary]: "/offerer/summary",
    [OffererRoute.OffererReports]: "/offerer/reports",
    [OffererRoute.OffererReportsControlPanel]: "/offerer/reports/control-panel",
    [OffererRoute.OffererReportsSolicitations]: "/offerer/reports/solicitations",
    [OffererRoute.OffererReportsSolicitationsAnalysis]: "/offerer/reports/solicitations-analysis",
    [OffererRoute.OffererReportsSolicitationsByTeam]: "/offerer/reports/solicitations-by-team",
    [OffererRoute.OffererReportDetail]: "/offerer/reports/:reportId",
    [OffererRoute.OffererSolicitations]: "/offerer/solicitations",
    [OffererRoute.OffererSolicitationDetail]: "/offerer/solicitations/:solicitationId",
    [OffererRoute.OffererLines]: "/offerer/lines",
    [OffererRoute.OffererLinesDetail]: "/offerer/lines/:lineId",

    /* Offerer - Configuracion */
    [OffererRoute.OffererConfiguration]: "/offerer/configuration",
    [OffererRoute.OffererTemplates]: "/offerer/configuration?tab=templates",
    [OffererRoute.OffererLibrary]: "/offerer/configuration?tab=documentation",
    [OffererRoute.OffererUsersAdmin]: "/offerer/configuration?tab=usersSummary",
    [OffererRoute.OffererIntegration]: "/offerer/configuration?tab=integration",

    /* OffererSolicitations - Solicitudes */
    [OffererRoute.OffererSolicitations]: "/offerer/solicitations",
    [OffererRoute.OffererSolicitationDetail]: "/offerer/solicitations/:solicitationId",
    [OffererRoute.OffererSolicitationDetailBalancesList]: "/offerer/solicitations/:solicitationId?tab=balances",
    [OffererRoute.OffererSolicitationDetailFinancialFlowList]: "/offerer/solicitations/:solicitationId?tab=flows",
    [OffererRoute.OffererSolicitationDetailProgress]: "/offerer/solicitations/:solicitationId?tab=progress",
    [OffererRoute.OffererSolicitationDetailInternalTracking]: "/offerer/solicitations/:solicitationId?tab=internal-tracking",
    
    /* OffererProspects - Base CUITs */
    [OffererRoute.OffererProspects]: "/offerer/clientPortfolio",
    [OffererRoute.OffererProspectDetail]: "/offerer/clientPortfolio/:clientPortfolioGuid",
    [OffererRoute.OffererProspectDetailBalancesList]: "/offerer/clientPortfolio/:clientPortfolioGuid?tab=financial-statements",
    [OffererRoute.OffererProspectDetailFinancialFlowList]: "/offerer/clientPortfolio/:clientPortfolioGuid?tab=post-balance-flows",
    
    [OffererRoute.OffererNotifications]: "offerer/notificaciones",
    [OffererRoute.OffererNotificationDetail]: "offerer/notificaciones/:notificationId",
};