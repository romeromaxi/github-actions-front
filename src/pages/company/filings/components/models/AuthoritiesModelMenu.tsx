import React from 'react';
import { RelatedPersonType } from 'types/company/companySocietyData';
import PersonRelationshipModelMenu from './PersonRelationshipModelMenu';

interface AuthoritiesModelMenuProps {
  onBack: () => void;
  companyId: number;
}

const AuthoritiesModelMenu = ({
  onBack,
  companyId,
}: AuthoritiesModelMenuProps) => {
  return (
    <PersonRelationshipModelMenu
      title={'Autoridades'}
      companyId={companyId}
      relationshipType={RelatedPersonType.Authorities}
      onBack={onBack}
    />
  );
};

export default AuthoritiesModelMenu;
