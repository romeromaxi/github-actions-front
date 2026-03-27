import React from 'react';
import { ITableColumn, TableList } from 'components/table';
import { IdentityTaxes, IdentityTaxesFields } from 'types/nosis/nosisData';
import {Card, CardContent, CardHeader} from "@mui/material";

interface AfipIdentityTaxesTableProps {
  title?: string,
  subtitle?: string,
  taxes?: IdentityTaxes[];
  loading: boolean;
  error: boolean;
}

function AfipIdentityTaxesTable({
  title,
  subtitle,
  taxes,
  loading,
  error,
}: AfipIdentityTaxesTableProps) {
  const columns: ITableColumn[] = [
    {
      label: 'Código',
      value: IdentityTaxesFields.TaxId,
      textAlign: 'left',
      textAlignHeader: 'left',
      width: '10% !important',
    },
    { 
      label: 'Impuesto',
      value: IdentityTaxesFields.TaxDescription, 
      textAlign: 'left',
      width: '80% !important'
    },
    { 
      label: 'Período', 
      value: IdentityTaxesFields.Period, 
      textAlign: 'right',
      textAlignHeader: 'right',
      width: '10% !important'
    },
  ];

  const TableListComponent = () => (
      <TableList<IdentityTaxes> variant={'bureauStyle'}
                                entityList={taxes}
                                columns={columns}
                                isLoading={loading}
                                error={error}
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

export default AfipIdentityTaxesTable;
