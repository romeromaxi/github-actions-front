import React from 'react';
import { PersonRelationshipTypeClassification } from 'types/company/companyEnums';
import CompanyRelatedPersonBaseList from './CompanyRelatedPersonBaseList';

function CompanyRepresentativesList() {
  return (
    <CompanyRelatedPersonBaseList
      title="Representantes"
      titleDrawer="Representante de la empresa"
      labelButton="Agregar Representante"
      textIfDataNotFound={'Al parecer no encontramos representantes cargados'}
      relationshipClassification={
        PersonRelationshipTypeClassification.Representatives
      }
    />
  );
}

export default CompanyRepresentativesList;
