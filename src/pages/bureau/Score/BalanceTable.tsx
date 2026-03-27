import React, { useEffect, useState } from 'react';
import {
  Balance,
  Metrics,
  MetricsFields,
} from '../../../types/nosis/nosisData';
import { ITableColumn, TableList } from '../../../components/table';

enum BalanceTableRowFields {
  Title = 'titulo',
  Value = 'valor',
}

type BalanceTableRow = {
  [BalanceTableRowFields.Title]: string;
  [BalanceTableRowFields.Value]: number;
};

interface BalanceTableProps {
  balance?: Balance;
  metrics?: Metrics;
  loading: boolean;
  error: boolean;
}

function BalanceTable({ balance, metrics, loading, error }: BalanceTableProps) {
  const [rowList, setRowList] = useState<BalanceTableRow[]>([]);

  const columns: ITableColumn[] = [
    { label: 'Título', value: BalanceTableRowFields.Title, textAlignHeader: 'center', fontWeight: 'bold', onCheckingHighlighted: () => true },
    { label: 'Valor', value: BalanceTableRowFields.Value, textAlignHeader: 'center', fontWeight: 'bold', onCheckingHighlighted: () => true },
  ];

  useEffect(() => {
    balance &&
      metrics &&
      setRowList([
        {
          [BalanceTableRowFields.Title]: 'SCORE',
          [BalanceTableRowFields.Value]: metrics[MetricsFields.Scoring],
        }
      ]);
  }, [balance, metrics]);

  return (
    <div>
      <TableList
        entityList={rowList}
        columns={columns}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}

export default BalanceTable;
