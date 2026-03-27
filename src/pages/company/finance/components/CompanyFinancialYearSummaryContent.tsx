import { Grid } from '@mui/material';
import { DataWithLabel } from 'components/misc/DataWithLabel';

import { dateFormatter } from 'util/formatters/dateFormatter';

import { EnumColors } from 'types/general/generalEnums';
import {
  CompanyFinancialYear,
  CompanyFinancialYearFields,
} from 'types/company/companyFinanceInformationData';

interface CompanyFinancialYearSummaryContentProps {
  financialYear: CompanyFinancialYear;
}

function CompanyFinancialYearSummaryContent({
  financialYear,
}: CompanyFinancialYearSummaryContentProps) {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item>
        <DataWithLabel
          label="Año de Carga"
          data={financialYear[CompanyFinancialYearFields.Year]}
          color={EnumColors.GREEN}
          rowDirection
        />
      </Grid>
      <Grid item>
        <DataWithLabel
          label="Fecha de Cierre de Ejercicio"
          data={dateFormatter.toShortDate(
            financialYear[CompanyFinancialYearFields.Date],
          )}
          color={EnumColors.GREEN}
          rowDirection
        />
      </Grid>
    </Grid>
  );
}

export default CompanyFinancialYearSummaryContent;
