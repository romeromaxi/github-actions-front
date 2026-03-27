import React, { useEffect, useState } from 'react';
import {
  BouncedCheques,
  BouncedChequesFields,
} from '../../../types/nosis/nosisData';
import {
  ITableColumn,
  TableList,
} from '../../../components/table';
import Typography from '@mui/material/Typography';
import { numberFormatter } from '../../../util/formatters/numberFormatter';

enum BouncedChequeAmountsTableRowFields {
  Reason = 'motivo',
  Amount = 'cantidad',
}

type BouncedChequeAmountsTableRow = {
  [BouncedChequeAmountsTableRowFields.Reason]: string;
  [BouncedChequeAmountsTableRowFields.Amount]: number;
};

interface BouncedChequesAmountsTableProps {
  bouncedCheques?: BouncedCheques;
  loading: boolean;
  error: boolean;
}

function BouncedChequesAmountsTable({
  bouncedCheques,
  loading,
  error,
}: BouncedChequesAmountsTableProps) {
  const [chequeList, setChequeList] = useState<BouncedChequeAmountsTableRow[]>(
    [],
  );

  const columns: ITableColumn[] = [
    { label: 'Motivo', value: BouncedChequeAmountsTableRowFields.Reason },
    {
      label: 'Monto',
      onRenderCell: (cheque) => (
        <Typography>
          {numberFormatter.toStringWithAmount(
            cheque[BouncedChequeAmountsTableRowFields.Amount],
            '$',
            1,
          )}
        </Typography>
      ),
    }
  ];

  useEffect(() => {
    bouncedCheques &&
      setChequeList([
        {
          [BouncedChequeAmountsTableRowFields.Reason]: 'SIN FONDOS, NO PAGADOS',
          [BouncedChequeAmountsTableRowFields.Amount]:
            bouncedCheques[BouncedChequesFields.NoFundsAmount],
        },
        {
          [BouncedChequeAmountsTableRowFields.Reason]:
            'OTROS MOTIVOS, NO PAGADOS',
          [BouncedChequeAmountsTableRowFields.Amount]:
            bouncedCheques[BouncedChequesFields.OthersAmount],
        },
        {
          [BouncedChequeAmountsTableRowFields.Reason]:
            'SIN FONDOS, SIN PAGO MULTA',
          [BouncedChequeAmountsTableRowFields.Amount]:
            bouncedCheques[BouncedChequesFields.NoFundsPenaltyAmount],
        },
      ]);
  }, [bouncedCheques]);

  return (
    <div>
      <TableList<BouncedChequeAmountsTableRow>
        title={'Montos'}
        totalsRowMapList={[
          {
            columnIndex: 1,
            entityField: BouncedChequeAmountsTableRowFields.Amount,
          },
        ]}
        entityList={chequeList}
        columns={columns}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}

export default BouncedChequesAmountsTable;
