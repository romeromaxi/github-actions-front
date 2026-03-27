import React from 'react';
import { PersonRelationshipTypeClassification } from 'types/company/companyEnums';
import CompanyRelatedPersonBaseList from './CompanyRelatedPersonBaseList';

function CompanySocietyList() {
  return (
    <CompanyRelatedPersonBaseList
      title="Integrantes de la Sociedad"
      titleDrawer="Integrante de la Sociedad"
      labelButton="Agregar Integrante"
      textIfDataNotFound={'Al parecer no encontramos socios cargados'}
      relationshipClassification={PersonRelationshipTypeClassification.Society}
    />
  );
}

export default CompanySocietyList;
