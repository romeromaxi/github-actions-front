export const PymeRoute = {
    PymeHome: "pymeHome",
    PymeProfile: "pymeProfile",
    PymeNotifications: "pymeNotifications",
    PymeNotificationDetail: "pymeNotificationDetail",
    PymeCompanyDetail: "pymeCompanyDetail",
    PymeCompanyFileDetail: "pymeCompanyFileDetail",
    PymeCompanySolicitationList: "pymeCompanySolicitationList",
    PymeCompanyBalancesList: "pymeCompanyBalancesList",
    PymeCompanyFinancialFlowList: "pymeCompanyFinancialFlowList",
    PymeSolicitationDetail: "pymeSolicitationDetail",
    PymeCompanyRelatedPersonList: "pymeCompanyRelatedPersonList",
    
    PymeInfoBureau: "pymeInfoBureau",
    PymeInfoBureauSummary: "pymeInfoBureauSummary",
    PymeInfoBureauGeneralInfo: "pymeInfoBureauGeneralInfo",
    PymeInfoBureauBankInfo: "pymeInfoBureauBankInfo",
    PymeInfoBureauChecksInfo: "pymeInfoBureauChecksInfo",
    PymeInfoBureauContributionsInfo: "pymeInfoBureauContributionsInfo",
    PymeInfoBureauScoreInfo: "pymeInfoBureauScoreInfo",
    PymeInfoBureauFinanceIndicators: "pymeInfoBureauFinanceIndicators",
} as const;

type AppRouteKey = typeof PymeRoute[keyof typeof PymeRoute];

export type PymeRouteParams = {
    [PymeRoute.PymeHome]: undefined;
    [PymeRoute.PymeProfile]: undefined;
    [PymeRoute.PymeNotifications]: undefined;
    [PymeRoute.PymeNotificationDetail]: { notificationId: number };
    [PymeRoute.PymeCompanyDetail]: { companyId: number };
    [PymeRoute.PymeCompanyFileDetail]: { companyId: number };
    [PymeRoute.PymeCompanySolicitationList]: { companyId: number };
    [PymeRoute.PymeCompanyBalancesList]: { companyId: number };
    [PymeRoute.PymeCompanyFinancialFlowList]: { companyId: number };
    [PymeRoute.PymeCompanyRelatedPersonList]: { companyId: number };
    
    [PymeRoute.PymeSolicitationDetail]: { companyId: number, solicitationId: number };
    
    [PymeRoute.PymeInfoBureau]: { companyId: number };
    [PymeRoute.PymeInfoBureauSummary]: { companyId: number };
    [PymeRoute.PymeInfoBureauGeneralInfo]: { companyId: number };
    [PymeRoute.PymeInfoBureauBankInfo]: { companyId: number };
    [PymeRoute.PymeInfoBureauChecksInfo]: { companyId: number };
    [PymeRoute.PymeInfoBureauContributionsInfo]: { companyId: number };
    [PymeRoute.PymeInfoBureauScoreInfo]: { companyId: number };
    [PymeRoute.PymeInfoBureauFinanceIndicators]: { companyId: number };
};

export const pymePathTemplates: Record<AppRouteKey, string | (() => string)> = {
    [PymeRoute.PymeHome]: "/mi-cuenta",
    [PymeRoute.PymeProfile]: "/mi-cuenta?tab=perfil",
    [PymeRoute.PymeNotifications]: "/notificaciones",
    [PymeRoute.PymeNotificationDetail]: "/notificaciones/:notificationId",
    [PymeRoute.PymeCompanyDetail]: "/mis-empresas/:companyId",
    [PymeRoute.PymeCompanyFileDetail]: "/mis-empresas/:companyId?tab=company-file",
    [PymeRoute.PymeCompanySolicitationList]: "/mis-empresas/:companyId?tab=sentSolicitations",
    [PymeRoute.PymeCompanyBalancesList]: "/mis-empresas/:companyId?tab=generalData&subtab=financialStatements",
    [PymeRoute.PymeCompanyFinancialFlowList]: "/mis-empresas/:companyId?tab=generalData&subtab=economicFinancial",
    [PymeRoute.PymeCompanyRelatedPersonList]: "/mis-empresas/:companyId?tab=generalData&subtab=relatedPeople",
    [PymeRoute.PymeSolicitationDetail]: "/mis-solicitudes/:companyId/:solicitationId",
    
    [PymeRoute.PymeInfoBureau]: "/mis-empresas/:companyId?tab=bureau",
    [PymeRoute.PymeInfoBureauSummary]: "/mis-empresas/:companyId?tab=bureau&subtab=bureauSummary",
    [PymeRoute.PymeInfoBureauGeneralInfo]: "/mis-empresas/:companyId?tab=bureau&subtab=bureauGeneral",
    [PymeRoute.PymeInfoBureauBankInfo]: "/mis-empresas/:companyId?tab=bureau&subtab=bureauBank",
    [PymeRoute.PymeInfoBureauChecksInfo]: "/mis-empresas/:companyId?tab=bureau&subtab=bureauChecks",
    [PymeRoute.PymeInfoBureauContributionsInfo]: "/mis-empresas/:companyId?tab=bureau&subtab=bureauContributions",
    [PymeRoute.PymeInfoBureauScoreInfo]: "/mis-empresas/:companyId?tab=bureau&subtab=bureauScore",
    [PymeRoute.PymeInfoBureauFinanceIndicators]: "/mis-empresas/:companyId?tab=bureau&subtab=bureauFinance",
};