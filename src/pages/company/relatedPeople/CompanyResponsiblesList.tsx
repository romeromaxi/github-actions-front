import React from 'react';
import { PersonRelationshipTypeClassification } from 'types/company/companyEnums';
import CompanyRelatedPersonBaseList from './CompanyRelatedPersonBaseList';

function CompanyResponsiblesList() {
  return (
    <CompanyRelatedPersonBaseList
      title="Responsables"
      titleDrawer="Responsable de la Sociedad"
      labelButton="Agregar Responsable"
      textIfDataNotFound={'Al parecer no encontramos responsables cargados'}
      relationshipClassification={
        PersonRelationshipTypeClassification.Responsibles
      }
    />
  );
}

export default CompanyResponsiblesList;
