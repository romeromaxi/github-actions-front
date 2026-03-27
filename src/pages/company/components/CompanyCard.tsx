import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { ValidationStatesType } from '../../../types/person/personEnums';
import CompanyCardReturned from './CompanyCardReturned';
import CompanyCardCompleted from './CompanyCardCompleted';
import { CompanyUserValidationTypes } from '../../../types/company/companyEnums';
import CompanyCardValidatedPending from './CompanyCardValidatedPending';
import CompanyCardCreatedWithoutBond from './CompanyCardCreatedWitoutBond';
import CompanyCardUnconfirmedApproval from './CompanyCardUnconfirmedApproval';

interface CompanyCardProps {
  company: CompanyViewDTO;
  afterValidate?: () => void;
}

function CompanyCard({ company, afterValidate }: CompanyCardProps) {
  if (
    company[CompanyViewDTOFields.CompanyStateCode] ===
    ValidationStatesType.PendingValidation
  ) {
    if (
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
        CompanyUserValidationTypes.CAPDocInRevission ||
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
        CompanyUserValidationTypes.PendingApproval
    )
      return (
        <CompanyCardCreatedWithoutBond company={company} hideAgg dontNavigate />
      );
  }

  if (
    company[CompanyViewDTOFields.CompanyStateCode] ===
    ValidationStatesType.Returned
  )
    if (
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
      CompanyUserValidationTypes.PendingBond
    )
      return <CompanyCardReturned company={company} onReload={afterValidate} />;

  if (
    company[CompanyViewDTOFields.CompanyStateCode] ===
    ValidationStatesType.Validated
  ) {
    if (
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
      CompanyUserValidationTypes.Active
    )
      return <CompanyCardCompleted company={company} />;
    if (
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
        CompanyUserValidationTypes.PendingApproval ||
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
        CompanyUserValidationTypes.PendingBond
    )
      return <CompanyCardValidatedPending company={company} />;
    if (
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
      CompanyUserValidationTypes.Blocked
    )
      return <CompanyCardValidatedPending company={company} blocked />;
  }

  if (
    company[CompanyViewDTOFields.CompanyStateCode] ===
    ValidationStatesType.CreatedWithoutConfirmation
  ) {
    if (
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
      CompanyUserValidationTypes.PendingBond
    )
      return (
        <CompanyCardCreatedWithoutBond
          company={company}
          onReload={afterValidate}
        />
      );
    if (
      company[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
      CompanyUserValidationTypes.PendingApproval
    )
      return (
        <CompanyCardUnconfirmedApproval
          company={company}
          onReload={afterValidate}
        />
      );
  }

  return <></>;
}

export default CompanyCard;
