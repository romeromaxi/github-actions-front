import { CompanyDeclarationOfAssetsFields } from '../../../../types/company/companyFinanceInformationData';
import { useFormContext } from 'react-hook-form';
import { Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { numberFormatter } from '../../../../util/formatters/numberFormatter';

interface CompanyDeclarationOfAssetsYearVariationProps {
  nameBase: string;
  field: CompanyDeclarationOfAssetsFields;
}

const CompanyDeclarationOfAssetsYearVariation = ({
  nameBase,
  field,
}: CompanyDeclarationOfAssetsYearVariationProps) => {
  const { watch } = useFormContext();
  const watchCurrentField = watch(`${nameBase}.${field}`);
  const watchLastField = watch(
    `${nameBase}.manifestacionBienesAnterior.${field}`,
  );

  const getVariationPercentage = () => {
    const currentNumber = parseFloat(watchCurrentField);
    const lastNumber = parseFloat(watchLastField);

    if (lastNumber == 0 || !currentNumber || !lastNumber) {
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

export default CompanyDeclarationOfAssetsYearVariation;
