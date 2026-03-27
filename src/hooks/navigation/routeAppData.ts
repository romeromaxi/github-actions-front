import {GuestRoute, guestPathTemplates, GuestRouteParams} from "routes/guest/routeAppGuestData";
import {marketPathTemplates, MarketRoute, MarketRouteParams} from "routes/market/routeAppMarketData";
import {PymeRoute, pymePathTemplates, PymeRouteParams} from "routes/pyme/routeAppPymeData";
import {OffererRoute, offererPathTemplates, OffererRouteParams} from "routes/offerer/routeAppOffererData";
import {InternalRoute, internalPathTemplates, InternalRouteParams} from "routes/internal/routeAppInternalData";

export const AppRoutesDefinitions = {
    ...GuestRoute,
    ...MarketRoute,
    ...PymeRoute,
    ...OffererRoute,
    ...InternalRoute
} as const;

export type AppRouteKey = typeof AppRoutesDefinitions[keyof typeof AppRoutesDefinitions];

export type RouteParams =
    & GuestRouteParams
    & MarketRouteParams
    & PymeRouteParams
    & OffererRouteParams
    & InternalRouteParams;

export const routesPathTemplates: Record<AppRouteKey, string | (() => string)> = {
    ...guestPathTemplates,
    ...marketPathTemplates,
    ...pymePathTemplates,
    ...offererPathTemplates,
    ...internalPathTemplates
};