import React from 'react';

import CardBaseLoading from 'components/cards/CardBaseLoading';
import CardBase, { InformationShownType } from 'components/cards/CardBase';
import CompanyRoleSummary from '../company/components/CompanyRoleSummary';

import { EnumColors } from 'types/general/generalEnums';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';

interface CompanyLegajoCardProps {
  company?: CompanyViewDTO;
}

function CompanyFileCard({ company }: CompanyLegajoCardProps) {
  return company ? (
    <CardBase
      baseColor={EnumColors.LUC_GRADIENT}
      showSummaryAlways
      title={company[CompanyViewDTOFields.BusinessName]}
      summaryContent={<CompanyRoleSummary company={company} />}
      startShowType={InformationShownType.SUMMARY}
    />
  ) : (
    <CardBaseLoading baseColor={EnumColors.LUC_GRADIENT} />
  );
}

export default CompanyFileCard;
