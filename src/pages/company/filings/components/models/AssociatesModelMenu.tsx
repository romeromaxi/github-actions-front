import React from 'react';
import { RelatedPersonType } from 'types/company/companySocietyData';
import PersonRelationshipModelMenu from './PersonRelationshipModelMenu';

interface AssociatesModelMenuProps {
  onBack: () => void;
  companyId: number;
}

const AssociatesModelMenu = ({
  onBack,
  companyId,
}: AssociatesModelMenuProps) => {
  return (
    <PersonRelationshipModelMenu
      title={'Socios'}
      companyId={companyId}
      relationshipType={RelatedPersonType.Associate}
      onBack={onBack}
    />
  );
};

export default AssociatesModelMenu;
