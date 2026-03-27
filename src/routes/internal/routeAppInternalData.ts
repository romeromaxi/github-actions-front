export const InternalRoute = {
    InternalHome: "internalHome",
    InternalProfile: "internalProfile",
    InternalPersons: "internalPersons",
    InternalNotifications: "internalNotifications",
    InternalNotificationDetail: "internalNotificationDetail",
    InternalParameters: "internalParameters",
    InternalCompanies: "internalCompanies",
    InternalMails: "internalMails",
    InternalAdminProfile: "internalAdminProfile",
    InternalLines: "internalLines",
    InternalLineDetail: "internalLineDetail",
    InternalSolicitations: "internalSolicitations",
    InternalSolicitationDetail: "internalSolicitationDetail",
    InternalReports: "internalReports",
    InternalReportDetail: "internalReportDetail",
    InternalAds: "internalAds",
    InternalSelectedLines: "internalSelectedLines",
} as const;

type AppRouteKey = typeof InternalRoute[keyof typeof InternalRoute];

export type InternalRouteParams = {
    [InternalRoute.InternalHome]: undefined;
    [InternalRoute.InternalProfile]: undefined;
    [InternalRoute.InternalPersons]: undefined;
    [InternalRoute.InternalNotifications]: undefined;
    [InternalRoute.InternalNotificationDetail]: { notificationId: number };
    [InternalRoute.InternalParameters]: undefined;
    [InternalRoute.InternalCompanies]: undefined;
    [InternalRoute.InternalMails]: undefined;
    [InternalRoute.InternalAdminProfile]: undefined;
    [InternalRoute.InternalLines]: undefined;
    [InternalRoute.InternalLineDetail]: { lineId: number };
    [InternalRoute.InternalSolicitations]: undefined;
    [InternalRoute.InternalSolicitationDetail]: { solicitationId: number };
    [InternalRoute.InternalReports]: undefined;
    [InternalRoute.InternalReportDetail]: { reportId: number };
    [InternalRoute.InternalAds]: undefined;
    [InternalRoute.InternalSelectedLines]: undefined;
};

export const internalPathTemplates: Record<AppRouteKey, string | (() => string)> = {
    [InternalRoute.InternalHome]: "/internal/home",
    [InternalRoute.InternalProfile]: "/internal/home?tab=my-profile",
    [InternalRoute.InternalPersons]: "/internal/persons",
    [InternalRoute.InternalNotifications]: "internal/notificaciones",
    [InternalRoute.InternalNotificationDetail]: "internal/notificaciones/:notificationId",
    [InternalRoute.InternalParameters]: "/internal/parameters",
    [InternalRoute.InternalCompanies]: "/internal/companies",
    [InternalRoute.InternalMails]: "/internal/mails",
    [InternalRoute.InternalAdminProfile]: "/internal/admin/profile",
    [InternalRoute.InternalLines]: "/internal/lines",
    [InternalRoute.InternalLineDetail]: "/internal/lines/:lineId",
    [InternalRoute.InternalSolicitations]: "/internal/solicitations",
    [InternalRoute.InternalSolicitationDetail]: "/internal/solicitations/:solicitationId",
    [InternalRoute.InternalReports]: "/internal/reports",
    [InternalRoute.InternalReportDetail]: "/internal/reports/:reportId",
    [InternalRoute.InternalAds]: "/internal/ads",
    [InternalRoute.InternalSelectedLines]: "/internal/selected-lines",
};