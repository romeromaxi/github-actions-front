
import {
  Stack,
  Typography,
} from '@mui/material';
import {ITableColumn, TableList} from '../../../../components/table';
import { ControlledTextFieldFilled } from '../../../../components/forms';
import React, {useEffect, useState} from 'react';
import { useFormContext } from 'react-hook-form';
import {numberFormatter} from "../../../../util/formatters/numberFormatter";
import {DescriptionFinancialTotals, DescriptionFinancialTotalsFields, PatrimonialStatementFields} from "../../../../types/general/generalFinanceData";

interface CompanyPatrimonialYearTableProps {
  year: number;
  nameBase: string;
}


declare type CompanyFinancialTotalsNumericalFields =
    PatrimonialStatementFields.ActiveCurrentTotal | PatrimonialStatementFields.ActiveNotCurrentTotal |
    PatrimonialStatementFields.ActiveTotal | PatrimonialStatementFields.PassiveCurrentTotal |
    PatrimonialStatementFields.PassiveNotCurrentTotal | PatrimonialStatementFields.PassiveTotal |
    PatrimonialStatementFields.NetPatrimonyTotal;

interface CompanyFinancialTotalsNumericalColumns {
  label: string;
  field: CompanyFinancialTotalsNumericalFields;
  total?: boolean;
}



const financialTotalsColumns: CompanyFinancialTotalsNumericalColumns[] = [
  {
    label: 'Activo Corriente',
    field: PatrimonialStatementFields.ActiveCurrentTotal,
  },
  {
    label: 'Activo No Corriente',
    field: PatrimonialStatementFields.ActiveNotCurrentTotal,
  },
  {
    label: 'Total Activo',
    field: PatrimonialStatementFields.ActiveTotal,
    total: true,
  },
  {
    label: 'Pasivo Corriente',
    field: PatrimonialStatementFields.PassiveCurrentTotal,
  },
  {
    label: 'Pasivo No Corriente',
    field: PatrimonialStatementFields.PassiveNotCurrentTotal,
  },
  {
    label: 'Total Pasivo',
    field: PatrimonialStatementFields.PassiveTotal,
    total: true,
  },
  {
    label: 'Patrimonio Neto',
    field: PatrimonialStatementFields.NetPatrimonyTotal,
    total: true,
  }
]
const CompanyPatrimonialYearTable = ({
  year,
  nameBase,
}: CompanyPatrimonialYearTableProps) => {
  const { control, watch } = useFormContext();
  const [columns, setColumns] = useState<ITableColumn[]>([]);
  const [financialTotal, setFinancialTotals] =
      useState<DescriptionFinancialTotals[]>();
  
  const patrimonialPreviousNameBase = `${nameBase}.estadoPatrimonialAnterior`
  const handleFocus = (e: any) => e.target.select();

  const getVariation = (field: PatrimonialStatementFields): string => {
    //@ts-ignore
    let currentYear: number | undefined = watch(`${nameBase}.${field}`);
    //@ts-ignore
    let lastYear: number | undefined = watch(`${patrimonialPreviousNameBase}.${field}`);

    if (!currentYear || !lastYear) return '-';

    return numberFormatter.toStringWithPercentage(
        ((currentYear - lastYear) / lastYear) * 100,
    );
  };
  const checkingHighlighted = (entity: DescriptionFinancialTotals) =>
      entity[DescriptionFinancialTotalsFields.Highlighted];

  useEffect(() => {
    setFinancialTotals(undefined);
    setColumns([]);

    setColumns([
      {
        label: '',
        value: DescriptionFinancialTotalsFields.Description,
        textAlign: 'left',
        onCheckingHighlighted: checkingHighlighted
      },
      {
        label: year.toString(),
        value: DescriptionFinancialTotalsFields.TotalCurrentYear,
        currency: "$",
        textAlign: 'right',
        textAlignHeader: 'right',
        onCheckingHighlighted: checkingHighlighted,
        onRenderCell: (item: DescriptionFinancialTotals) =>
            item[DescriptionFinancialTotalsFields.Highlighted] ?
                <div>
                  {numberFormatter.toStringWithAmount(watch(`${nameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), "$")}
                </div>
                :
                <ControlledTextFieldFilled control={control}
                                           name={`${nameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
                                           disabled={item[DescriptionFinancialTotalsFields.Highlighted]}
                                           fullWidth
                                           currency
                                           textAlign={'right'}
                                           onFocus={handleFocus}
                />
      },
      {
        label: (year - 1).toString(),
        value: DescriptionFinancialTotalsFields.TotalPreviousYear,
        currency: "$",
        textAlign: 'right',
        textAlignHeader: 'right',
        onCheckingHighlighted: checkingHighlighted,
        onRenderCell: (item: DescriptionFinancialTotals) =>
            item[DescriptionFinancialTotalsFields.Highlighted] ?
                <div>
                  {numberFormatter.toStringWithAmount(watch(`${patrimonialPreviousNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), "$")}
                </div>
                :
                <ControlledTextFieldFilled control={control}
                                           name={`${patrimonialPreviousNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
                                           disabled={item[DescriptionFinancialTotalsFields.Highlighted]}
                                           fullWidth
                                           currency
                                           textAlign={'right'}
                                           onFocus={handleFocus}
                />
      },
      {
        label: 'Variación',
        value: DescriptionFinancialTotalsFields.Variation,
        textAlign: 'right',
        textAlignHeader: 'center',
        onCheckingHighlighted: checkingHighlighted
      },
    ])

    const finalTotalData = financialTotalsColumns.map(x => {
      const field = x.field;

      return {
        [DescriptionFinancialTotalsFields.Description]: x.label,
        [DescriptionFinancialTotalsFields.TotalCurrentYear]: watch(`${nameBase}.${field}`) ?? 0,
        [DescriptionFinancialTotalsFields.TotalPreviousYear]: watch(`${patrimonialPreviousNameBase}.${field}`) ?? 0,
        [DescriptionFinancialTotalsFields.Variation]: getVariation(field),
        [DescriptionFinancialTotalsFields.Highlighted]: !!x.total,
        [DescriptionFinancialTotalsFields.Field]: field
      } as DescriptionFinancialTotals
    })

    setFinancialTotals(finalTotalData);
  }, []);
  return (
      <Stack spacing={2}>
        <Typography variant={'subtitle2'} fontWeight={500} sx={{marginLeft: '16px !important'}}>Estado de Situación Patrimonial</Typography>

        <TableList entityList={financialTotal}
                   columns={columns}
                   isLoading={!financialTotal}
                   error={false}
        />
      </Stack>
  );
};

export default CompanyPatrimonialYearTable;
