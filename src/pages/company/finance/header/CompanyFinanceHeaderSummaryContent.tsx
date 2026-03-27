import React from 'react';
import { Stack } from '@mui/material';

import { DataWithLabel } from 'components/misc/DataWithLabel';

import {
  CompanyFinanceHeader,
  CompanyFinanceHeaderFields,
} from 'types/company/companyFinanceInformationData';
import { EnumColors } from 'types/general/generalEnums';

import { dateFormatter } from 'util/formatters/dateFormatter';

interface CompanyFinanceHeaderSummaryContentProps {
  financeHeader: CompanyFinanceHeader;
}

function CompanyFinanceHeaderSummaryContent({
  financeHeader,
}: CompanyFinanceHeaderSummaryContentProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack>
        <DataWithLabel
          label="Fecha"
          data={dateFormatter.toShortDate(
            financeHeader[CompanyFinanceHeaderFields.Date],
          )}
          color={EnumColors.GREEN}
          rowDirection
        />
      </Stack>
    </Stack>
  );
}

export default CompanyFinanceHeaderSummaryContent;
