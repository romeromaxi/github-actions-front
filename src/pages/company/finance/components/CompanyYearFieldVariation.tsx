import { CompanyBasePatrimonialStatementFields } from '../../../../types/company/companyFinanceInformationData';
import { useFormContext } from 'react-hook-form';
import { Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { numberFormatter } from '../../../../util/formatters/numberFormatter';

interface CompanyYearFieldVariationProps {
  nameBase: string;
  field: CompanyBasePatrimonialStatementFields;
}

const CompanyYearFieldVariation = ({
  nameBase,
  field,
}: CompanyYearFieldVariationProps) => {
  const { watch } = useFormContext();
  const watchCurrentField = watch(`${nameBase}.${field}`);
  const watchLastField = watch(
    `${nameBase}.estadoPatrimonialAnterior.${field}`,
  );

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

export default CompanyYearFieldVariation;
