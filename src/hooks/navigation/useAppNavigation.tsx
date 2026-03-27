import { startTransition } from "react";
import {NavigateOptions, useNavigate} from "react-router-dom";
import { generatePath } from "react-router";
import {routesPathTemplates, RouteParams} from "./routeAppData";

//#region Se definen Types para que el ide pueda detectar param obligatorios
type RoutesWithParams = {
    [K in keyof RouteParams]: RouteParams[K] extends undefined ? never : K;
}[keyof RouteParams];

type RoutesWithoutParams = {
    [K in keyof RouteParams]: RouteParams[K] extends undefined ? K : never;
}[keyof RouteParams];

type TypedGetPathFunction = {
    <K extends RoutesWithParams>(
        route: K,
        params: RouteParams[K],
        queryParams?: Record<string, string | number>
    ): string;

    <K extends RoutesWithoutParams>(
        route: K,
        params?: undefined,
        queryParams?: Record<string, string | number>
    ): string;
};

type AppNavigateOptions = NavigateOptions & {
    target?: '_blank' | '_self' | '_parent' | '_top'; // Para window.open
};

type TypedNavigateFunction = {    
    <K extends RoutesWithParams>(
        route: K,
        params: RouteParams[K],
        queryParams?: Record<string, string | number>,
        options?: AppNavigateOptions
    ): void;
    <K extends RoutesWithoutParams>(
        route: K,
        params?: undefined,
        queryParams?: Record<string, string | number>,
        options?: AppNavigateOptions
    ): void;
    (delta: number): void;
};
//#endregion

function buildUrl(path: string, queryParams?: Record<string, string | number>) {
    if (!queryParams) return path;
    const query = new URLSearchParams(queryParams as any).toString();
    return `${path}?${query}`;
}

function isExternalUrl(url: string): boolean {
    return /^https?:\/\//.test(url);
}

export function useAppNavigation() {
    const routerDomNavigate = useNavigate();

    const getPath: TypedGetPathFunction = <K extends keyof typeof routesPathTemplates>(
        route: K, params?: any, queryParams?: Record<string, string | number>
    ): string => {
        const template = routesPathTemplates[route];
        const strTemplate: string = typeof template === 'function' ? template() : template;
        const [rawPath, rawQuery] = strTemplate.split("?");

        const path = params ? generatePath(rawPath, params) : rawPath;
        const fixedQuery = rawQuery
            ? Object.fromEntries(new URLSearchParams(rawQuery))
            : {};
        
        const finalQuery: Record<string, string | number> = {
            ...fixedQuery,
            ...(queryParams ?? {})
        };

        return buildUrl(path, finalQuery);
    }
    
    const navigate: TypedNavigateFunction = ((route: any, params?: any, queryParams?: any, options?: AppNavigateOptions) => {
        if (typeof route === 'number') {
            startTransition(() => {
                routerDomNavigate(route);
            });
            return;
        }
        
        const path = getPath(route, params, queryParams);
        
        if (isExternalUrl(path)) {
            const target = options?.target ?? '_blank';
            window.open(path, target);
            return;
        }

      startTransition(() => {
        routerDomNavigate(path, options);
      });
    }) as TypedNavigateFunction;
        
    return {
        navigate,
        getPath
    };
}