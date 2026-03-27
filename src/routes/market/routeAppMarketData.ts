export const MarketRoute = {
    MarketHome: "marketHome",
    MarketLuc: "marketLuc",
    MarketLucAssistedSearch: "marketLucAssistedSearch",
    MarketLucTeOrienta: "marketLucTeOrienta",
    MarketCasfog: "marketCasfog",
    MarketAlterSearch: "marketAlterSearch",
    MarketLineDetail: "marketLineDetail",
    MarketLanding: "marketLanding",
    MarketEncryptedLine: "marketEncryptedLine",
    MarketDetailLine: "marketDetailLine",
    MarketProductLineSearch: "marketProductLineSearch",
    MarketShoppingCart: "marketShoppingCart",
    MarketSolicitationList: "marketSolicitationList",
    MarketPrequalification: "marketPrequalification"
} as const;

type AppRouteKey = typeof MarketRoute[keyof typeof MarketRoute];

export type MarketRouteParams = {
    [MarketRoute.MarketHome]: undefined;
    [MarketRoute.MarketLuc]: undefined;
    [MarketRoute.MarketLucAssistedSearch]: undefined;
    [MarketRoute.MarketLucTeOrienta]: undefined;
    [MarketRoute.MarketCasfog]: undefined;
    [MarketRoute.MarketAlterSearch]: undefined;
    [MarketRoute.MarketLineDetail]: { idOfferer: string; idLine: string };
    [MarketRoute.MarketLanding]: undefined;
    [MarketRoute.MarketEncryptedLine]: { encryptedProductLineId: string };
    [MarketRoute.MarketDetailLine]: { uniProductLineId: string };
    [MarketRoute.MarketProductLineSearch]: undefined;
    [MarketRoute.MarketShoppingCart]: { companyId: string };
    [MarketRoute.MarketSolicitationList]: undefined;
    [MarketRoute.MarketPrequalification]: { companyId: string };
};

export const marketPathTemplates: Record<AppRouteKey, string | (() => string)> = {
    [MarketRoute.MarketHome]: "/market/home",
    [MarketRoute.MarketLuc]: "/market/luc",
    [MarketRoute.MarketLucAssistedSearch]: "/market/luc?redirect=ac08111f742d99c360628ede782615800ab2b5e0ef3fbd90ed919c0b919447a9b60e27623ee78fcc7021a47e7144df4ec044368bbd4452bb8e80e90600778c72e1721c923214746df1a57d1c1577c2db",
    [MarketRoute.MarketLucTeOrienta]: "/market/luc-te-orienta",
    [MarketRoute.MarketCasfog]: "/market/casfog",
    [MarketRoute.MarketAlterSearch]: "/market/lines/alterSearch",
    [MarketRoute.MarketLineDetail]: "/market/lines/:idOfferer/:idLine",
    [MarketRoute.MarketLanding]: "/market/landing",
    [MarketRoute.MarketEncryptedLine]: "/market/lines/:encryptedProductLineId",
    [MarketRoute.MarketDetailLine]: "/market/lines/:uniProductLineId",
    [MarketRoute.MarketProductLineSearch]: "/market/lines",
    [MarketRoute.MarketShoppingCart]: "/market/lines/carrito/:companyId",
    [MarketRoute.MarketSolicitationList]: "/market/solicitudes",
    [MarketRoute.MarketPrequalification]: "/market/lines/:companyId/prequalification"
};