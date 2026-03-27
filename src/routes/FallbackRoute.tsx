import React, { lazy, ReactElement, Suspense } from 'react';
import { Route } from 'react-router-dom';

const LazyRedirect = lazy(() => import('./LazyRedirect'));

export class FallbackRoute {
  static getRoute(): ReactElement {
    return (
      <Route
        key="fallback"
        path="*"
        element={
          <Suspense fallback={null}>
            <LazyRedirect />
          </Suspense>
        }
      />
    );
  }
}

const FallbackRouteExport = {
  getRoute: FallbackRoute.getRoute
};

export default FallbackRouteExport;