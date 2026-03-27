
import React from 'react';
import CompanyDeclarationOfAssetsEditDetail from './CompanyDeclarationOfAssetsEditDetail';

interface CompanyDeclarationOfAssetsEditTabsProps {
  nameBase: string;
  expanded?: boolean;
  expandable?: boolean;
}

const CompanyDeclarationOfAssetsEditTabs = ({
  nameBase, expanded, expandable
}: CompanyDeclarationOfAssetsEditTabsProps) => {
  return (
      <CompanyDeclarationOfAssetsEditDetail nameBase={nameBase} 
                                            expanded={expanded}
                                            expandable={expandable}
      />
  );
};

export default CompanyDeclarationOfAssetsEditTabs;
