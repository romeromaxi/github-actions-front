import { CompanyIncomeStatementFields } from '../../../../types/company/companyFinanceInformationData';
import { useFormContext } from 'react-hook-form';
import { numberFormatter } from '../../../../util/formatters/numberFormatter';
import { Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

interface CompanyIncomeFieldVariationProps {
  nameBase: string;
  field: CompanyIncomeStatementFields;
}

export const CompanyIncomeFieldVariation = ({
  nameBase,
  field,
}: CompanyIncomeFieldVariationProps) => {
  const { watch } = useFormContext();
  const watchCurrentField = watch(`${nameBase}.${field}`);
  const watchLastField = watch(`${nameBase}.estadoResultadoAnterior.${field}`);

  const getVariationPercentage = () => {
    const currentNumber = parseFloat(watchCurrentField);
    const lastNumber = parseFloat(watchLastField);

    if (
      lastNumber == 0 ||
      currentNumber == 0 ||
      !lastNumber ||
      !currentNumber
    ) {
      return '-';
    }

    return numberFormatter.toStringWithPercentage(
      ((currentNumber - lastNumber) / lastNumber) * 100,
    );
  };

  return (
    <Typography
      color={grey[600]}
      fontSize={14}
      fontWeight={600}
      textAlign={'center'}
    >
      {getVariationPercentage()}
    </Typography>
  );
};

export default CompanyIncomeFieldVariation;
