import React from 'react';
import {useFormContext} from "react-hook-form";
import {Box, Stack, Typography, useMediaQuery, useTheme,} from '@mui/material';

import {dateFormatter} from 'util/formatters/dateFormatter';
import {
  CompanyFlowFields, CompanyFlowInsert,
  CompanyFlowSemesterData,
  CompanyFlowView,
} from 'types/company/companyFlowData';
import {ControlledTextFieldFilled} from "components/forms";
import {ITableColumn, TableColumnType, TableList} from 'components/table';
import {CompanyFileEditFormFields} from "hooks/contexts/CompanyFileContext";

interface CompanyFlowTableDetailProps {
  flowList?: CompanyFlowSemesterData[] | CompanyFlowView[];
  physicalPerson?: boolean;
}

function CompanyFlowTableDetail(props: CompanyFlowTableDetailProps) {
  const columns : ITableColumn[] = [
    {
      label: 'Fecha',
      value: CompanyFlowFields.Date,
      textAlign: 'left',
      onRenderCell: (entity) => (
          <Typography>
            {dateFormatter.toMonthNameWithYear(entity[CompanyFlowFields.Date], true)}
          </Typography>
      )
    },
    {
      label: 'Ventas',
      value: CompanyFlowFields.Income,
      type: TableColumnType.Currency,
      currency: "$",
      textAlign: 'right',
      textAlignHeader: 'right',
    },
    {
      label: 'Compras',
      value: CompanyFlowFields.Sale,
      type: TableColumnType.Currency,
      currency: "$",
      textAlign: 'right',
      textAlignHeader: 'right',
    }
  ]
  
  return (
    <TableList entityList={props.flowList || []}
               columns={columns}
               isLoading={!props.flowList}
               error={false}
    />
  );
}

export const CompanyFlowTableEditDetail = () => {
  const { control, watch } = useFormContext();
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down('sm'));
  const flowList = watch(CompanyFileEditFormFields.Flow);

  const handleFocus = (e: any) => e.target.select();

  const groupedFlowList = flowList?.reduce((acc, flow) => {
    const dateKey = flow[CompanyFlowFields.Date];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(flow);
    return acc;
  }, {} as Record<string, CompanyFlowInsert[]>);

  if (isMobileScreenSize) {
    return (
      <Box>
        {groupedFlowList &&
          Object.entries(groupedFlowList).map(([date, flows]) => (
            <Box key={date} sx={{ mb: 3, borderBottom: '1px solid #EDF2F7', pb: 2 }}>
              <Box
                sx={{
                  backgroundColor: '#F7FAFC', 
                  borderRadius: '4px',
                  padding: '8px 16px',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight={500}>
                  {dateFormatter.toMonthNameWithYear(date, true)}
                </Typography>
              </Box>
  
              <Stack spacing={2} sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
                {flows.map((flow) => (
                  <Box key={flow[CompanyFlowFields.IndexToEdit]}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1, width: '100%', gap: 2 }}
                    >
                      <Typography variant="subtitle1" sx={{ flex: 1.4 }}>
                        Ventas
                      </Typography>
                      <Box sx={{ flex: 2.6, display: 'flex', justifyContent: 'flex-end' }}>
                        <ControlledTextFieldFilled
                          control={control}
                          name={`${CompanyFileEditFormFields.Flow}.${flow[CompanyFlowFields.IndexToEdit]}.${CompanyFlowFields.Income}`}
                          currency
                          textAlign="right"
                          onFocus={handleFocus}
                          sx={{ width: '100%' }}
                        />
                      </Box>
                    </Stack>
  
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: '100%', gap: 2 }}
                    >
                      <Typography variant="subtitle1" sx={{ flex: 1.4 }}>
                        Compras
                      </Typography>
                      <Box sx={{ flex: 2.6, display: 'flex', justifyContent: 'flex-end' }}>
                        <ControlledTextFieldFilled
                          control={control}
                          name={`${CompanyFileEditFormFields.Flow}.${flow[CompanyFlowFields.IndexToEdit]}.${CompanyFlowFields.Sale}`}
                          currency
                          textAlign="right"
                          onFocus={handleFocus}
                          sx={{ width: '100%' }}
                        />
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
      </Box>
    );
  }

  const columns: ITableColumn[] = [
    {
      label: 'Fecha',
      value: CompanyFlowFields.Date,
      textAlign: 'left',
      onRenderCell: (entity) => (
        <Typography>
          {dateFormatter.toMonthNameWithYear(entity[CompanyFlowFields.Date], true)}
        </Typography>
      ),
    },
    {
      label: 'Ventas',
      value: CompanyFlowFields.Income,
      textAlign: 'right',
      textAlignHeader: 'right',
      onRenderCell: (i: CompanyFlowInsert) => (
        <ControlledTextFieldFilled
          control={control}
          name={`${CompanyFileEditFormFields.Flow}.${i[CompanyFlowFields.IndexToEdit]}.${CompanyFlowFields.Income}`}
          currency
          textAlign="right"
          onFocus={handleFocus}
        />
      ),
    },
    {
      label: 'Compras',
      value: CompanyFlowFields.Sale,
      textAlign: 'right',
      textAlignHeader: 'right',
      onRenderCell: (i: CompanyFlowInsert) => (
        <ControlledTextFieldFilled
          control={control}
          name={`${CompanyFileEditFormFields.Flow}.${i[CompanyFlowFields.IndexToEdit]}.${CompanyFlowFields.Sale}`}
          currency
          textAlign="right"
          onFocus={handleFocus}
        />
      ),
    },
  ];

  return (
    <TableList
      entityList={flowList || []}
      columns={columns}
      isLoading={!flowList}
      error={false}
    />
  );
};

export default CompanyFlowTableDetail;
