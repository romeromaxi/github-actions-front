import React from 'react';
import { RelatedPersonType } from 'types/company/companySocietyData';
import PersonRelationshipModelMenu from './PersonRelationshipModelMenu';

interface EmployeesModelMenuProps {
  onBack: () => void;
  companyId: number;
}

const EmployeesModelMenu = ({ onBack, companyId }: EmployeesModelMenuProps) => {
  return (
    <PersonRelationshipModelMenu
      title={'Empleados'}
      companyId={companyId}
      relationshipType={RelatedPersonType.Employees}
      onBack={onBack}
    />
  );
};

export default EmployeesModelMenu;
