import React from 'react';
import { Navigate } from 'react-router-dom';
import { marketSolicitationStorage } from '../../util/sessionStorage/marketSolicitationStorage';

interface MarketSolicitationRedirectionProps {
  children: JSX.Element;
}

function MarketSolicitationRedirection({
  children,
}: MarketSolicitationRedirectionProps): JSX.Element {
  if (!marketSolicitationStorage.getCurrentSolicitation()) {
    return (
      <>
        <Navigate to={'/market/home'} />
      </>
    );
  }
  return children;
}

export default MarketSolicitationRedirection;
