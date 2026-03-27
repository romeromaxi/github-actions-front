import React from 'react';

import {
  CompanyViewDTO,
} from '../../../types/company/companyData';
import { EntityWithIdFields } from '../../../types/baseEntities';
import CompanyLibraryAll from './CompanyLibraryAll';

interface CompanyLibraryProps {
  company: CompanyViewDTO;
}

function CompanyLibraryLegalPerson({ company }: CompanyLibraryProps) {
  return <CompanyLibraryAll companyId={company[EntityWithIdFields.Id]} />;
}

function CompanyLibraryPhysicalPerson({ company }: CompanyLibraryProps) {
  return <CompanyLibraryAll companyId={company[EntityWithIdFields.Id]} />;
}

interface CompanyLibraryPageProps extends CompanyLibraryProps {
  isPhysicalPerson?: boolean;
}

function CompanyLibrary({
  isPhysicalPerson,
  ...props
}: CompanyLibraryPageProps) {
  return isPhysicalPerson ? (
    <CompanyLibraryPhysicalPerson company={props.company} />
  ) : (
    <CompanyLibraryLegalPerson company={props.company} />
  );
}

export default CompanyLibrary;
