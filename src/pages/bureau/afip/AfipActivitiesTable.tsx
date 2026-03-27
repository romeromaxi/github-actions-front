import React from 'react';
import { AfipActivity, AfipActivityFields } from 'types/nosis/nosisData';
import {
  ITableColumn,
  TableColumnType,
  TableList,
} from 'components/table';
import {Card, CardContent, CardHeader} from "@mui/material";

interface AfipActivitiesTableProps {
  title?: string,
  subtitle?: string,  
  activities?: AfipActivity[];
  loading: boolean;
  error: boolean;
}

function AfipActivitiesTable({
  title,
  subtitle,
  activities,
  loading,
  error,
}: AfipActivitiesTableProps) {
  const columns: ITableColumn[] = [
    { 
      label: 'Código', 
      value: AfipActivityFields.Activity,
      textAlign: 'left',
      textAlignHeader: 'left',
      width: '10% !important',
    },
    {
      label: 'Actividad',
      value: AfipActivityFields.ActivityDesc,
      textAlign: 'left',
      width: '75% !important'
    },
    {
      label: 'Fecha Inicio Act.',
      value: AfipActivityFields.Date,
      type: TableColumnType.Date,
      textAlign: 'right',
      textAlignHeader: 'right',
      width: '15% !important'
    },
  ];
  
  const TableListComponent = () => (
      <TableList<AfipActivity> entityList={activities}
                               columns={columns}
                               isLoading={loading}
                               error={error}
                               variant={'bureauStyle'}
      />
  )

  return (
      !!title ?
          <Card>
              <CardHeader title={title} 
                          subheader={subtitle}
              />
              
              <CardContent>
                  <TableListComponent />
              </CardContent>
          </Card>
          : 
          <TableListComponent />
  );
}

export default AfipActivitiesTable;
