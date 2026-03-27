import React from "react";

interface CenteredButtonWrapperProps {
  children: React.ReactNode;
}

export const CenteredButtonWrapper = React.memo(({ 
  children 
}: CenteredButtonWrapperProps) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }}>
    {children}
  </div>
));