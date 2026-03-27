import React, { useEffect, useState } from 'react';
import {
  CompanyFlowSemesterData,
  CompanyFlowView,
} from 'types/company/companyFlowData';
import { groupBySum } from 'util/helpers';
import { ITableColumn, TableList } from 'components/table';
import { numberFormatter } from 'util/formatters/numberFormatter';
import { Stack, Typography } from '@mui/material';
import {FlowFields} from "../../../types/general/generalFinanceData";

interface CompanyFlowYearlyTotalsProps {
  flowList?: CompanyFlowView[] | CompanyFlowSemesterData[];
  includeTitle?: boolean;
}

function CompanyFlowYearlyTotals({ flowList, includeTitle }: CompanyFlowYearlyTotalsProps) {
  const [loading, setLoading] = useState(false);
  const [groupedFlowList, setGroupedFlowList] = useState<CompanyFlowView[]>([]);

  const columns: ITableColumn[] = [
    {
      label: 'Año',
      textAlignHeader: 'center',
      onRenderCell: (flow: CompanyFlowView) => (
        <Stack
          justifyContent="flex-start !important"
          alignItems="start"
        >
          <Typography variant={'caption'} fontWeight={500}>{`${flow[FlowFields.Date]}`}</Typography>
          <Typography fontSize={'12px'} fontWeight={'400 !important'} color={'text.ligther'}>
            {`${flow[FlowFields.MonthQuantity]} meses incluidos`}
          </Typography>
        </Stack>
      ),
    },
    {
      label: 'Compras',
      textAlignHeader: 'center',
      onRenderCell: (flow: CompanyFlowView) => (
        <Typography textAlign={'right'}>
          {numberFormatter.toStringWithAmount(
            flow[FlowFields.Income],
            '$',
          )}
        </Typography>
      ),
    },
    {
      label: 'Ventas',
      textAlignHeader: 'center',
      onRenderCell: (flow: CompanyFlowView) => (
        <Typography textAlign={'right'}>
          {numberFormatter.toStringWithAmount(
            flow[FlowFields.Sale],
            '$',
          )}
        </Typography>
      ),
    },
  ];

  useEffect(() => {
    if (flowList) {
      setLoading(true);

      const flowListDateYear = flowList.map((f) => {
        return {
          ...f,
          [FlowFields.Date]: new Date(
            f[FlowFields.Date],
          ).getFullYear(),
          [FlowFields.MonthQuantity]: 1,
        };
      });
      // @ts-ignore
      const groupedList: CompanyFlowView[] = groupBySum(
        flowListDateYear,
        [FlowFields.Date],
        [
          FlowFields.Income,
          FlowFields.Sale,
          FlowFields.MonthQuantity,
        ],
      );
      setGroupedFlowList(groupedList);
      setLoading(false);
    }
  }, [flowList]);

  return (
      <TableList
          title={includeTitle ? "Totales por año" : undefined}
          entityList={groupedFlowList}
          columns={columns}
          isLoading={loading}
          error={false}
      />
  );
}

export default CompanyFlowYearlyTotals;
