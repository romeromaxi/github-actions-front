export const GuestRoute = {
    Home: "home",
    Login: "login",
    SignUp: "signup",
    GuestSharedSolicitation: "guestSharedSolicitationGuid",
    GuestSharedDocumentation: "guestSharedDocumentationGuid",
    GuestOffererLoginSlug: "guestOffererLoginSlug",
    GuestResetPassword: "guestResetPassword",
    GuestSignup: "guestSignup",
    GuestSignupInvitation: "guestSignupInvitation",
    GuestSignupResponsibleInvitation: "guestSignupResponsibleInvitation",
    GuestInternalLogin: "guestInternalLogin",
    GuestHelpSlug: "guestHelpSlug",
    GuestHelp: "guestHelp",
    GuestBetterChoiceSlug: "guestBetterChoiceSlug",
    GuestBetterChoice: "guestBetterChoice",

    LucAboutPage: "lucAboutPage",
    LucSolutionsForPymesPage: "lucSolutionsForPymesPage",
    LucFAQPage: "lucFAQPage",
    LucBlogPage: "lucBlogPage",
    LucContactPage: "lucContactPage",
    LucGlossaryPage: "lucGlossaryPage",
    LucInstructivePage: "lucInstructivePage",
} as const;

type AppRouteKey = typeof GuestRoute[keyof typeof GuestRoute];


export type GuestRouteParams = {
    [GuestRoute.Home]: undefined;
    [GuestRoute.Login]: undefined;
    [GuestRoute.SignUp]: undefined;
    [GuestRoute.GuestSharedSolicitation]: { guid: string };
    [GuestRoute.GuestSharedDocumentation]: { guid: string };
    [GuestRoute.GuestOffererLoginSlug]: { offererSlug: string };
    [GuestRoute.GuestResetPassword]: undefined;
    [GuestRoute.GuestSignup]: undefined;
    [GuestRoute.GuestSignupInvitation]: undefined;
    [GuestRoute.GuestSignupResponsibleInvitation]: undefined;
    [GuestRoute.GuestInternalLogin]: undefined;
    [GuestRoute.GuestHelpSlug]: { slug: string };
    [GuestRoute.GuestHelp]: undefined;
    [GuestRoute.GuestBetterChoiceSlug]: { slug: string };
    [GuestRoute.GuestBetterChoice]: undefined;
    
    [GuestRoute.LucAboutPage]: undefined;
    [GuestRoute.LucSolutionsForPymesPage]: undefined;
    [GuestRoute.LucFAQPage]: undefined;
    [GuestRoute.LucBlogPage]: undefined;
    [GuestRoute.LucContactPage]: undefined;
    [GuestRoute.LucGlossaryPage]: undefined;
    [GuestRoute.LucInstructivePage]: undefined;
};

export const guestPathTemplates: Record<AppRouteKey, string | (() => string)> = {
    [GuestRoute.Home]: "/",
    [GuestRoute.Login]: "/login",
    [GuestRoute.SignUp]: "/signup",
    [GuestRoute.GuestSharedSolicitation]: "/sharedSolicitation/:guid",
    [GuestRoute.GuestSharedDocumentation]: "/sharedDocumentation/:guid",
    [GuestRoute.GuestOffererLoginSlug]: "/offerer/login/:offererSlug",
    [GuestRoute.GuestResetPassword]: "/reset-password",
    [GuestRoute.GuestSignup]: "/signup",
    [GuestRoute.GuestSignupInvitation]: "/signup-invitation",
    [GuestRoute.GuestSignupResponsibleInvitation]: "/signup-responsible-invitation",
    [GuestRoute.GuestInternalLogin]: "/internal/login",
    [GuestRoute.GuestHelpSlug]: "/ayuda/:slug",
    [GuestRoute.GuestHelp]: "/ayuda",
    [GuestRoute.GuestBetterChoiceSlug]: "/informacion-para-elegir-mejor/:slug",
    [GuestRoute.GuestBetterChoice]: "/informacion-para-elegir-mejor",

    [GuestRoute.LucAboutPage]: () => window.URL_ABOUT_LUC,
    [GuestRoute.LucSolutionsForPymesPage]: () => window.URL_SOLUTIONS_FOR_PYMES_LUC,
    [GuestRoute.LucFAQPage]: () => window.URL_FAQ_LUC,
    [GuestRoute.LucBlogPage]: '/blog',
    [GuestRoute.LucContactPage]: () => window.URL_CONTACT_LUC,
    [GuestRoute.LucGlossaryPage]: () => window.URL_GLOSSARY_LUC,
    [GuestRoute.LucInstructivePage]: () => window.URL_INSTRUCTIVE_LUC,
};